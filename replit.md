# OrderFi Voice API - AI Food Ordering with Payments

## Overview

OrderFi Voice API is a voice-first AI food ordering system. Customers order food through natural conversation using Web Speech API, and pay via Stripe integration. Includes a staff admin dashboard for menu management with smart AI-powered keyword matching.

## User Preferences

- Communication style: Simple, everyday language
- Design: Voice-first, minimal UI, 3-color palette (Orange, White, Charcoal)
- Development approach: Keep code portable - no Replit-exclusive dependencies. All Replit integrations have standard env var fallbacks.
- AI: Uses Claude (Anthropic) for voice ordering, xAI Grok for admin copilot/menu scanner

## Architecture

### Backend (Node.js/Express)
- **Entry**: `server/index.ts` - Auto-detects Replit vs standalone environment
- **Voice API**: `server/voice-routes.ts` - Claude-powered ordering with weighted keyword matching
- **Admin API**: `server/admin-routes.ts` - Protected menu CRUD with Zod validation
- **Payments**: `server/payment-routes.ts` - Stripe integration
- **Stripe Client**: `server/stripeClient.ts` - Supports both Replit connector and standard env vars
- **Auth**: `server/replit_integrations/auth/` - Replit Auth (lazy-loaded, falls back to express-session)
- **Storage**: `server/storage.ts` - DatabaseStorage (PostgreSQL via Drizzle) with MemStorage fallback
- **Object Storage**: `server/replit_integrations/object_storage/` - Lazy-loaded, only on Replit

### Frontend (Static HTML - No Build Step)
- **Location**: `public/index.html` - Landing page
- **Voice Ordering**: `public/order.html`
- **Admin Dashboard**: `public/admin.html` - Staff menu management
- **Menu Browser**: `public/menu.html` - Customer-facing menu with QR code entry
- **Kitchen Display**: `public/kitchen.html` - Kitchen order management
- **Order Tracking**: `public/track.html` - Customer order tracking
- **Speech-to-Text**: Web Speech API (SpeechRecognition)
- **Text-to-Speech**: Web Speech API (speechSynthesis)
- **Payments**: Stripe Elements

### Database (PostgreSQL)
- **Schema**: `shared/schema.ts`
- **Auth Models**: `shared/models/auth.ts` - Users and sessions tables
- **ORM**: Drizzle ORM with `drizzle-orm/node-postgres`
- **Connection**: `server/db.ts` - Returns null if DATABASE_URL not set

## Portability & Environment Detection

The app auto-detects its environment and gracefully degrades:

| Feature | On Replit | Standalone |
|---------|-----------|------------|
| Auth | Replit Auth (OIDC) | express-session (set SESSION_SECRET) |
| Database | PostgreSQL via DATABASE_URL | In-memory storage (MemStorage) |
| Stripe | Replit connector auto-fetches keys | Set STRIPE_SECRET_KEY + STRIPE_PUBLISHABLE_KEY |
| Object Storage | Replit Object Storage | Not available (photo uploads disabled) |
| Detection | `process.env.REPL_ID` present | `REPL_ID` absent |

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Recommended | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Yes | Claude API key for voice ordering |
| `XAI_API_KEY` | For admin AI | xAI Grok key for copilot & menu scanner |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key (not needed if using Replit connector) |
| `STRIPE_PUBLISHABLE_KEY` | For payments | Stripe publishable key (not needed if using Replit connector) |
| `SESSION_SECRET` | Standalone only | Session encryption key (auto-generated if missing) |
| `PORT` | No | Server port (defaults to 5000) |

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

## Key Files
- `server/index.ts` - Express server with async initialization and environment detection
- `server/voice-routes.ts` - Voice ordering with Claude and weighted matching
- `server/admin-routes.ts` - Admin CRUD with Zod validation
- `server/payment-routes.ts` - Stripe payments
- `server/stripeClient.ts` - Stripe client (supports env vars and Replit connector)
- `server/db.ts` - Drizzle database connection (nullable)
- `server/storage.ts` - IStorage interface, DatabaseStorage, and MemStorage fallback
- `server/replit_integrations/auth/` - Replit Auth integration (lazy-loaded)
- `server/replit_integrations/object_storage/` - Object storage integration (lazy-loaded)
- `public/index.html` - Landing page
- `public/order.html` - Voice ordering client
- `public/admin.html` - Staff admin dashboard
- `public/menu.html` - Customer menu browsing (QR code entry)
- `public/kitchen.html` - Kitchen display system
- `public/track.html` - Order tracking
- `shared/schema.ts` - Database schemas (menu_items, orders, restaurants, tables, etc.)
- `shared/models/auth.ts` - Auth tables (users, sessions)

## Routes
- `/` - Landing page (with Staff Login link in footer)
- `/order` - Voice ordering interface
- `/admin` - Staff dashboard (requires auth)
- `/menu/:slug` - Customer menu for a restaurant
- `/kitchen` - Kitchen display system
- `/track/:orderId` - Order tracking page
- `/setup` - Restaurant setup wizard

## Security
- Payment amounts calculated server-side from session data
- Stripe credentials via Replit connector or environment variables (never exposed to client)
- Admin routes protected with `isAuthenticated` middleware
- Request body validation with Zod schemas
- Session-based order tracking

## Recent Changes (February 2026)
- Made Stripe client portable (supports standard env vars as fallback to Replit connector)
- Added DatabaseStorage class for PostgreSQL persistence (replaces in-memory-only storage)
- Fixed admin.html duplicate init() function conflict
- Fixed admin.html receipt preview null reference errors
- Migrated voice ordering from OpenAI GPT-4o to Claude (Anthropic SDK)
- Added AI Copilot chat widget on staff dashboard (xAI Grok-powered)
- Added Ghost Guide walkthrough overlay for dashboard
- Added AI Menu Scanner (Grok Vision extracts items from photos)
- Added interactive menu browsing mode on /order page

## Previous Changes (January 2026)
- Added staff admin dashboard with menu management
- Integrated Replit Auth for staff login
- Added object storage for menu item photos
- Implemented weighted keyword matching for smart AI menu matching
- Added Zod validation on admin CRUD endpoints
- Database schema enhanced with photo_url, reviews_url, weighted_keywords fields
