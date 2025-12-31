import { Resend } from 'resend';
import { EMAIL_CONFIG, isEmailConfigured } from './config';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

interface SendEmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

/**
 * Send an email using Resend
 * 
 * If Resend is not configured, logs a warning and returns success (for development)
 */
export async function sendPaymentEmail(params: SendEmailParams): Promise<SendEmailResult> {
    const { to, subject, html, from } = params;

    // Check if email is configured
    if (!isEmailConfigured()) {
        console.warn('⚠️ Resend is not configured. Email would have been sent to:', to);
        console.warn('Subject:', subject);
        return { success: true, messageId: 'mock-' + Date.now() };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: from || `${EMAIL_CONFIG.appName} <${EMAIL_CONFIG.fromEmail}>`,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Email send error:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Email sent successfully:', data?.id);
        return { success: true, messageId: data?.id };
    } catch (error) {
        console.error('Email service error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send email'
        };
    }
}

/**
 * Send email to admin
 */
export async function sendAdminEmail(params: Omit<SendEmailParams, 'to'>): Promise<SendEmailResult> {
    return sendPaymentEmail({
        ...params,
        to: EMAIL_CONFIG.adminEmail,
    });
}

/**
 * Send multiple emails (e.g., customer + admin notification)
 */
export async function sendPaymentEmails(
    emails: SendEmailParams[]
): Promise<SendEmailResult[]> {
    const results = await Promise.allSettled(
        emails.map(email => sendPaymentEmail(email))
    );

    return results.map(result => {
        if (result.status === 'fulfilled') {
            return result.value;
        }
        return { success: false, error: 'Promise rejected' };
    });
}

export default sendPaymentEmail;
