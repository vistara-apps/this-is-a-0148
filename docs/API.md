# LogoSpark API Documentation

This document outlines the API integrations and backend services used in LogoSpark.

## 🔌 API Integrations

### OpenAI DALL-E 3 API

**Purpose**: AI-powered logo generation
**Documentation**: https://platform.openai.com/docs/api-reference/images/create

#### Configuration
```typescript
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1", // Alternative endpoint
  dangerouslyAllowBrowser: true,
});
```

#### Logo Generation
```typescript
interface LogoGenerationParams {
  brandName: string;
  industry: string;
  keywords: string[];
  style: 'modern' | 'classic' | 'playful' | 'elegant';
}

async function generateLogoConcepts(params: LogoGenerationParams): Promise<string[]>
```

**Request Example**:
```typescript
const logos = await generateLogoConcepts({
  brandName: "TechStart",
  industry: "Technology",
  keywords: ["innovation", "digital", "growth"],
  style: "modern"
});
```

**Response**: Array of image URLs

#### Rate Limits
- DALL-E 3: 50 requests per minute
- Fallback to demo mode if API key is invalid

---

### Supabase API

**Purpose**: User authentication, data persistence, file storage
**Documentation**: https://supabase.com/docs

#### Configuration
```typescript
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

#### Database Schema

##### Users Table
```sql
CREATE TABLE users (
  userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  paymentStatus TEXT DEFAULT 'pending',
  logoPreference TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

##### Logo Requests Table
```sql
CREATE TABLE logo_requests (
  requestId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(userId),
  promptKeywords TEXT[],
  selectedConcept TEXT,
  customizations JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

##### Generated Logos Table
```sql
CREATE TABLE generated_logos (
  logoId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requestId UUID REFERENCES logo_requests(requestId),
  conceptDetails JSONB,
  imageUrl TEXT,
  fileFormats TEXT[],
  colorVariations TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Authentication Functions

```typescript
// Sign up new user
async function signUpUser(email: string, password: string)

// Sign in existing user
async function signInUser(email: string, password: string)

// Sign out current user
async function signOutUser()

// Get current authenticated user
async function getCurrentUser()
```

#### Data Management Functions

```typescript
// Create logo request
async function createLogoRequest(logoRequest: Omit<LogoRequest, 'requestId'>)

// Update logo request
async function updateLogoRequest(requestId: string, updates: Partial<LogoRequest>)

// Get user's logo requests
async function getLogoRequestsByUser(userId: string)

// Save generated logos
async function saveGeneratedLogos(logos: GeneratedLogo[])
```

---

### Stripe API

**Purpose**: Payment processing
**Documentation**: https://stripe.com/docs/api

#### Configuration
```typescript
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

#### Payment Processing

```typescript
interface PaymentIntentData {
  amount: number;
  currency: string;
  metadata: {
    tierId: string;
    logoId: string;
    userId: string;
  };
}

// Process payment (demo mode)
async function processPayment(
  tierId: string,
  logoId: string,
  userId: string,
  tier: PricingTier
)

// Redirect to Stripe Checkout
async function redirectToCheckout(
  tierId: string,
  logoId: string,
  userId: string,
  tier: PricingTier
)
```

#### Pricing Tiers
```typescript
const pricingTiers = [
  {
    id: 'basic',
    name: 'Basic Logo',
    price: 25, // USD
    features: [...]
  },
  {
    id: 'brand-kit',
    name: 'Logo + Brand Kit',
    price: 45, // USD
    popular: true,
    features: [...]
  },
  {
    id: 'premium',
    name: 'Premium Package',
    price: 75, // USD
    features: [...]
  }
];
```

---

## 🔧 Backend API Endpoints (Required for Production)

### Payment Intent Creation
```
POST /api/create-payment-intent
Content-Type: application/json

{
  "amount": 4500,
  "currency": "usd",
  "metadata": {
    "tierId": "brand-kit",
    "logoId": "logo-123",
    "userId": "user-456"
  }
}
```

### Checkout Session Creation
```
POST /api/create-checkout-session
Content-Type: application/json

{
  "tierId": "brand-kit",
  "logoId": "logo-123",
  "userId": "user-456",
  "priceId": "price_1234567890",
  "successUrl": "https://logospark.com/success?session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://logospark.com/pricing"
}
```

### Payment Verification
```
GET /api/verify-payment/{sessionId}
```

---

## 🎨 Brand Kit Generation API

### Generate Brand Kit
```typescript
interface BrandKitFile {
  name: string;
  url: string;
  type: 'png' | 'jpg' | 'svg' | 'ico' | 'pdf';
  size?: string;
  description: string;
}

interface BrandKit {
  logoFiles: BrandKitFile[];
  colorPalette: string[];
  fonts: string[];
  guidelines?: string;
}

async function generateBrandKit(
  logo: GeneratedLogo,
  customizations: LogoCustomization,
  tier: PricingTier
): Promise<BrandKit>
```

### File Generation Functions
```typescript
// Generate SVG version
function generateSVGLogo(logo: GeneratedLogo, customizations: LogoCustomization): string

// Generate color variations
function generateColorVariation(originalUrl: string, color: string): string

// Generate favicon
function generateFavicon(logoUrl: string): string

// Generate brand guidelines PDF
async function generateBrandGuidelines(
  logo: GeneratedLogo,
  customizations: LogoCustomization
): Promise<string>
```

---

## 🔒 Security Considerations

### Environment Variables
```env
# Never commit these to version control
VITE_OPENAI_API_KEY=sk-...
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### API Key Management
- Store sensitive keys in environment variables
- Use different keys for development/production
- Implement rate limiting for API calls
- Monitor API usage and costs

### Data Security
- Implement Supabase Row Level Security (RLS)
- Validate all user inputs
- Sanitize file uploads
- Use HTTPS for all API communications

---

## 📊 Error Handling

### OpenAI API Errors
```typescript
try {
  const logos = await generateLogoConcepts(params);
} catch (error) {
  if (error.code === 'rate_limit_exceeded') {
    // Handle rate limiting
  } else if (error.code === 'invalid_api_key') {
    // Fall back to demo mode
  }
}
```

### Supabase Errors
```typescript
const { data, error } = await supabase
  .from('users')
  .insert([user]);

if (error) {
  console.error('Database error:', error.message);
  throw new Error('Failed to create user');
}
```

### Stripe Errors
```typescript
try {
  const paymentIntent = await stripe.paymentIntents.create({...});
} catch (error) {
  if (error.type === 'card_error') {
    // Handle card errors
  } else if (error.type === 'rate_limit_error') {
    // Handle rate limiting
  }
}
```

---

## 🚀 Production Deployment

### Required Backend Services
1. **Payment Processing Server**: Handle Stripe webhooks and payment intents
2. **File Storage**: Store generated logos and brand assets
3. **Email Service**: Send download links and receipts
4. **Analytics**: Track usage and conversion metrics

### Recommended Architecture
```
Frontend (Vercel/Netlify)
    ↓
API Gateway (Vercel Functions/Netlify Functions)
    ↓
Supabase (Database + Auth + Storage)
    ↓
External APIs (OpenAI, Stripe)
```

### Monitoring
- Set up error tracking (Sentry)
- Monitor API usage and costs
- Track user conversion funnel
- Set up uptime monitoring

---

## 📈 Rate Limits & Quotas

### OpenAI DALL-E 3
- **Rate Limit**: 50 requests/minute
- **Cost**: ~$0.04 per image (1024x1024)
- **Recommendation**: Implement caching and user limits

### Supabase
- **Free Tier**: 50,000 monthly active users
- **Database**: 500MB storage
- **Bandwidth**: 5GB/month

### Stripe
- **Transaction Fee**: 2.9% + 30¢ per successful charge
- **No monthly fees** for standard processing

---

This API documentation provides the foundation for implementing and maintaining the LogoSpark application's backend integrations.
