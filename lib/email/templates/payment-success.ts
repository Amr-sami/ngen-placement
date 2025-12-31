import { EMAIL_CONFIG } from '../config';

interface PaymentSuccessProps {
    customerName: string;
    orderId: string;
    productName: string;
    amount: number;
    currency: string;
    transactionId: string;
}

/**
 * Generate payment success email HTML
 */
export function paymentSuccessTemplate(props: PaymentSuccessProps): string {
    const { customerName, orderId, productName, amount, currency, transactionId } = props;
    const { colors, appName, appUrl } = EMAIL_CONFIG;

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
    <title>Payment Successful</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${colors.background}; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: ${colors.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${colors.success} 0%, #34D399 100%); padding: 40px 20px; text-align: center;">
            <div style="width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px;">✓</span>
            </div>
            <h1 style="color: ${colors.white}; margin: 0; font-size: 28px;">Payment Successful!</h1>
        </div>
        
        <!-- Body -->
        <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: ${colors.text}; margin-bottom: 20px;">
                Hi <strong>${customerName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: ${colors.textLight}; line-height: 1.6; margin-bottom: 30px;">
                Great news! Your payment has been successfully processed. You now have full access to your course.
            </p>
            
            <!-- Payment Details Card -->
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: ${colors.textMuted}; font-size: 14px;">Order ID</td>
                        <td style="padding: 8px 0; color: ${colors.text}; font-size: 14px; text-align: right; font-weight: bold;">#${orderId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: ${colors.textMuted}; font-size: 14px;">Transaction ID</td>
                        <td style="padding: 8px 0; color: ${colors.text}; font-size: 14px; text-align: right; font-family: monospace;">${transactionId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: ${colors.textMuted}; font-size: 14px;">Product</td>
                        <td style="padding: 8px 0; color: ${colors.text}; font-size: 14px; text-align: right; font-weight: bold;">${productName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 16px 0 8px 0; border-top: 1px solid #bbf7d0; color: ${colors.text}; font-size: 16px; font-weight: bold;">Amount Paid</td>
                        <td style="padding: 16px 0 8px 0; border-top: 1px solid #bbf7d0; color: ${colors.success}; font-size: 20px; text-align: right; font-weight: bold;">${formattedAmount}</td>
                    </tr>
                </table>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${appUrl}/en/dashboard" 
                   style="display: inline-block; background-color: ${colors.success}; color: ${colors.white}; text-decoration: none; padding: 14px 40px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                    Start Learning Now
                </a>
            </div>
            
            <p style="font-size: 14px; color: ${colors.textMuted}; line-height: 1.6; text-align: center;">
                This email serves as your receipt. Please keep it for your records.
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

export default paymentSuccessTemplate;
