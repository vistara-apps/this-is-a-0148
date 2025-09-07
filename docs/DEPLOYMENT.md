# LogoSpark Deployment Guide

This guide covers deploying LogoSpark to production environments.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   ```env
   VITE_OPENAI_API_KEY=sk-your_openai_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
   VITE_APP_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Custom domain can be configured in project settings

### Option 2: Netlify

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Add the same environment variables as above in Site Settings

### Option 3: Docker

1. **Build Image**
   ```bash
   docker build -t logospark .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e VITE_OPENAI_API_KEY=your_key \
     -e VITE_SUPABASE_URL=your_url \
     -e VITE_SUPABASE_ANON_KEY=your_key \
     -e VITE_STRIPE_PUBLISHABLE_KEY=your_key \
     logospark
   ```

## 🔧 Production Setup

### 1. Supabase Configuration

1. **Create Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project

2. **Set up Database Tables**
   ```sql
   -- Run in Supabase SQL Editor
   
   -- Users table
   CREATE TABLE users (
     userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     paymentStatus TEXT DEFAULT 'pending',
     logoPreference TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Logo requests table
   CREATE TABLE logo_requests (
     requestId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     userId UUID REFERENCES users(userId),
     promptKeywords TEXT[],
     selectedConcept TEXT,
     customizations JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Generated logos table
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

3. **Configure Row Level Security (RLS)**
   ```sql
   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE logo_requests ENABLE ROW LEVEL SECURITY;
   ALTER TABLE generated_logos ENABLE ROW LEVEL SECURITY;
   
   -- Users can only see their own data
   CREATE POLICY "Users can view own profile" ON users
     FOR SELECT USING (auth.uid() = userId::uuid);
   
   CREATE POLICY "Users can update own profile" ON users
     FOR UPDATE USING (auth.uid() = userId::uuid);
   
   -- Logo requests policies
   CREATE POLICY "Users can view own requests" ON logo_requests
     FOR SELECT USING (auth.uid() = userId::uuid);
   
   CREATE POLICY "Users can create requests" ON logo_requests
     FOR INSERT WITH CHECK (auth.uid() = userId::uuid);
   ```

4. **Configure Authentication**
   - Enable email authentication in Supabase Auth settings
   - Configure email templates
   - Set up custom SMTP (optional)

### 2. Stripe Configuration

1. **Create Stripe Account**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Complete account setup

2. **Create Products and Prices**
   ```bash
   # Using Stripe CLI
   stripe products create --name "Basic Logo" --description "High-resolution PNG with basic customization"
   stripe prices create --product prod_xxx --unit-amount 2500 --currency usd
   
   stripe products create --name "Logo + Brand Kit" --description "Complete brand kit with multiple formats"
   stripe prices create --product prod_xxx --unit-amount 4500 --currency usd
   
   stripe products create --name "Premium Package" --description "Everything plus usage guidelines and templates"
   stripe prices create --product prod_xxx --unit-amount 7500 --currency usd
   ```

3. **Set up Webhooks**
   - Create webhook endpoint: `https://your-domain.com/api/stripe-webhook`
   - Listen for: `checkout.session.completed`, `payment_intent.succeeded`

### 3. OpenAI Configuration

1. **Get API Key**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Create API key with DALL-E access

2. **Set Usage Limits**
   - Configure monthly spending limits
   - Set up usage alerts

## 🔐 Security Checklist

### Environment Variables
- [ ] All API keys stored as environment variables
- [ ] No sensitive data in client-side code
- [ ] Different keys for development/production
- [ ] Regular key rotation schedule

### Database Security
- [ ] Row Level Security (RLS) enabled
- [ ] Proper authentication policies
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention

### API Security
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] API key validation

### Payment Security
- [ ] Stripe webhook signature verification
- [ ] PCI compliance maintained
- [ ] Payment data never stored locally
- [ ] Secure payment flow testing

## 📊 Monitoring & Analytics

### Error Tracking
```bash
# Install Sentry
npm install @sentry/react @sentry/tracing
```

```typescript
// Configure Sentry
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring
- Set up Vercel Analytics
- Monitor Core Web Vitals
- Track API response times
- Monitor error rates

### Business Metrics
- Track conversion funnel
- Monitor payment success rates
- Analyze user behavior
- A/B test pricing strategies

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.STRIPE_PUBLISHABLE_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set
   - Verify Node.js version compatibility
   - Clear node_modules and reinstall

2. **API Errors**
   - Verify API keys are correct
   - Check rate limits
   - Monitor API status pages

3. **Payment Issues**
   - Test with Stripe test cards
   - Verify webhook endpoints
   - Check Stripe dashboard for errors

4. **Database Connection**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Monitor connection limits

### Health Checks
```typescript
// Add health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      openai: 'available',
      stripe: 'configured'
    }
  });
});
```

## 📈 Scaling Considerations

### Performance Optimization
- Implement image caching
- Use CDN for static assets
- Optimize bundle size
- Lazy load components

### Database Scaling
- Monitor connection usage
- Implement connection pooling
- Consider read replicas
- Plan for data archiving

### Cost Management
- Monitor API usage costs
- Implement user limits
- Cache expensive operations
- Optimize image generation

---

This deployment guide ensures a secure, scalable production deployment of LogoSpark.
