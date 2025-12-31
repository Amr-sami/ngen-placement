'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

interface TrackPurchaseFormProps {
    beltId: string;
    beltName: string;
    amount: number;
    currency: string;
    /** If user is logged in, pre-fill their data */
    defaultValues?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    /** Callback when purchase is initiated */
    onPurchaseStart?: () => void;
    /** Callback when purchase fails */
    onPurchaseError?: (error: string) => void;
}

interface FormData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod: 'card' | 'wallet';
}

interface FormErrors {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    general?: string;
}

/**
 * Track Purchase Form Component
 * 
 * Collects customer information and initiates Paymob payment flow
 */
export default function TrackPurchaseForm({
    beltId,
    beltName,
    amount,
    currency,
    defaultValues,
    onPurchaseStart,
    onPurchaseError,
}: TrackPurchaseFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        customerName: defaultValues?.name || '',
        customerEmail: defaultValues?.email || '',
        customerPhone: defaultValues?.phone || '',
        paymentMethod: 'card',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // Format currency display
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Name is required';
        } else if (formData.customerName.trim().length < 2) {
            newErrors.customerName = 'Name must be at least 2 characters';
        }

        if (!formData.customerEmail.trim()) {
            newErrors.customerEmail = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
            newErrors.customerEmail = 'Please enter a valid email';
        }

        if (!formData.customerPhone.trim()) {
            newErrors.customerPhone = 'Phone number is required';
        } else if (formData.customerPhone.replace(/\D/g, '').length < 10) {
            newErrors.customerPhone = 'Phone must be at least 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});
        onPurchaseStart?.();

        try {
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    beltId,
                    customerName: formData.customerName.trim(),
                    customerEmail: formData.customerEmail.trim().toLowerCase(),
                    customerPhone: formData.customerPhone.trim(),
                    paymentMethod: formData.paymentMethod,
                    currency,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || data.error || 'Failed to create order';
                setErrors({ general: errorMessage });
                onPurchaseError?.(errorMessage);
                return;
            }

            // Redirect to Paymob iframe
            if (data.iframeUrl) {
                window.location.href = data.iframeUrl;
            } else {
                throw new Error('No payment URL received');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setErrors({ general: errorMessage });
            onPurchaseError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="track-purchase-form">
            <style jsx>{`
                .track-purchase-form {
                    max-width: 480px;
                    margin: 0 auto;
                    padding: 32px;
                    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                    border-radius: 24px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }

                .form-header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .form-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0 0 8px 0;
                }

                .form-subtitle {
                    font-size: 14px;
                    color: #a0aec0;
                }

                .product-card {
                    background: rgba(255, 107, 53, 0.1);
                    border: 1px solid rgba(255, 107, 53, 0.2);
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .product-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #ffffff;
                }

                .product-price {
                    font-size: 24px;
                    font-weight: 700;
                    color: #ff6b35;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 500;
                    color: #e2e8f0;
                    margin-bottom: 8px;
                }

                .form-input {
                    width: 100%;
                    padding: 14px 16px;
                    font-size: 16px;
                    color: #ffffff;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    outline: none;
                    transition: all 0.2s ease;
                }

                .form-input:focus {
                    border-color: #ff6b35;
                    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
                }

                .form-input::placeholder {
                    color: #718096;
                }

                .form-input.error {
                    border-color: #ef4444;
                }

                .form-error {
                    font-size: 13px;
                    color: #ef4444;
                    margin-top: 6px;
                }

                .payment-methods {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .payment-method {
                    flex: 1;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                }

                .payment-method:hover {
                    background: rgba(255, 255, 255, 0.08);
                }

                .payment-method.selected {
                    border-color: #ff6b35;
                    background: rgba(255, 107, 53, 0.1);
                }

                .payment-method-icon {
                    font-size: 24px;
                    margin-bottom: 8px;
                }

                .payment-method-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #ffffff;
                }

                .general-error {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 12px;
                    padding: 12px 16px;
                    margin-bottom: 20px;
                    color: #ef4444;
                    font-size: 14px;
                    text-align: center;
                }

                .submit-button {
                    width: 100%;
                    padding: 16px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #ffffff;
                    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .submit-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
                }

                .submit-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: #ffffff;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .secure-badge {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 16px;
                    font-size: 12px;
                    color: #718096;
                }

                .secure-badge svg {
                    width: 16px;
                    height: 16px;
                }
            `}</style>

            <div className="form-header">
                <h2 className="form-title">Complete Your Purchase</h2>
                <p className="form-subtitle">Enter your details to proceed with payment</p>
            </div>

            <div className="product-card">
                <span className="product-name">{beltName}</span>
                <span className="product-price">{formattedAmount}</span>
            </div>

            <form onSubmit={handleSubmit}>
                {errors.general && (
                    <div className="general-error">{errors.general}</div>
                )}

                <div className="form-group">
                    <label className="form-label" htmlFor="customerName">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        className={`form-input ${errors.customerName ? 'error' : ''}`}
                        placeholder="Enter your full name"
                        value={formData.customerName}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    {errors.customerName && (
                        <div className="form-error">{errors.customerName}</div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="customerEmail">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="customerEmail"
                        name="customerEmail"
                        className={`form-input ${errors.customerEmail ? 'error' : ''}`}
                        placeholder="Enter your email"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    {errors.customerEmail && (
                        <div className="form-error">{errors.customerEmail}</div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="customerPhone">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="customerPhone"
                        name="customerPhone"
                        className={`form-input ${errors.customerPhone ? 'error' : ''}`}
                        placeholder="e.g., +20 123 456 7890"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    {errors.customerPhone && (
                        <div className="form-error">{errors.customerPhone}</div>
                    )}
                </div>

                <label className="form-label">Payment Method</label>
                <div className="payment-methods">
                    <div
                        className={`payment-method ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
                        onClick={() => !isLoading && setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                    >
                        <div className="payment-method-icon">💳</div>
                        <div className="payment-method-label">Credit/Debit Card</div>
                    </div>
                    <div
                        className={`payment-method ${formData.paymentMethod === 'wallet' ? 'selected' : ''}`}
                        onClick={() => !isLoading && setFormData(prev => ({ ...prev, paymentMethod: 'wallet' }))}
                    >
                        <div className="payment-method-icon">📱</div>
                        <div className="payment-method-label">Mobile Wallet</div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Pay {formattedAmount}
                        </>
                    )}
                </button>

                <div className="secure-badge">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                    </svg>
                    Secured by Paymob
                </div>
            </form>
        </div>
    );
}
