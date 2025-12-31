import { EMAIL_CONFIG } from '../config';

interface AdminNotificationProps {
    type: 'new_order' | 'payment_success' | 'payment_failed';
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    productName: string;
    amount: number;
    currency: string;
    transactionId?: string;
    errorMessage?: string;
    timestamp: Date;
}

/**
 * Generate admin notification email HTML
 */
export function adminNotificationTemplate(props: AdminNotificationProps): string {
    const {
        type,
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        productName,
        amount,
        currency,
        transactionId,
        errorMessage,
        timestamp,
    } = props;
    const { colors, appName, appUrl } = EMAIL_CONFIG;

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);

    const formattedDate = timestamp.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const typeConfig = {
        new_order: {
            title: 'New Order Received',
            subtitle: 'A new order has been placed',
            headerColor: colors.primaryGradient,
            icon: '🛒',
        },
        payment_success: {
            title: 'Payment Successful',
            subtitle: 'A payment has been completed',
            headerColor: `linear-gradient(135deg, ${colors.success} 0%, #34D399 100%)`,
            icon: '✅',
        },
        payment_failed: {
            title: 'Payment Failed',
            subtitle: 'A payment attempt has failed',
            headerColor: `linear-gradient(135deg, ${colors.error} 0%, #F87171 100%)`,
            icon: '❌',
        },
    };

    const config = typeConfig[type];

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title} - Admin Notification</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${colors.background}; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: ${colors.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: ${config.headerColor}; padding: 30px 20px; text-align: center;">
            <span style="font-size: 40px;">${config.icon}</span>
            <h1 style="color: ${colors.white}; margin: 10px 0 0 0; font-size: 24px;">${config.title}</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px;">${config.subtitle}</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 30px;">
            <!-- Order Details -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 16px;">Order Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 6px 0; color: ${colors.textMuted}; font-size: 13px; width: 40%;">Order ID</td>
                        <td style="padding: 6px 0; color: ${colors.text}; font-size: 13px; font-weight: bold;">#${orderId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: ${colors.textMuted}; font-size: 13px;">Product</td>
                        <td style="padding: 6px 0; color: ${colors.text}; font-size: 13px; font-weight: bold;">${productName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: ${colors.textMuted}; font-size: 13px;">Amount</td>
                        <td style="padding: 6px 0; color: ${colors.primary}; font-size: 15px; font-weight: bold;">${formattedAmount}</td>
                    </tr>
                    ${transactionId ? `
                    <tr>
                        <td style="padding: 6px 0; color: ${colors.textMuted}; font-size: 13px;">Transaction ID</td>
                        <td style="padding: 6px 0; color: ${colors.text}; font-size: 13px; font-family: monospace;">${transactionId}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="padding: 6px 0; color: ${colors.textMuted}; font-size: 13px;">Timestamp</td>
                        <td style="padding: 6px 0; color: ${colors.text}; font-size: 13px;">${formattedDate}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Customer Details -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 16px 0; color: ${colors.text}; font-size: 16px;">Customer Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 6px 0; color: ${colors.textMuted}; font-size: 13px; width: 40%;">Name</td>
                        <td style="padding: 6px 0; color: ${colors.text}; font-size: 13px; font-weight: bold;">${customerName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: ${colors.textMuted}; font-size: 13px;">Email</td>
                        <td style="padding: 6px 0; color: ${colors.text}; font-size: 13px;">
                            <a href="mailto:${customerEmail}" style="color: ${colors.primary};">${customerEmail}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: ${colors.textMuted}; font-size: 13px;">Phone</td>
                        <td style="padding: 6px 0; color: ${colors.text}; font-size: 13px;">${customerPhone}</td>
                    </tr>
                </table>
            </div>
            
            ${errorMessage ? `
            <!-- Error Details -->
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 12px 0; color: ${colors.error}; font-size: 16px;">Error Details</h3>
                <p style="margin: 0; color: ${colors.text}; font-size: 13px;">${errorMessage}</p>
            </div>
            ` : ''}
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 24px 0;">
                <a href="${appUrl}/admin/orders/${orderId}" 
                   style="display: inline-block; background-color: ${colors.primary}; color: ${colors.white}; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: bold; font-size: 14px;">
                    View Order Details
                </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid ${colors.border}; margin: 24px 0;">
            
            <p style="font-size: 11px; color: #aaaaaa; text-align: center; margin: 0;">
                This is an automated notification from ${appName}
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Get email subject based on notification type
 */
export function getAdminNotificationSubject(type: AdminNotificationProps['type'], orderId: string): string {
    const subjects = {
        new_order: `🛒 New Order #${orderId}`,
        payment_success: `✅ Payment Successful - Order #${orderId}`,
        payment_failed: `❌ Payment Failed - Order #${orderId}`,
    };
    return subjects[type];
}

export default adminNotificationTemplate;
