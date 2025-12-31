/**
 * Payment Email Configuration
 * 
 * Centralized configuration for payment-related emails
 */

// Email settings from environment
export const EMAIL_CONFIG = {
    fromEmail: process.env.MAIL_FROM || 'noreply@ngenschools.com',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@ngenschools.com',
    appName: 'NGen Schools',
    appUrl: process.env.APP_BASE_URL || 'http://localhost:3000',

    // Email template colors (NGen brand)
    colors: {
        primary: '#FF6B35',
        primaryGradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        text: '#333333',
        textLight: '#555555',
        textMuted: '#888888',
        background: '#f5f5f5',
        white: '#ffffff',
        border: '#eeeeee',
    },

    // Reusable styles
    styles: {
        container: `
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `,
        header: `
            background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
            padding: 40px 20px;
            text-align: center;
        `,
        headerTitle: `
            color: #ffffff;
            margin: 0;
            font-size: 28px;
        `,
        body: `
            padding: 40px 30px;
        `,
        button: `
            display: inline-block;
            background-color: #FF6B35;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 40px;
            border-radius: 30px;
            font-weight: bold;
            font-size: 16px;
        `,
        buttonSuccess: `
            display: inline-block;
            background-color: #10B981;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 40px;
            border-radius: 30px;
            font-weight: bold;
            font-size: 16px;
        `,
    },
};

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
}

export default EMAIL_CONFIG;
