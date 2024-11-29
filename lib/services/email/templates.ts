import { EmailTemplate } from './types';

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

export function getPasswordResetEmailTemplate(email: string, resetUrl: string): EmailTemplate {
  return {
    subject: 'Reset your InstantVerify password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset your password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #000; margin-bottom: 20px;">Reset Your Password</h1>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">
              ${resetUrl}
            </p>
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  };
}

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