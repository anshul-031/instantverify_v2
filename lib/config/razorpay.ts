import { z } from 'zod';

export const razorpayConfigSchema = z.object({
  keyId: z.string().min(1, "Razorpay Key ID is required"),
  keySecret: z.string().min(1, "Razorpay Key Secret is required"),
  webhookSecret: z.string().optional(),
  currency: z.string().default('INR'),
});

export type RazorpayConfig = z.infer<typeof razorpayConfigSchema>;

export const razorpayConfig: RazorpayConfig = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  currency: 'INR',
};

export function validateRazorpayConfig(): { isValid: boolean; errors?: string[] } {
  try {
    razorpayConfigSchema.parse(razorpayConfig);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: ['Invalid Razorpay configuration'] };
  }
}