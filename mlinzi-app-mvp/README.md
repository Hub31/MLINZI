# Mlinzi App MVP v3.0

Post-quantum, tamper-proof child safety frontend for Kenya.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your n8n webhook URL

# 3. Run development server
npm run dev
# Open http://localhost:3000

# 4. Build for production
npm run build

# 5. Deploy to Vercel
npm run deploy
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `N8N_WEBHOOK_URL` | Yes | Your n8n instance webhook URL |
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | No | Public n8n URL (if different) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No | For offline maps |

## Architecture

- **Next.js 14** App Router
- **Tailwind CSS** for styling
- **TypeScript** throughout
- **API Routes** for n8n proxy (solves CORS)
- **React Hot Toast** for notifications

## Screens

1. **Dashboard** — Child status, SOS button, daily timeline
2. **Alerts** — Blockchain-verified alert history
3. **Map** — Privacy-preserving location view

## n8n Integration

The app communicates with your n8n backend via:
- `POST /api/n8n/webhook` → Proxies to your n8n instance
- This avoids CORS issues by routing through Next.js server

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Manual
```bash
npm run build
# Upload .next folder to your hosting provider
```
