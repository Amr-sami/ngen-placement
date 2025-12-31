import { EMAIL_CONFIG } from '../config';

interface PaymentFailedProps {
    customerName: string;
    orderId: string;
    productName: string;
    amount: number;
    currency: string;
    errorMessage?: string;
}

/**
 * Generate payment failed email HTML
 */
export function paymentFailedTemplate(props: PaymentFailedProps): string {
    const { customerName, orderId, productName, amount, currency, errorMessage } = props;
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
    <title>Payment Failed</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${colors.background}; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: ${colors.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${colors.error} 0%, #F87171 100%); padding: 40px 20px; text-align: center;">
            <div style="width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px;">✕</span>
            </div>
            <h1 style="color: ${colors.white}; margin: 0; font-size: 28px;">Payment Failed</h1>
        </div>
        
        <!-- Body -->
        <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: ${colors.text}; margin-bottom: 20px;">
                Hi <strong>${customerName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: ${colors.textLight}; line-height: 1.6; margin-bottom: 30px;">
                Unfortunately, your payment could not be processed. Don't worry - no charges were made to your account.
            </p>
            
            ${errorMessage ? `
            <!-- Error Message -->
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: ${colors.error}; font-size: 14px;">
                    <strong>Error:</strong> ${errorMessage}
                </p>
            </div>
            ` : ''}
            
            <!-- Order Details Card -->
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
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
                        <td style="padding: 8px 0; color: ${colors.textMuted}; font-size: 14px;">Amount</td>
                        <td style="padding: 8px 0; color: ${colors.text}; font-size: 14px; text-align: right;">${formattedAmount}</td>
                    </tr>
                </table>
            </div>
            
            <p style="font-size: 14px; color: ${colors.textLight}; line-height: 1.6; margin-bottom: 24px;">
                <strong>Common reasons for payment failure:</strong>
            </p>
            <ul style="font-size: 14px; color: ${colors.textLight}; line-height: 1.8; margin-bottom: 30px; padding-left: 20px;">
                <li>Insufficient funds in your account</li>
                <li>Card expired or incorrect card details</li>
                <li>Transaction blocked by your bank</li>
                <li>Network connectivity issues</li>
            </ul>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${appUrl}/en/pricing" 
                   style="display: inline-block; background-color: ${colors.primary}; color: ${colors.white}; text-decoration: none; padding: 14px 40px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                    Try Again
                </a>
            </div>
            
            <p style="font-size: 14px; color: ${colors.textMuted}; line-height: 1.6; text-align: center;">
                Need help? Contact our support team at <a href="mailto:support@ngenschools.com" style="color: ${colors.primary};">support@ngenschools.com</a>
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

export default paymentFailedTemplate;
