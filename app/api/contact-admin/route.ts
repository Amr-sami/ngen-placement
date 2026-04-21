import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth/authOptions';
import { sendEmail } from '@/lib/email';

const ContactSchema = z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(200),
    subject: z.string().trim().min(1).max(200),
    message: z.string().trim().min(1).max(5000),
    type: z.enum(['extra_attempt', 'general', 'support', 'feedback']),
    userId: z.string().trim().max(64).optional(),
});

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function POST(req: Request) {
    try {
        const rawBody = await req.json().catch(() => null);
        const parsed = ContactSchema.safeParse(rawBody);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: parsed.error.issues },
                { status: 400 }
            );
        }
        const { name, email, subject, message, type } = parsed.data;

        // Get session for additional context
        const session = await getServerSession(authOptions);
        const isLoggedIn = !!session?.user?.email;

        // Escape every user-controlled value before interpolating into HTML so
        // a crafted name / subject / message cannot inject markup into the
        // admin mailbox or the confirmation email.
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeSubject = escapeHtml(subject);
        const safeType = escapeHtml(type);
        const safeMessageHtml = escapeHtml(message).replace(/\n/g, '<br/>');
        const safeSessionEmail = isLoggedIn ? escapeHtml(session!.user!.email!) : '';

        // Prepare email content
        const emailSubject = `[NGen Contact] ${type === 'extra_attempt' ? '🎯 Extra Attempt Request' : '📧 New Message'}: ${subject}`;

        const emailBody = `
            <h2>New Contact Form Submission</h2>
            <hr/>
            <p><strong>Type:</strong> ${safeType}</p>
            <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            ${isLoggedIn ? `<p><strong>Logged in as:</strong> ${safeSessionEmail}</p>` : '<p><em>Guest user (not logged in)</em></p>'}
            <hr/>
            <h3>Message:</h3>
            <p>${safeMessageHtml}</p>
            <hr/>
            <p><small>Sent from NGen Placement Test Results page</small></p>
        `;

        // Send email to admin
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || 'admin@ngen.com';

        await sendEmail({
            to: adminEmail,
            subject: emailSubject,
            html: emailBody,
        });

        // Send confirmation to user
        await sendEmail({
            to: email,
            subject: 'We received your message - NGen',
            html: `
                <h2>Thank you for contacting us!</h2>
                <p>Hi ${safeName},</p>
                <p>We've received your message and will get back to you as soon as possible.</p>
                <hr/>
                <p><strong>Your message:</strong></p>
                <p>${safeMessageHtml}</p>
                <hr/>
                <p>Best regards,<br/>The NGen Team</p>
            `,
        });

        return NextResponse.json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!',
        });
    } catch (error) {
        console.error('Error sending contact message:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}
