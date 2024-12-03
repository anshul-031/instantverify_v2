import { PaymentService, CreateOrderOptions, PaymentOrder, PaymentVerification } from './types';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../email/logger';

export class MockPaymentService implements PaymentService {
  async createOrder(options: CreateOrderOptions): Promise<PaymentOrder> {
    logger.info('Creating mock payment order:', options);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      id: `order_${uuidv4()}`,
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      status: 'created',
    };
  }

  async verifyPayment(verification: PaymentVerification): Promise<boolean> {
    logger.info('Verifying mock payment:', verification);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Always return true for mock verification
    return true;
  }
}