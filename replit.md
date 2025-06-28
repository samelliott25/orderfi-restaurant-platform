# OrderFi AI - Comprehensive System Architecture

## Overview

OrderFi AI is a blockchain-first, decentralized restaurant platform that revolutionizes dining experiences through conversational AI and Web3 infrastructure. The platform combines a React frontend with Express.js backend, PostgreSQL database with Drizzle ORM, and integrates smart contracts for token rewards. The system features AI-powered conversational ordering, kitchen printing systems, multi-language support, and decentralized Web3 payments using USDC.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite build system
- **Styling**: Tailwind CSS with shadcn/ui component library (New York variant)
- **State Management**: TanStack Query for server state management
- **UI Components**: Comprehensive shadcn/ui integration with 40+ Radix UI components
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Custom cream-themed (#ffe6b0) design with retro aesthetic

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **AI Integration**: OpenAI GPT-4o for conversational ordering and operations assistance
- **Authentication**: API key-based authentication with rate limiting
- **Monitoring**: Custom metrics collection and health check endpoints

### Blockchain Infrastructure
- **Smart Contracts**: Hardhat development environment with Solidity contracts
- **Networks**: Multi-chain support (Base, Polygon, Ethereum)
- **Token System**: MIMI rewards contract with tiered loyalty system
- **Payment Processing**: USDC integration for crypto-native payments
- **Deployment**: Automated deployment scripts with verification

## Key Components

### AI Chat System
- **Conversational Ordering**: GPT-4o powered chat for natural language menu interactions
- **Context Awareness**: Maintains conversation history and customer preferences
- **Menu Categorization**: Automated categorization service for menu items
- **Multi-language Support**: Detection and support for English, Spanish, Portuguese, French
- **Voice Integration**: Text-to-speech using OpenAI's TTS API

### Kitchen Operations
- **Order Management**: Real-time order processing and status tracking
- **Kitchen Printing**: Support for thermal, impact, and cloud printers
- **Printer Drivers**: Comprehensive driver management for Epson, Star, Bixolon printers
- **Cloud Printing**: Integration with PrintNode, Google Cloud Print, ezeep Blue
- **USB Support**: Direct USB printer communication with device discovery

### Blockchain Integration
- **Smart Contracts**: MimiRewards contract for token-based loyalty system
- **Wallet Integration**: Support for MetaMask, WalletConnect, Coinbase Wallet
- **Decentralized Storage**: IPFS integration for menu data and order history
- **Batch Processing**: Rollup batch processor for gas optimization
- **Multi-Provider**: Akash Network integration for decentralized compute

### Restaurant Management
- **Menu Management**: CRUD operations with AI-powered categorization
- **Order Tracking**: Real-time order status and kitchen display integration
- **Analytics**: Performance metrics and business intelligence
- **Staff Management**: Role-based access control and permissions

## Data Flow

### Order Processing Flow
1. Customer initiates conversation through AI chat interface
2. AI processes natural language input and suggests menu items
3. Items are added to cart with real-time price calculation
4. Order is submitted and stored in PostgreSQL database
5. Kitchen receives order through thermal printer or KDS
6. Order status updates are tracked and communicated back to customer
7. Token rewards are calculated and distributed via smart contract

### Payment Processing Flow
1. Customer selects payment method (USDC, credit card, cash)
2. For crypto payments, Web3 wallet connection is established
3. USDC payment is processed on selected network (Base/Polygon)
4. Transaction is confirmed on blockchain
5. Order is marked as paid and sent to kitchen
6. Receipt is generated and customer receives confirmation

### Data Storage Flow
1. Menu items and orders are stored in PostgreSQL via Drizzle ORM
2. Chat conversations are cached for context awareness
3. Critical data is backed up to IPFS for decentralization
4. Blockchain records are maintained for token transactions
5. Analytics data is aggregated for business insights

## External Dependencies

### AI Services
- **OpenAI**: GPT-4o for chat, TTS for voice synthesis
- **Anthropic**: Alternative AI provider configuration

### Blockchain Services
- **Hardhat**: Smart contract development and deployment
- **Ethers.js**: Blockchain interaction library
- **OpenZeppelin**: Security-audited contract templates

### Database & Storage
- **Neon**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **IPFS**: Decentralized file storage

### Payment Processing
- **Circle API**: USDC payment processing
- **Base Network**: Primary blockchain for transactions
- **Polygon**: Secondary network for lower fees

### Printing Services
- **ESC/POS**: Thermal printer communication protocol
- **PrintNode**: Cloud printing service
- **USB Drivers**: Direct printer hardware communication

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: Local PostgreSQL or Neon development instance
- **Blockchain**: Hardhat local network for testing

### Production Deployment
- **Application**: Express.js server serving built React app
- **Database**: Neon PostgreSQL with connection pooling
- **Smart Contracts**: Deployed to Base mainnet
- **Monitoring**: Health checks and metrics collection
- **Scaling**: Ready for containerization with Docker

### Infrastructure Components
- **Build Process**: Vite for frontend, esbuild for backend bundling
- **Package Management**: npm with lockfile for reproducible builds
- **Configuration**: Environment-based configuration with TypeScript
- **Testing**: Production testing suite with automated health checks

## Changelog

```
Changelog:
- June 28, 2025. Implemented critical payment flow and rewards system
  - Added PaymentEngine with Stripe, crypto, and cash payment support
  - Created RewardEngine with tier-based loyalty system (Bronze/Silver/Gold/Platinum)
  - Built payment API routes (/api/payments/*) and rewards API (/api/rewards/*)
  - Implemented PaymentFlow and RewardsDashboard frontend components
  - Added comprehensive token minting and claiming functionality
- June 27, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```