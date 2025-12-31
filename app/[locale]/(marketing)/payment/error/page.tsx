'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Payment Error Page
 * 
 * Displayed when payment fails or encounters an error
 * Reads reason from query params to show specific error message
 */

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
    payment_failed: {
        title: 'Payment Failed',
        description: 'Your payment could not be processed. Please try again or use a different payment method.',
    },
    missing_order_id: {
        title: 'Invalid Request',
        description: 'We couldn\'t find your order information. Please try making a new purchase.',
    },
    server_error: {
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
    },
    insufficient_funds: {
        title: 'Insufficient Funds',
        description: 'Your card was declined due to insufficient funds. Please try a different payment method.',
    },
    card_declined: {
        title: 'Card Declined',
        description: 'Your card was declined. Please check your card details or try a different card.',
    },
    expired_card: {
        title: 'Card Expired',
        description: 'Your card has expired. Please use a valid card to complete the purchase.',
    },
    default: {
        title: 'Payment Error',
        description: 'An error occurred during payment processing. Please try again.',
    },
};

export default function PaymentErrorPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const reason = searchParams.get('reason') || 'payment_failed';

    const errorInfo = ERROR_MESSAGES[reason] || ERROR_MESSAGES.default;

    return (
        <div className="error-page">
            <style jsx>{`
                .error-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                }

                .error-card {
                    max-width: 500px;
                    width: 100%;
                    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                    border-radius: 24px;
                    padding: 48px 40px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }

                .error-icon {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #EF4444 0%, #F87171 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                    animation: shake 0.5s ease-out;
                }

                @keyframes shake {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    20%, 60% {
                        transform: translateX(-5px);
                    }
                    40%, 80% {
                        transform: translateX(5px);
                    }
                }

                .error-icon svg {
                    width: 50px;
                    height: 50px;
                    color: white;
                }

                .error-title {
                    font-size: 32px;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0 0 12px 0;
                }

                .error-subtitle {
                    font-size: 16px;
                    color: #a0aec0;
                    margin: 0 0 32px 0;
                    line-height: 1.6;
                }

                .error-details {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 32px;
                }

                .error-detail {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                }

                .error-label {
                    color: #a0aec0;
                    font-size: 14px;
                }

                .error-value {
                    color: #EF4444;
                    font-size: 14px;
                    font-weight: 500;
                }

                .help-section {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 32px;
                    text-align: left;
                }

                .help-title {
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 600;
                    margin: 0 0 12px 0;
                }

                .help-list {
                    margin: 0;
                    padding-left: 20px;
                    color: #a0aec0;
                    font-size: 13px;
                    line-height: 1.8;
                }

                .action-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .primary-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 16px 32px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #ffffff;
                    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
                    border: none;
                    border-radius: 12px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .primary-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
                }

                .secondary-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 14px 32px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #a0aec0;
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .secondary-button:hover {
                    color: #ffffff;
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .support-link {
                    margin-top: 24px;
                    font-size: 14px;
                    color: #a0aec0;
                }

                .support-link a {
                    color: #ff6b35;
                    text-decoration: none;
                }

                .support-link a:hover {
                    text-decoration: underline;
                }
            `}</style>

            <div className="error-card">
                <div className="error-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                </div>

                <h1 className="error-title">{errorInfo.title}</h1>
                <p className="error-subtitle">{errorInfo.description}</p>

                {(orderId || reason) && (
                    <div className="error-details">
                        {orderId && (
                            <div className="error-detail">
                                <span className="error-label">Order ID</span>
                                <span className="error-value">#{orderId.slice(-8)}</span>
                            </div>
                        )}
                        <div className="error-detail">
                            <span className="error-label">Error Code</span>
                            <span className="error-value">{reason.toUpperCase().replace(/_/g, ' ')}</span>
                        </div>
                    </div>
                )}

                <div className="help-section">
                    <h4 className="help-title">What you can try:</h4>
                    <ul className="help-list">
                        <li>Check your card details and try again</li>
                        <li>Use a different payment method</li>
                        <li>Contact your bank if the issue persists</li>
                        <li>Reach out to our support team for assistance</li>
                    </ul>
                </div>

                <div className="action-buttons">
                    <Link href="/en/pricing" className="primary-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 4v6h6M23 20v-6h-6" />
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                        </svg>
                        Try Again
                    </Link>
                    <Link href="/en" className="secondary-button">
                        Return to Homepage
                    </Link>
                </div>

                <p className="support-link">
                    Need help? <a href="mailto:support@ngenschools.com">Contact Support</a>
                </p>
            </div>
        </div>
    );
}
