# OrderFi Voice API - AI Food Ordering with Payments

## Overview

OrderFi Voice API is a voice-first AI food ordering system. Customers order food through natural conversation using Web Speech API, and pay via Stripe integration. Includes a staff admin dashboard for menu management with smart AI-powered keyword matching.

## User Preferences

- Communication style: Simple, everyday language
- Design: Voice-first, minimal UI, 3-color palette (Orange, White, Charcoal)

## Architecture

### Backend (Node.js/Express)
- **Entry**: `server/index.ts`
- **Voice API**: `server/voice-routes.ts` - GPT-4o powered ordering with weighted keyword matching
- **Admin API**: `server/admin-routes.ts` - Protected menu CRUD with Zod validation
- **Payments**: `server/payment-routes.ts` - Stripe integration
- **Auth**: `server/replit_integrations/auth/` - Replit Auth (OIDC)
- **Storage**: `server/storage.ts` - Database storage with Drizzle ORM

### Frontend (Web Voice Client)
- **Location**: `public/index.html` - Landing page
- **Voice Ordering**: `public/order.html`
- **Admin Dashboard**: `public/admin.html` - Staff menu management
- **Speech-to-Text**: Web Speech API (SpeechRecognition)
- **Text-to-Speech**: Web Speech API (speechSynthesis)
- **Payments**: Stripe Elements

### Database (PostgreSQL/Neon)
- **Schema**: `shared/schema.ts`
- **Auth Models**: `shared/models/auth.ts` - Users and sessions tables
- **ORM**: Drizzle ORM

## API Endpoints

### Voice
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/voice/process` | POST | Process voice transcript with smart matching |
| `/api/voice/speak` | POST | Text-to-speech |
| `/api/voice/session/:id` | GET | Get session state |
| `/api/voice/complete/:id` | POST | Complete order |

### Admin (Protected - Requires Auth)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/menu` | GET | List all menu items |
| `/api/admin/menu` | POST | Create menu item |
| `/api/admin/menu/:id` | PUT | Update menu item |
| `/api/admin/menu/:id` | DELETE | Delete menu item |
| `/api/admin/orders` | GET | List recent orders |
| `/api/admin/upload-url` | POST | Get presigned URL for photo uploads |

### Auth
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | GET | Initiate Replit OAuth login |
| `/api/auth/logout` | GET | Logout and clear session |
| `/api/auth/user` | GET | Get current user info |

### Payment
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payment/config` | GET | Get Stripe publishable key |
| `/api/payment/create-intent` | POST | Create payment intent (server-side amount) |
| `/api/payment/confirm` | POST | Confirm payment |

### Other
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/menu` | GET | Get menu items (public) |
| `/api/orders` | POST | Create order |
| `/api/orders/:id` | GET | Get order |
| `/health` | GET | Health check |

## Smart AI Matching

The voice ordering system uses weighted keyword matching to improve AI understanding:

- **Weighted Keywords**: Each menu item can have keywords with weights (0.0-1.0)
  - Example: `{"spicy": 0.9, "hot": 0.8, "mild": 0.2}`
- **Aliases**: Alternative names for items
- **Dietary Tags**: vegetarian, gluten-free, etc.
- **Scoring Algorithm**: Combines name matching, alias matching, keyword weights, and dietary tags

## Required Secrets
- `OPENAI_API_KEY` - OpenAI API for chat and TTS
- Stripe (via Replit connector) - Payment processing
- Object Storage (via Replit) - Photo uploads

## Key Files
- `server/index.ts` - Express server with async initialization
- `server/voice-routes.ts` - Voice ordering with GPT-4o and weighted matching
- `server/admin-routes.ts` - Admin CRUD with Zod validation
- `server/payment-routes.ts` - Stripe payments
- `server/db.ts` - Drizzle database connection
- `server/storage.ts` - Data storage interface
- `server/replit_integrations/auth/` - Replit Auth integration
- `server/replit_integrations/object_storage/` - Object storage integration
- `public/index.html` - Landing page
- `public/order.html` - Voice ordering client
- `public/admin.html` - Staff admin dashboard
- `shared/schema.ts` - Database schemas (menu_items, orders, restaurants, etc.)
- `shared/models/auth.ts` - Auth tables (users, sessions)

## Routes
- `/` - Landing page (with Staff Login link in footer)
- `/order` - Voice ordering interface
- `/admin` - Staff dashboard (requires Replit Auth)

## Security
- Payment amounts calculated server-side from session data
- Stripe credentials fetched from Replit connector (never exposed)
- Admin routes protected with `isAuthenticated` middleware
- Request body validation with Zod schemas
- Session-based order tracking

## Recent Changes (February 2026)
- Added AI Copilot chat widget on staff dashboard (floating button, slide-out panel, xAI Grok-powered)
- Copilot auto-detects feedback type (bug, confusion, feature request, praise) and stores in copilot_feedback table
- Copilot has full platform knowledge and context-aware responses based on active tab
- Added Ghost Guide: step-by-step walkthrough overlay that highlights dashboard buttons with spotlight, tooltips, and progress dots
- Ghost Guide accessible via "Take a Tour" button on dashboard header and copilot quick action
- Added AI Menu Scanner: upload a menu photo and Grok Vision extracts all items automatically
- Added interactive menu browsing mode on /order page with voice/browse toggle
- Receipt edit panel now properly positioned to right of receipt preview

## Previous Changes (January 2026)
- Added staff admin dashboard with menu management
- Integrated Replit Auth for staff login
- Added object storage for menu item photos
- Implemented weighted keyword matching for smart AI menu matching
- Added Zod validation on admin CRUD endpoints
- Database schema enhanced with photo_url, reviews_url, weighted_keywords fields
- Added Staff Login link to landing page footer
