'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Payment Success Page
 * 
 * Displayed after successful payment completion
 * Reads orderId from query params to show order details
 */

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const txnId = searchParams.get('txnId');
    const status = searchParams.get('status');
    const isPending = status === 'pending';

    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (!isPending) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isPending]);

    return (
        <div className="success-page">
            <style jsx>{`
                .success-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    position: relative;
                    overflow: hidden;
                }

                .confetti {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                }

                .confetti-piece {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: var(--color);
                    animation: confetti-fall 3s ease-out forwards;
                    opacity: 0;
                }

                @keyframes confetti-fall {
                    0% {
                        opacity: 1;
                        transform: translateY(-100px) rotate(0deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(100vh) rotate(720deg);
                    }
                }

                .success-card {
                    max-width: 500px;
                    width: 100%;
                    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                    border-radius: 24px;
                    padding: 48px 40px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    position: relative;
                    z-index: 10;
                }

                .success-icon {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                    animation: scale-in 0.5s ease-out;
                }

                .success-icon.pending {
                    background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
                }

                @keyframes scale-in {
                    0% {
                        transform: scale(0);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                .success-icon svg {
                    width: 50px;
                    height: 50px;
                    color: white;
                }

                .success-title {
                    font-size: 32px;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0 0 12px 0;
                }

                .success-subtitle {
                    font-size: 16px;
                    color: #a0aec0;
                    margin: 0 0 32px 0;
                    line-height: 1.6;
                }

                .order-details {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 32px;
                }

                .order-details.pending {
                    background: rgba(245, 158, 11, 0.1);
                    border-color: rgba(245, 158, 11, 0.2);
                }

                .order-detail {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                }

                .order-label {
                    color: #a0aec0;
                    font-size: 14px;
                }

                .order-value {
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 600;
                    font-family: monospace;
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

                .pending-note {
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.2);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 24px;
                }

                .pending-note p {
                    color: #FBBF24;
                    font-size: 14px;
                    margin: 0;
                    line-height: 1.6;
                }
            `}</style>

            {showConfetti && (
                <div className="confetti">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="confetti-piece"
                            style={{
                                '--color': ['#ff6b35', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'][i % 5],
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`,
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
            )}

            <div className="success-card">
                <div className={`success-icon ${isPending ? 'pending' : ''}`}>
                    {isPending ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    )}
                </div>

                <h1 className="success-title">
                    {isPending ? 'Payment Processing' : 'Payment Successful!'}
                </h1>
                <p className="success-subtitle">
                    {isPending
                        ? 'Your payment is being processed. You will receive a confirmation email shortly.'
                        : 'Thank you for your purchase! You can now access your course.'}
                </p>

                {isPending && (
                    <div className="pending-note">
                        <p>
                            ⏳ Your payment is awaiting verification. This usually takes a few minutes.
                            Please check your email for updates.
                        </p>
                    </div>
                )}

                {(orderId || txnId) && (
                    <div className={`order-details ${isPending ? 'pending' : ''}`}>
                        {orderId && (
                            <div className="order-detail">
                                <span className="order-label">Order ID</span>
                                <span className="order-value">#{orderId.slice(-8)}</span>
                            </div>
                        )}
                        {txnId && (
                            <div className="order-detail">
                                <span className="order-label">Transaction ID</span>
                                <span className="order-value">{txnId}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="action-buttons">
                    <Link href="/en/dashboard" className="primary-button">
                        {isPending ? 'Go to Dashboard' : 'Start Learning'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                    <Link href="/en" className="secondary-button">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
