'use client';

import { useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Payment Checkout Page
 * 
 * Renders the Paymob payment iframe for secure credit card entry.
 */

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const iframeUrl = searchParams.get('iframeUrl') ? decodeURIComponent(searchParams.get('iframeUrl')!) : '';
  const orderId = searchParams.get('orderId') || '';

  const [isLoading, setIsLoading] = useState(true);

  // Translations
  const t = locale === 'ar' ? {
    title: 'إتمام الدفع',
    orderId: 'رقم الطلب',
    loading: 'جاري تحميل نموذج الدفع...',
    missingUrl: 'رابط الدفع مفقود',
    missingUrlDesc: 'يرجى فتح هذه الصفحة من صفحة الشراء.',
    invalidUrl: 'رابط غير صالح',
    invalidUrlDesc: 'فقط روابط Paymob مسموح بها.',
    backToHome: 'العودة للرئيسية',
    securePayment: 'دفع آمن بواسطة Paymob',
  } : {
    title: 'Complete Payment',
    orderId: 'Order ID',
    loading: 'Loading payment form...',
    missingUrl: 'Missing Payment URL',
    missingUrlDesc: 'Please access this page from the purchase flow.',
    invalidUrl: 'Invalid Payment URL',
    invalidUrlDesc: 'Only Paymob payment URLs are allowed.',
    backToHome: 'Back to Homepage',
    securePayment: 'Secure payment powered by Paymob',
  };

  if (!iframeUrl) {
    return (
      <div className="checkout-page">
        <style jsx>{styles}</style>
        <div className="error-card">
          <div className="error-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h2 className="error-title">{t.missingUrl}</h2>
          <p className="error-desc">{t.missingUrlDesc}</p>
          <Link href={`/${locale}`} className="back-button">
            {t.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  // Security check: Only allow Paymob iframe URLs
  const isPaymob = iframeUrl.startsWith('https://accept.paymob.com/');
  if (!isPaymob) {
    return (
      <div className="checkout-page">
        <style jsx>{styles}</style>
        <div className="error-card">
          <div className="error-icon warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
          </div>
          <h2 className="error-title">{t.invalidUrl}</h2>
          <p className="error-desc">{t.invalidUrlDesc}</p>
          <Link href={`/${locale}`} className="back-button">
            {t.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <style jsx>{styles}</style>

      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">{t.title}</h1>
          {orderId && (
            <p className="order-info">
              {t.orderId}: <span className="order-id">#{orderId.slice(-8)}</span>
            </p>
          )}
        </div>

        {/* Iframe Container */}
        <div className="iframe-container">
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
              <p className="loading-text">{t.loading}</p>
            </div>
          )}
          <iframe
            src={iframeUrl}
            width="100%"
            height="720"
            style={{ border: 0, borderRadius: 16, opacity: isLoading ? 0 : 1 }}
            allow="payment"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Footer */}
        <div className="checkout-footer">
          <div className="secure-badge">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            {t.securePayment}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = `
    .checkout-page {
        min-height: 100vh;
        background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
        padding: 24px 16px;
        display: flex;
        align-items: flex-start;
        justify-content: center;
    }

    .checkout-container {
        max-width: 640px;
        width: 100%;
        margin-top: 24px;
    }

    .checkout-header {
        text-align: center;
        margin-bottom: 24px;
    }

    .checkout-title {
        font-size: 28px;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 8px 0;
    }

    .order-info {
        font-size: 14px;
        color: #a0aec0;
        margin: 0;
    }

    .order-id {
        font-family: monospace;
        font-weight: 600;
        color: #ff6b35;
    }

    .iframe-container {
        position: relative;
        background: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        min-height: 720px;
    }

    .loading-overlay {
        position: absolute;
        inset: 0;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        z-index: 10;
    }

    .loading-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(46, 22, 95, 0.1);
        border-top-color: #2e165f;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .loading-text {
        font-size: 16px;
        color: #64748b;
        margin: 0;
    }

    .checkout-footer {
        text-align: center;
        margin-top: 20px;
    }

    .secure-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #a0aec0;
    }

    .secure-badge svg {
        color: #10B981;
    }

    /* Error styles */
    .error-card {
        max-width: 400px;
        width: 100%;
        background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 24px;
        padding: 48px 32px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        margin-top: 80px;
    }

    .error-icon {
        width: 80px;
        height: 80px;
        background: rgba(239, 68, 68, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
    }

    .error-icon.warning {
        background: rgba(245, 158, 11, 0.1);
    }

    .error-icon svg {
        width: 40px;
        height: 40px;
        color: #EF4444;
    }

    .error-icon.warning svg {
        color: #F59E0B;
    }

    .error-title {
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 12px 0;
    }

    .error-desc {
        font-size: 15px;
        color: #a0aec0;
        margin: 0 0 24px 0;
        line-height: 1.6;
    }

    .back-button {
        display: inline-block;
        padding: 14px 28px;
        font-size: 15px;
        font-weight: 600;
        color: #ffffff;
        background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
        border-radius: 12px;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .back-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
    }
`;
