'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';

/**
 * Payment Return Page
 * 
 * Handles the redirect from Paymob after payment completion.
 * Verifies the payment server-side and redirects to success/error page.
 */

interface VerificationResult {
  verified: boolean;
  success: boolean;
  pending?: boolean;
  orderId?: string;
  transactionId?: string;
  status?: string;
  redirectTo: 'success' | 'error';
  reason?: string;
  error?: string;
}

export default function PaymentReturnPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || 'en';

  const [status, setStatus] = useState<'verifying' | 'redirecting' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    async function verifyPayment() {
      try {
        // Pass all query params to the verification API
        const queryString = searchParams.toString();
        const response = await fetch(`/api/payment/verify?${queryString}`);
        const result: VerificationResult = await response.json();

        setStatus('redirecting');

        // Build redirect URL with relevant params
        const redirectParams = new URLSearchParams();
        if (result.orderId) redirectParams.set('orderId', result.orderId);
        if (result.transactionId) redirectParams.set('txnId', result.transactionId);
        if (result.pending) redirectParams.set('status', 'pending');
        if (result.reason) redirectParams.set('reason', result.reason);

        const queryStr = redirectParams.toString();
        const basePath = `/${locale}/payment/${result.redirectTo}`;
        const redirectUrl = queryStr ? `${basePath}?${queryStr}` : basePath;

        // Small delay for UX
        setTimeout(() => {
          router.replace(redirectUrl);
        }, 500);

      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Verification failed');

        // Redirect to error page after showing message
        setTimeout(() => {
          router.replace(`/${locale}/payment/error?reason=server_error`);
        }, 2000);
      }
    }

    verifyPayment();
  }, [searchParams, locale, router]);

  return (
    <div className="return-page">
      <style jsx>{`
                .return-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                }

                .return-card {
                    max-width: 400px;
                    width: 100%;
                    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
                    border-radius: 24px;
                    padding: 48px 40px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }

                .spinner-container {
                    margin-bottom: 24px;
                }

                .spinner {
                    width: 60px;
                    height: 60px;
                    border: 4px solid rgba(255, 107, 53, 0.2);
                    border-top-color: #ff6b35;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0 0 12px 0;
                }

                .subtitle {
                    font-size: 16px;
                    color: #a0aec0;
                    margin: 0;
                    line-height: 1.6;
                }

                .error-message {
                    margin-top: 16px;
                    padding: 12px;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 12px;
                    color: #ef4444;
                    font-size: 14px;
                }
            `}</style>

      <div className="return-card">
        {status === 'verifying' && (
          <>
            <div className="spinner-container">
              <div className="spinner" />
            </div>
            <h1 className="title">Verifying Payment</h1>
            <p className="subtitle">Please wait while we confirm your payment...</p>
          </>
        )}

        {status === 'redirecting' && (
          <>
            <div className="spinner-container">
              <div className="spinner" />
            </div>
            <h1 className="title">Payment Verified</h1>
            <p className="subtitle">Redirecting you to the result page...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="title">Verification Error</h1>
            <p className="subtitle">There was a problem verifying your payment.</p>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            <p className="subtitle" style={{ marginTop: 16 }}>
              Redirecting to error page...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
