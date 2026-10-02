declare module 'razorpay' {
  export interface OrdersCreateOptions {
    amount: number;
    currency: string;
    receipt?: string;
    partial_payment?: boolean;
    notes?: Record<string, any>;
  }

  export interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt?: string;
    status: string;
    attempts: number;
    notes?: Record<string, any>;
    created_at: number;
  }

  export interface RazorpayPaymentItem {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    method: string;
    email?: string;
    contact?: string;
    error_code?: string | null;
    error_description?: string | null;
    created_at: number;
  }

  export interface RazorpayPaymentsCollection {
    entity: string;
    count: number;
    items: RazorpayPaymentItem[];
  }

  export default class Razorpay {
    constructor(options: { key_id: string; key_secret: string; headers?: Record<string, string> });
    orders: {
      create(params: OrdersCreateOptions): Promise<RazorpayOrder>;
      fetch(orderId: string): Promise<RazorpayOrder>;
      fetchPayments(orderId: string): Promise<RazorpayPaymentsCollection>;
    };
    payments: {
      fetch(paymentId: string): Promise<any>;
      refund(paymentId: string, params?: { amount?: number; speed?: string; notes?: Record<string, any> }): Promise<any>;
    };
  }
}

interface Window {
  Razorpay: any;
}
