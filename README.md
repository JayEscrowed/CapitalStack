# CAPITALSTACK

Premium institutional real estate buyer database platform.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js (credentials + OAuth)
- **Payments**: Stripe (subscriptions)
- **Styling**: Tailwind CSS + Radix UI
- **Animations**: Framer Motion
- **Deployment**: Vercel / Docker

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account

### Local Development

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd capitalstack
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Set up database**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Start Stripe webhook listener** (in separate terminal)
   ```bash
   npm run stripe:listen
   ```

Visit [http://localhost:3000](http://localhost:3000)

### Using Docker

```bash
# Start PostgreSQL and Redis
docker-compose up -d db redis

# Run migrations and seed
npm run db:push
npm run db:seed

# Start development
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

### Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Auth encryption key |
| `NEXTAUTH_URL` | App URL (http://localhost:3000) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `STRIPE_PRICE_*` | Stripe price IDs for plans |

### Optional

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth |
| `GITHUB_CLIENT_ID/SECRET` | GitHub OAuth |
| `RESEND_API_KEY` | Email service |

## Database

### Schema Overview

- `User` - Account with subscription info
- `Buyer` - Institutional buyer profiles (325+)
- `Contact` - Decision makers (1,000+)
- `SavedBuyer/Contact` - User favorites
- `SearchHistory` - Search analytics
- `ExportHistory` - Export tracking

### Commands

```bash
npm run db:push      # Push schema changes
npm run db:migrate   # Create migration
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio
```

## Stripe Setup

### 1. Create Products in Stripe Dashboard

Create three subscription products:

- **Starter** - $97/month
- **Professional** - $297/month
- **Enterprise** - $997/month

### 2. Get Price IDs

Copy the price IDs from Stripe Dashboard to your `.env`:

```
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PROFESSIONAL=price_xxx
STRIPE_PRICE_ENTERPRISE=price_xxx
```

### 3. Configure Webhook

In Stripe Dashboard → Developers → Webhooks:

1. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
2. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

For local development:

```bash
npm run stripe:listen
# Copy the webhook secret to STRIPE_WEBHOOK_SECRET
```

## Project Structure

```
capitalstack/
├── app/
│   ├── (auth)/           # Login, register pages
│   ├── (dashboard)/      # Protected dashboard pages
│   ├── (marketing)/      # Public marketing pages
│   └── api/              # API routes
├── components/
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── ui/               # UI components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── stripe.ts         # Stripe configuration
│   └── utils.ts          # Utility functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── styles/
    └── globals.css       # Global styles
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
# Build production image
docker build -t capitalstack .

# Run with docker-compose
docker-compose up -d
```

### Manual

```bash
# Build
npm run build

# Start production server
npm start
```

## API Routes

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Buyers
- `GET /api/buyers` - List/search buyers
- `GET /api/buyers/export` - Export to CSV
- `POST /api/buyers/save` - Save/unsave buyer

### Contacts
- `GET /api/contacts` - List/search contacts
- `GET /api/contacts/export` - Export to CSV

### Stripe
- `POST /api/stripe/create-checkout` - Create checkout session
- `POST /api/stripe/portal` - Customer portal
- `POST /api/stripe/webhook` - Webhook handler

## Subscription Tiers

| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| Buyer Profiles | 10 | 100 | Unlimited | Unlimited |
| Contact Access | ❌ | 50 | Unlimited | Unlimited |
| CSV Export | ❌ | 10/mo | Unlimited | Unlimited |
| Search | 20/mo | 100/mo | Unlimited | Unlimited |
| API Access | ❌ | ❌ | ❌ | ✓ |
| Team Seats | 1 | 1 | 1 | 5 |

## Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit PR

## Support

- Email: support@capitalstack.io
- Docs: https://docs.capitalstack.io

## License

Proprietary - All rights reserved
# CapitalStack
