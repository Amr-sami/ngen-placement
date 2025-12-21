import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@ngen.school';
const APP_NAME = 'NGen Schools';

interface EmailResult {
    success: boolean;
    error?: string;
}

/**
 * Send email verification link to new users
 */
export async function sendVerificationEmail(
    email: string,
    token: string,
    firstName: string
): Promise<EmailResult> {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/en/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    try {
        const { error } = await resend.emails.send({
            from: `${APP_NAME} <${FROM_EMAIL}>`,
            to: email,
            subject: 'Verify your email - NGen Schools',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <div style="background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to NGen Schools!</h1>
                        </div>
                        <div style="padding: 40px 30px;">
                            <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">
                                Hi <strong>${firstName}</strong>,
                            </p>
                            <p style="font-size: 16px; color: #555555; line-height: 1.6; margin-bottom: 30px;">
                                Thank you for signing up! Please verify your email address by clicking the button below:
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${verificationUrl}" 
                                   style="display: inline-block; background-color: #FF6B35; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                                    Verify Email Address
                                </a>
                            </div>
                            <p style="font-size: 14px; color: #888888; line-height: 1.6;">
                                This link will expire in 24 hours. If you didn't create an account with NGen Schools, you can safely ignore this email.
                            </p>
                            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                            <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
                                If the button doesn't work, copy and paste this link into your browser:<br>
                                <a href="${verificationUrl}" style="color: #FF6B35; word-break: break-all;">${verificationUrl}</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('Email send error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Email service error:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

/**
 * Send password reset link
 */
export async function sendPasswordResetEmail(
    email: string,
    token: string,
    firstName: string
): Promise<EmailResult> {
    const resetUrl = `${process.env.NEXTAUTH_URL}/en/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    try {
        const { error } = await resend.emails.send({
            from: `${APP_NAME} <${FROM_EMAIL}>`,
            to: email,
            subject: 'Reset your password - NGen Schools',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <div style="background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Password Reset</h1>
                        </div>
                        <div style="padding: 40px 30px;">
                            <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">
                                Hi <strong>${firstName}</strong>,
                            </p>
                            <p style="font-size: 16px; color: #555555; line-height: 1.6; margin-bottom: 30px;">
                                We received a request to reset your password. Click the button below to create a new password:
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetUrl}" 
                                   style="display: inline-block; background-color: #FF6B35; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                                    Reset Password
                                </a>
                            </div>
                            <p style="font-size: 14px; color: #888888; line-height: 1.6;">
                                This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
                            </p>
                            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                            <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
                                If the button doesn't work, copy and paste this link into your browser:<br>
                                <a href="${resetUrl}" style="color: #FF6B35; word-break: break-all;">${resetUrl}</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('Email send error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Email service error:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

/**
 * Generic send email function for contact forms and other uses
 */
export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}): Promise<EmailResult> {
    try {
        const { error } = await resend.emails.send({
            from: `${APP_NAME} <${FROM_EMAIL}>`,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Email send error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Email service error:', error);
        return { success: false, error: 'Failed to send email' };
    }
}
