# CreatorChat Hub - Production-Ready SaaS Platform

A modern, OnlyFans-style creator monetization platform built with Next.js, featuring AI-powered chat, blurred content unlocking, and a sophisticated referral system.

## 🚀 Features

### Core Platform
- **OnlyFans-style Creator Signup**: Multi-step wizard (Account → Profile → Stripe → Content → Launch)
- **Blurred Content System**: Per-post pricing with secure unlock mechanism
- **AI-Powered Chat**: Intelligent responses with cost guardrails
- **Referral Pyramid**: 3-level commission structure (L1: 5%, L2: 2%, L3: 1%)
- **Creator Dashboard**: Comprehensive analytics, content management, and earnings tracking

### Technical Excellence
- **Next.js 14**: App Router + Pages Router hybrid architecture
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS + shadcn/ui**: Modern, responsive design system
- **Prisma**: Type-safe database ORM with PostgreSQL
- **Stripe Connect**: Secure payment processing with automatic splits

### Security & Compliance
- **GDPR Compliance**: Cookie consent with granular preferences
- **Webhook Idempotency**: Prevents duplicate payment processing
- **Rate Limiting**: AI cost guardrails and usage monitoring
- **Security Headers**: Comprehensive protection against common attacks

### Performance & Monitoring
- **PostHog Analytics**: User behavior tracking and insights
- **Sentry Integration**: Error monitoring and reporting
- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Lighthouse >90**: Optimized for Core Web Vitals

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe Connect with automatic revenue splits
- **Analytics**: PostHog for user tracking
- **Monitoring**: Sentry for error tracking
- **File Uploads**: React Dropzone with blur processing
- **Forms**: React Hook Form with Zod validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lmars111/lmars111-creator-hub.git
   cd lmars111-creator-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Database setup**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/creator_hub"

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Error Tracking
SENTRY_DSN=your_sentry_dsn_here

# AI/OpenAI (Optional)
OPENAI_API_KEY=your_openai_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Configure environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   git push origin main
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 📱 Demo & Testing

- **Live Demo**: Visit the homepage and try the interactive demo sandbox
- **Creator Dashboard**: `/creator/dashboard` (demo account: Jess Williams)
- **Signup Wizard**: `/apply` - Complete creator onboarding flow
- **Test Creator**: `/c/jess` - Explore creator profile and chat

## 🏗️ Architecture

### Database Models
- **User**: Fan and creator accounts with referral tracking
- **Creator**: Enhanced creator profiles with Stripe integration
- **Post**: Blurred content with per-post pricing
- **Purchase**: Payment tracking with commission splits
- **ReferralCode**: Multi-level referral system
- **Commission**: Automated commission calculations

### API Routes
- `/api/posts/create` - Content creation with image processing
- `/api/posts/unlock` - Stripe checkout for content unlocking
- `/api/creators/onboard` - Stripe Connect account creation
- `/api/stripe/webhook` - Payment processing with idempotency

### Key Components
- **CreatorSignupWizard**: 5-step onboarding process
- **PostCard**: Blurred content with unlock functionality
- **CreatorDashboard**: Complete creator management interface
- **DemoSandbox**: Interactive platform demonstration
- **CookieConsent**: GDPR-compliant privacy controls

## 💰 Revenue Model

### Platform Economics
- **Platform Fee**: 20% of all transactions
- **Referral Commissions**: Up to 8% distributed across 3 levels
- **Creator Earnings**: 80% base rate (minus referral commissions)

### Referral Structure
- **Level 1**: 5% of platform fee for direct referrals
- **Level 2**: 2% of platform fee for sub-referrals
- **Level 3**: 1% of platform fee for third-level referrals

## 🔒 Security Features

- **Stripe Security**: PCI DSS compliant payment processing
- **Webhook Protection**: Signature verification and idempotency
- **CSRF Protection**: Built-in Next.js security
- **Rate Limiting**: AI cost guardrails and request limiting
- **Data Privacy**: GDPR compliant with cookie preferences

## 📊 Performance Metrics

- **Lighthouse Score**: >90 across all metrics
- **Core Web Vitals**: Optimized LCP, FID, and CLS
- **Bundle Size**: Optimized with code splitting
- **Image Performance**: Next.js Image with modern formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discord**: Join our community for real-time support

---

**Built with ❤️ by the CreatorChat Hub team**