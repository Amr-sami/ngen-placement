import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { sendEmail } from '@/lib/email';

interface ContactRequestBody {
    name: string;
    email: string;
    subject: string;
    message: string;
    type: 'extra_attempt' | 'general' | 'support' | 'feedback';
    userId?: string;
}

export async function POST(req: Request) {
    try {
        const body: ContactRequestBody = await req.json();
        const { name, email, subject, message, type } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Get session for additional context
        const session = await getServerSession(authOptions);
        const isLoggedIn = !!session?.user?.email;

        // Prepare email content
        const emailSubject = `[NGen Contact] ${type === 'extra_attempt' ? '🎯 Extra Attempt Request' : '📧 New Message'}: ${subject}`;

        const emailBody = `
            <h2>New Contact Form Submission</h2>
            <hr/>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            ${isLoggedIn ? `<p><strong>Logged in as:</strong> ${session.user.email}</p>` : '<p><em>Guest user (not logged in)</em></p>'}
            <hr/>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br/>')}</p>
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
                <p>Hi ${name},</p>
                <p>We've received your message and will get back to you as soon as possible.</p>
                <hr/>
                <p><strong>Your message:</strong></p>
                <p>${message.replace(/\n/g, '<br/>')}</p>
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
