# OrderFi - AI-Powered Restaurant Ordering Platform

## Overview

OrderFi is a comprehensive restaurant management platform featuring an AI-powered ordering assistant named "Mimi". The system enables restaurants to manage menus, process orders, handle payments (including cryptocurrency), and engage customers through conversational AI. The platform includes a Kitchen Display System (KDS), loyalty rewards program, and supports decentralized infrastructure options.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with custom design tokens and HSL color variables
- **Component Library**: Custom components with shadcn/ui patterns
- **Path Aliases**: `@/` for client source, `@shared/` for shared code, `@assets/` for static assets

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints with WebSocket support for real-time features
- **Entry Point**: `server/index.ts` handles Express setup and route registration

### Data Storage
- **Primary Database**: PostgreSQL via Drizzle ORM with Neon serverless driver
- **Schema Location**: `shared/schema.ts` defines all database tables
- **Migrations**: Generated to `./migrations` directory via drizzle-kit
- **Storage Pattern**: Interface-based storage abstraction (`IStorage`) in `server/storage.ts` with database implementation in `server/db-storage.ts`

### AI Integration
- **Primary AI**: OpenAI GPT-4o for conversational ordering and menu parsing
- **Secondary AI**: xAI Grok (via `api.x.ai`) for text animations and KDS analysis
- **Voice**: OpenAI TTS with Nova voice for audio responses
- **Chat Service**: `server/services/akash-chat.ts` handles customer conversations
- **Menu Parsing**: Vision API for image-based menu extraction

### Real-time Features
- **WebSocket Server**: Custom implementation in `server/websocket.ts` for KDS updates
- **Client Path**: `/ws` endpoint for WebSocket connections
- **Use Cases**: Kitchen display system, order status updates, live notifications

### Payment Processing
- **Traditional**: Stripe integration (configured, implementation pending)
- **Cryptocurrency**: USDC payments on Base and Polygon networks
- **Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, Phantom
- **Payment Engine**: `server/services/payment-engine.ts` orchestrates all payment methods

### Rewards System
- **Loyalty Tiers**: Bronze, Silver, Gold, Platinum with multipliers
- **Token Rewards**: Points-based system with order value calculations
- **Blockchain Recording**: Optional on-chain storage of reward transactions

## External Dependencies

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (Neon serverless)
- `OPENAI_API_KEY` - OpenAI API for chat, vision, and TTS
- `XAI_API_KEY` - xAI Grok API for enhanced features

### Optional Integrations
- `STRIPE_SECRET_KEY` - Stripe payment processing
- `BASE_RPC_URL` / `POLYGON_RPC_URL` - Blockchain network access
- `PINATA_API_KEY` / `PINATA_API_SECRET` - IPFS storage via Pinata
- `WEB3_STORAGE_TOKEN` - Decentralized file storage
- `AKASH_API_URL` / `AKASH_DEPLOYMENT_ID` - Akash Network compute

### Third-Party Services
- **Pinata/IPFS**: Decentralized menu and order data storage
- **Akash Network**: Decentralized AI compute infrastructure
- **PrintNode/ezeep**: Cloud printing for kitchen tickets
- **Tableland**: On-chain SQL database for blockchain records

### Key NPM Packages
- `drizzle-orm` + `@neondatabase/serverless` - Database ORM
- `openai` - AI chat and vision capabilities
- `ws` - WebSocket server
- `express-rate-limit` - API rate limiting
- `zod` - Request validation
- `multer` - File upload handling