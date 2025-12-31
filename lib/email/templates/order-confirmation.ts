import { EMAIL_CONFIG } from '../config';

interface OrderConfirmationProps {
    customerName: string;
    orderId: string;
    productName: string;
    amount: number;
    currency: string;
    orderDate: Date;
}

/**
 * Generate order confirmation email HTML
 */
export function orderConfirmationTemplate(props: OrderConfirmationProps): string {
    const { customerName, orderId, productName, amount, currency, orderDate } = props;
    const { colors, appName, appUrl } = EMAIL_CONFIG;

    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${colors.background}; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: ${colors.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: ${colors.primaryGradient}; padding: 40px 20px; text-align: center;">
            <h1 style="color: ${colors.white}; margin: 0; font-size: 28px;">Order Confirmation</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase!</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: ${colors.text}; margin-bottom: 20px;">
                Hi <strong>${customerName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: ${colors.textLight}; line-height: 1.6; margin-bottom: 30px;">
                We've received your order and it's being processed. Here are your order details:
            </p>
            
            <!-- Order Details Card -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: ${colors.textMuted}; font-size: 14px;">Order ID</td>
                        <td style="padding: 8px 0; color: ${colors.text}; font-size: 14px; text-align: right; font-weight: bold;">#${orderId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: ${colors.textMuted}; font-size: 14px;">Product</td>
                        <td style="padding: 8px 0; color: ${colors.text}; font-size: 14px; text-align: right; font-weight: bold;">${productName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: ${colors.textMuted}; font-size: 14px;">Date</td>
                        <td style="padding: 8px 0; color: ${colors.text}; font-size: 14px; text-align: right;">${formattedDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 16px 0 8px 0; border-top: 1px solid ${colors.border}; color: ${colors.text}; font-size: 16px; font-weight: bold;">Total</td>
                        <td style="padding: 16px 0 8px 0; border-top: 1px solid ${colors.border}; color: ${colors.primary}; font-size: 20px; text-align: right; font-weight: bold;">${formattedAmount}</td>
                    </tr>
                </table>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${appUrl}/en/dashboard" 
                   style="display: inline-block; background-color: ${colors.primary}; color: ${colors.white}; text-decoration: none; padding: 14px 40px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                    Go to Dashboard
                </a>
            </div>
            
            <p style="font-size: 14px; color: ${colors.textMuted}; line-height: 1.6;">
                If you have any questions about your order, please don't hesitate to contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid ${colors.border}; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
                ${appName} | <a href="${appUrl}" style="color: ${colors.primary};">Visit our website</a>
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

export default orderConfirmationTemplate;
