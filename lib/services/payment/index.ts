import { PaymentService } from './types';
import { RazorpayService } from './razorpay';
import { MockPaymentService } from './mock';
import { validateRazorpayConfig } from '@/lib/config/razorpay';

let paymentServiceInstance: PaymentService | null = null;

export function getPaymentService(): PaymentService {
  if (!paymentServiceInstance) {
    const { isValid } = validateRazorpayConfig();
    if (!isValid) {
      console.log('Using mock payment service - Razorpay not configured');
      paymentServiceInstance = new MockPaymentService();
    } else {
      paymentServiceInstance = new RazorpayService();
    }
  }
  
  return paymentServiceInstance;
}

export const paymentService = getPaymentService();