# OrderFi Voice API - AI Food Ordering with Payments

## Overview

OrderFi Voice API is a voice-first AI food ordering system. Customers order food through natural conversation using Web Speech API, and pay via Stripe integration.

## User Preferences

- Communication style: Simple, everyday language
- Design: Voice-first, minimal UI, 3-color palette (Orange, White, Charcoal)

## Architecture

### Backend (Node.js/Express)
- **Entry**: `server/index.ts`
- **Voice API**: `server/voice-routes.ts` - GPT-4o powered ordering
- **Payments**: `server/payment-routes.ts` - Stripe integration
- **Storage**: `server/storage.ts` - In-memory storage

### Frontend (Web Voice Client)
- **Location**: `public/index.html`
- **Speech-to-Text**: Web Speech API (SpeechRecognition)
- **Text-to-Speech**: Web Speech API (speechSynthesis)
- **Payments**: Stripe Elements

## API Endpoints

### Voice
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/voice/process` | POST | Process voice transcript |
| `/api/voice/speak` | POST | Text-to-speech |
| `/api/voice/session/:id` | GET | Get session state |
| `/api/voice/complete/:id` | POST | Complete order |

### Payment
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payment/config` | GET | Get Stripe publishable key |
| `/api/payment/create-intent` | POST | Create payment intent (server-side amount) |
| `/api/payment/confirm` | POST | Confirm payment |

### Other
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/menu` | GET | Get menu items |
| `/api/orders` | POST | Create order |
| `/api/orders/:id` | GET | Get order |
| `/health` | GET | Health check |

## Required Secrets
- `OPENAI_API_KEY` - OpenAI API for chat and TTS
- Stripe (via Replit connector) - Payment processing

## Key Files
- `server/index.ts` - Express server
- `server/voice-routes.ts` - Voice ordering with GPT-4o
- `server/payment-routes.ts` - Stripe payments
- `server/stripeClient.ts` - Stripe client setup
- `server/storage.ts` - Data storage
- `public/index.html` - Landing page
- `public/order.html` - Voice ordering client
- `shared/schema.ts` - Data schemas

## Routes
- `/` - Landing page
- `/order` - Voice ordering interface

## Security
- Payment amounts calculated server-side from session data
- Stripe credentials fetched from Replit connector (never exposed)
- Session-based order tracking

## Recent Changes
- Added Stripe payment integration
- Built web voice client with Web Speech API
- Server-side payment amount validation (security fix)
