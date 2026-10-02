import crypto from 'crypto';
import type Razorpay from 'razorpay';

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
}

export class RazorpayError extends Error {
  statusCode: number;
  code?: string;
  description?: string;

  constructor(message: string, statusCode = 500, code?: string, description?: string) {
    super(message);
    this.name = 'RazorpayError';
    this.statusCode = statusCode;
    this.code = code;
    this.description = description;
  }
}

/**
 * Validates Razorpay environment configuration.
 * Fails fast with 500 and logs missing variable names without exposing secrets.
 */
export function getRazorpayConfig(): RazorpayConfig {
  const missing: string[] = [];

  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId) missing.push('RAZORPAY_KEY_ID');
  if (!keySecret) missing.push('RAZORPAY_KEY_SECRET');

  if (missing.length > 0) {
    console.error(`[Razorpay Configuration Error] Missing required environment variable(s): ${missing.join(', ')}`);
    throw new RazorpayError('payment provider misconfigured', 500, 'PROVIDER_MISCONFIGURED');
  }

  return {
    keyId: keyId!,
    keySecret: keySecret!,
  };
}

/**
 * Returns a configured Razorpay SDK client instance.
 * Fails fast if SDK is missing or initialization fails.
 */
export function getRazorpayClient(): Razorpay {
  const { keyId, keySecret } = getRazorpayConfig();

  try {
    // Dynamic require ensures clear surface of import failure if dependency is not installed yet
    const RazorpayModule = require('razorpay');
    const RazorpayConstructor = RazorpayModule.default || RazorpayModule;
    return new RazorpayConstructor({
      key_id: keyId,
      key_secret: keySecret,
    });
  } catch (err: any) {
    console.error('[Razorpay SDK Error] Failed to initialize Razorpay SDK:', err?.message || err);
    throw new RazorpayError(
      `Razorpay SDK initialization failed: ${err?.message || 'SDK not installed'}`,
      500,
      'SDK_INIT_FAILED'
    );
  }
}

export interface CreateOrderParams {
  amount: number; // Smallest currency subunit (e.g., paise for INR, cents for USD)
  currency?: string; // ISO 4217 code
  receipt?: string; // Internal reference, max 40 chars
  notes?: Record<string, string | number>;
}

export interface CreatedOrderResult {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

/**
 * Validates inputs and creates a Razorpay order with bounded retry for transient failures.
 */
export async function createRazorpayOrder(params: CreateOrderParams): Promise<CreatedOrderResult> {
  const { keyId } = getRazorpayConfig();
  const client = getRazorpayClient();

  // Validate amount (minimum 100 subunits e.g. ₹1)
  if (!Number.isInteger(params.amount) || params.amount < 100) {
    throw new RazorpayError(
      'Amount must be an integer greater than or equal to 100 subunits (e.g. 100 paise = ₹1.00).',
      400,
      'INVALID_AMOUNT'
    );
  }

  // Validate currency ISO 4217 code
  const currency = (params.currency || 'INR').trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new RazorpayError(
      `Invalid currency code "${currency}". Must be a valid 3-letter ISO 4217 code.`,
      400,
      'INVALID_CURRENCY'
    );
  }

  // Validate and trim receipt if provided
  let receipt = params.receipt?.trim();
  if (receipt && receipt.length > 40) {
    receipt = receipt.substring(0, 40);
  }

  const payload = {
    amount: params.amount,
    currency,
    receipt,
    notes: params.notes || {},
  };

  // Bounded exponential backoff retry for network/5xx errors (max 2 retries)
  const maxRetries = 2;
  let attempt = 0;

  while (true) {
    try {
      const order = await client.orders.create(payload);

      // Verify contract: must return order id
      if (!order || !order.id || typeof order.id !== 'string') {
        console.error('[Razorpay Contract Error] Order creation response missing "id":', order);
        throw new RazorpayError(
          'Payment gateway response contract mismatch: order id missing.',
          502,
          'CONTRACT_MISMATCH'
        );
      }

      return {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: keyId,
      };
    } catch (err: any) {
      // If already a RazorpayError with 502/400/500, rethrow
      if (err instanceof RazorpayError) {
        throw err;
      }

      const status = err.statusCode || err.status || err.response?.status;
      const errorData = err.error || err.response?.data?.error;
      const description = errorData?.description || err.message || 'Payment provider error';

      // 401 Unauthorized -> invalid credentials (alert ops, never retry)
      if (status === 401 || err.statusCode === 401) {
        console.error('[Razorpay Configuration Error] 401 Unauthorized: Invalid API Key ID or Secret.');
        throw new RazorpayError('payment provider misconfigured', 500, 'UNAUTHORIZED');
      }

      // 400 Bad Request from Razorpay -> return 400 with error description
      if (status === 400) {
        throw new RazorpayError(description, 400, errorData?.code || 'BAD_REQUEST_ERROR', description);
      }

      // Other 4xx client errors -> do not retry blindly
      if (status && status >= 400 && status < 500) {
        throw new RazorpayError(description, status, errorData?.code || 'CLIENT_ERROR');
      }

      // 5xx or network timeout -> retry up to 2 times with backoff
      attempt++;
      if (attempt > maxRetries) {
        console.error(`[Razorpay Error] Network / server error after ${maxRetries} retries:`, description);
        throw new RazorpayError(
          'Payment gateway is temporarily unavailable. Please try again.',
          503,
          'GATEWAY_UNAVAILABLE'
        );
      }

      const backoffMs = Math.pow(2, attempt) * 200; // 400ms, 800ms
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }
}

export interface VerifySignatureParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Constant-time server-side signature verification.
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET)
 */
export function verifyRazorpaySignature(params: VerifySignatureParams): boolean {
  const { keySecret } = getRazorpayConfig();

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return false;
  }

  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(payload)
    .digest('hex');

  const expectedBuffer = Buffer.from(generatedSignature, 'utf8');
  const signatureBuffer = Buffer.from(razorpay_signature, 'utf8');

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

/**
 * Optional status fallback: Fetches payments for a given Razorpay order id.
 */
export async function getRazorpayOrderPayments(orderId: string) {
  const client = getRazorpayClient();

  if (!orderId || !orderId.trim()) {
    throw new RazorpayError('Order ID is required.', 400, 'MISSING_ORDER_ID');
  }

  const maxRetries = 2;
  let attempt = 0;

  while (true) {
    try {
      const payments = await client.orders.fetchPayments(orderId.trim());
      return payments;
    } catch (err: any) {
      const status = err.statusCode || err.status || err.response?.status;
      const errorData = err.error || err.response?.data?.error;
      const description = errorData?.description || err.message;

      if (status === 401) {
        console.error('[Razorpay Configuration Error] 401 Unauthorized.');
        throw new RazorpayError('payment provider misconfigured', 500, 'UNAUTHORIZED');
      }

      if (status === 404) {
        throw new RazorpayError('Order not found on payment gateway.', 404, 'ORDER_NOT_FOUND');
      }

      if (status && status >= 400 && status < 500) {
        throw new RazorpayError(description, status, errorData?.code);
      }

      attempt++;
      if (attempt > maxRetries) {
        throw new RazorpayError('Failed to fetch order status from gateway.', 503, 'GATEWAY_UNAVAILABLE');
      }

      const backoffMs = Math.pow(2, attempt) * 200;
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }
}
