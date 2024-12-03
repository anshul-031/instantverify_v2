import Razorpay from 'razorpay';
import { createHmac } from 'crypto';
import { 
  PaymentService, 
  CreateOrderOptions, 
  PaymentOrder, 
  PaymentVerification, 
  PaymentError,
  RazorpayOrderResponse 
} from './types';
import { razorpayConfig } from '@/lib/config/razorpay';
import { logger } from '../email/logger';

export class RazorpayService implements PaymentService {
  private instance: Razorpay;

  constructor() {
    this.instance = new Razorpay({
      key_id: razorpayConfig.keyId,
      key_secret: razorpayConfig.keySecret,
    });
  }

  async createOrder(options: CreateOrderOptions): Promise<PaymentOrder> {
    try {
      const order = await this.instance.orders.create({
        amount: Math.round(options.amount * 100), // Convert to paise
        currency: options.currency,
        receipt: options.receipt,
        notes: options.notes,
      }) as RazorpayOrderResponse;

      return {
        id: order.id,
        amount: Number(order.amount) / 100, // Convert back to rupees
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      };
    } catch (error) {
      logger.error('Failed to create Razorpay order:', error);
      throw new PaymentError(
        'Failed to create payment order',
        'CREATE_ORDER_FAILED',
        error as Error
      );
    }
  }

  async verifyPayment(verification: PaymentVerification): Promise<boolean> {
    try {
      const { orderId, paymentId, signature } = verification;
      
      const text = `${orderId}|${paymentId}`;
      const expectedSignature = createHmac('sha256', razorpayConfig.keySecret)
        .update(text)
        .digest('hex');

      const isValid = expectedSignature === signature;
      
      if (!isValid) {
        logger.warn('Invalid payment signature detected:', {
          orderId,
          paymentId,
        });
      }

      return isValid;
    } catch (error) {
      logger.error('Payment verification failed:', error);
      throw new PaymentError(
        'Payment verification failed',
        'VERIFICATION_FAILED',
        error as Error
      );
    }
  }
}