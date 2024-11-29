import { EmailTemplate } from '../types';

export function getVerificationEmailTemplate(email: string, verificationUrl: string): EmailTemplate {
  return {
    subject: 'Verify your InstantVerify account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify your email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #000; margin-bottom: 20px;">Welcome to InstantVerify!</h1>
            <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
            <div style="margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Verify Email Address
              </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">
              ${verificationUrl}
            </p>
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  };
}