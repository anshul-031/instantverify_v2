export interface CreateOrderOptions {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerification {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentService {
  createOrder(options: CreateOrderOptions): Promise<PaymentOrder>;
  verifyPayment(verification: PaymentVerification): Promise<boolean>;
}

export class PaymentError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

// Razorpay specific types
export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}