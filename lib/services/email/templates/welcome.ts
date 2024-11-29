import { EmailTemplate } from '../types';

export function getWelcomeEmailTemplate(name: string): EmailTemplate {
  return {
    subject: 'Welcome to InstantVerify',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to InstantVerify</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #000; margin-bottom: 20px;">Welcome ${name}!</h1>
            <p>Thank you for joining InstantVerify. We're excited to have you on board.</p>
            <p>With your verified account, you can now:</p>
            <ul style="margin: 20px 0;">
              <li>Access real-time verification services</li>
              <li>View detailed background check reports</li>
              <li>Track verification status</li>
              <li>Manage your verification requests</li>
            </ul>
            <p>If you have any questions, our support team is here to help.</p>
            <p style="margin-top: 30px;">
              Best regards,<br>
              The InstantVerify Team
            </p>
          </div>
        </body>
      </html>
    `,
  };
}