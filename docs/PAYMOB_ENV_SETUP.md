# Paymob Payment Integration - Environment Variables
# Copy this file content to your .env.local and fill in your values

# =============================================================================
# PAYMOB CONFIGURATION
# =============================================================================
# Get these values from your Paymob Dashboard:
# https://accept.paymob.com/portal2

# API Key - Dashboard > Settings > Account Info
PAYMOB_API_KEY="__PAYMOB_API_KEY__"

# Integration IDs - Dashboard > Developers > Payment Integrations
# Card integration (Visa, Mastercard, etc.)
PAYMOB_INTEGRATION_ID_CARD="__PAYMOB_INTEGRATION_ID_CARD__"
# Mobile wallet integration (optional)
PAYMOB_INTEGRATION_ID_WALLET="__PAYMOB_INTEGRATION_ID_WALLET__"

# Iframe ID - Dashboard > Developers > iframes
PAYMOB_IFRAME_ID="__PAYMOB_IFRAME_ID__"

# HMAC Secret for webhook verification - Dashboard > Developers > HMAC Calculation
PAYMOB_HMAC_SECRET="__PAYMOB_HMAC_SECRET__"

# Paymob API Base URL (default for production)
PAYMOB_BASE_URL="https://accept.paymob.com/api"

# =============================================================================
# APPLICATION CONFIGURATION
# =============================================================================
# Your application's base URL (used for redirects)
APP_BASE_URL="http://localhost:3000"

# =============================================================================
# EMAIL CONFIGURATION (Resend)
# =============================================================================
# Resend API Key - https://resend.com/api-keys
RESEND_API_KEY="__RESEND_API_KEY__"

# Email addresses
MAIL_FROM="no-reply@yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"
