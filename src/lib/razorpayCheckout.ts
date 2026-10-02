'use client';

/**
 * Frontend Razorpay Standard Web Checkout Integration
 *
 * Responsibilities:
 * 1. Loads checkout.js from exactly https://checkout.razorpay.com/v1/checkout.js via script injection.
 * 2. Opens the modal only after script loading succeeds.
 * 3. Never references RAZORPAY_KEY_SECRET (receives key_id rotatably from create-order response).
 * 4. Calls backend signature verification ONLY on success handler.
 * 5. Handles modal.ondismiss (cancellation) without triggering verification.
 * 6. Handles payment.failed with retry-friendly user feedback.
 */

let scriptLoadingPromise: Promise<boolean> | null = null;

export function loadRazorpayCheckoutScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if ((window as any).Razorpay) return Promise.resolve(true);

  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      if ((window as any).Razorpay) {
        resolve(true);
      } else {
        existingScript.addEventListener('load', () => resolve(true), { once: true });
        existingScript.addEventListener('error', () => resolve(false), { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.id = 'razorpay-checkout-script';

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      console.error('[Razorpay] Failed to load checkout.js from https://checkout.razorpay.com/v1/checkout.js');
      resolve(false);
    };

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export interface LaunchCheckoutOptions {
  key_id: string;
  order_id: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string | number>;
  themeColor?: string;
  paymentDbId?: string;
  verifyEndpoint?: string;
  onSuccess: (verificationResult: any) => void;
  onFailure?: (errorMessage: string) => void;
  onDismiss?: () => void;
}

export async function launchRazorpayStandardCheckout(options: LaunchCheckoutOptions): Promise<void> {
  const isLoaded = await loadRazorpayCheckoutScript();

  if (!isLoaded || typeof window === 'undefined' || !(window as any).Razorpay) {
    options.onFailure?.('Unable to load payment gateway. Please verify your internet connection and try again.');
    return;
  }

  const rzpOptions = {
    key: options.key_id,
    order_id: options.order_id,
    amount: options.amount,
    currency: options.currency || 'INR',
    name: options.name || 'PARINAAM 2026',
    description: options.description || 'Fest Registration',
    prefill: {
      name: options.prefill?.name || '',
      email: options.prefill?.email || '',
      contact: options.prefill?.contact || '',
    },
    notes: options.notes || {
      order_id: options.paymentDbId || options.order_id,
    },
    theme: {
      color: options.themeColor || '#8b5cf6',
    },
    handler: async function (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) {
      // POST all three fields to server-side verification route
      try {
        const verifyEndpoint = options.verifyEndpoint || '/api/verify-payment';
        const res = await fetch(verifyEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_db_id: options.paymentDbId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const data = await res.json();
        if (data.success) {
          // Show success to the user ONLY after the backend confirms
          options.onSuccess(data);
        } else {
          options.onFailure?.(data.error || 'Payment signature verification failed.');
        }
      } catch (err: any) {
        options.onFailure?.(err?.message || 'Network error confirming payment.');
      }
    },
    modal: {
      ondismiss: function () {
        // Customer closed the modal: treat as cancelled, not an error. Never call /api/verify-payment.
        options.onDismiss?.();
      },
    },
  };

  const rzp = new (window as any).Razorpay(rzpOptions);

  // Register payment.failed listener to show returned error.description and allow retry
  rzp.on('payment.failed', function (failedResponse: any) {
    const errorDesc =
      failedResponse?.error?.description ||
      failedResponse?.error?.reason ||
      'Payment failed. Please try again.';
    options.onFailure?.(errorDesc);
  });

  rzp.open();
}
