# AI Visualization Platform - System Architecture

## Overview

An advanced AI-powered interactive visualization platform that creates immersive, dynamically rendered visual experiences through cutting-edge procedural graphics and intelligent interface technologies. The platform combines a React frontend with Express.js backend, PostgreSQL database with Drizzle ORM, and integrates smart contracts for token rewards. The system features AI-powered conversational ordering, kitchen printing systems, multi-language support, and decentralized Web3 payments using USDC.

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
- July 4, 2025. Refined chart timeframe system to remove 5-minute standalone option
  - Removed dedicated "5m" timeframe button from chart controls
  - Updated hourly (1H) chart to internally use 5-minute data intervals for granular detail
  - Maintained column chart visualization for hourly view with 5-minute granularity
  - Kept trading-style line charts for daily (1D) and weekly (1W) timeframes
  - Updated chart legend to show "Live (5min intervals)" for hourly column chart
  - Simplified timeframe options to: 1H (columns), 1D (lines), 1W (lines) for cleaner UX
- July 4, 2025. Eliminated white footer blocks using proper flexbox layout structure
  - Restructured StandardLayout to use flexbox container (h-screen flex flex-col) instead of min-h-screen
  - Fixed ScrollArea layout by wrapping in flex-1 div with proper overflow handling
  - Removed problematic padding that was creating white background areas at bottom
  - Applied bg-transparent to ScrollArea and proper height calculations for clean footer
  - Ensured consistent bottom spacing across all pages without unwanted white blocks
- July 4, 2025. Enhanced Sales Performance chart as primary dashboard feature with historical comparison
  - Made Sales Performance the main chart prominently displayed above tabs
  - Added historical average data (dark slate bars) vs live sales data (orange bars) for easy comparison
  - Implemented trading hours visualization (9am-midnight) with 16-hour coverage
  - Added live performance indicators with current hour highlighting and pulse animation
  - Created dual-bar chart showing historical averages vs today's live performance
  - Added enhanced tooltips showing live revenue, order counts, and performance vs average
  - Included performance indicators showing +8.2% vs historical and peak hour identification
  - Used OrderFi color scheme: orange (#f97316) for live data, slate (#64748b) for historical data
  - Added "Live" badge and real-time current revenue display in chart header
- July 4, 2025. Enhanced dashboard with comprehensive mock sales data for development
  - Added realistic hourly sales data with revenue, orders, customer counts, and tip tracking
  - Implemented weekly revenue trends and menu performance analytics with profit margins
  - Created detailed customer metrics including satisfaction ratings and loyalty program data
  - Added comprehensive payment method breakdown with USDC/crypto, credit cards, and cash analytics
  - Included staff performance metrics with individual order counts, revenue, and ratings
  - Added operational data including kitchen efficiency, wait times, and cost percentages
  - Enhanced order generation with realistic customer names, menu items, and payment methods
  - Improved dashboard KPIs with $14,530 daily revenue, 567 orders, and $22.38 average order value
- July 4, 2025. Fixed footer background blocking issue across all standardized pages
  - Applied same ScrollArea padding fix (pb-2) from /orderfi-home to StandardLayout component
  - Moved padding from ScrollArea to inner content div to prevent white background blocking
  - Ensured consistent z-index layering (z-[200]) for chat buttons across all pages
  - Prevented content blocking issues behind chat button on admin pages and web3-dapp
  - Maintained transparent background (bg-transparent) for all chat button containers
- July 4, 2025. Rolled out Playwrite Australia Victoria font theme across entire application
  - Applied OrderFi brand font (Playwrite AU VIC) to all page titles, card titles, and headers
  - Updated global CSS with h1, h2, h3 font defaults and brand element classes
  - Standardized font theme across dashboard, inventory, tokenrewards, and all admin pages
  - Enhanced brand consistency with .playwrite-font utility class throughout interface
  - Maintained OrderFi's distinctive handwritten aesthetic across all user touchpoints
- July 4, 2025. Enhanced chat interface with iOS-style animations and transitions
  - Implemented smooth placeholder text fade animations with 600ms transitions and cubic-bezier easing
  - Added gentle floating hover effect for OrderFi logo with vertical movement animation
  - Created perfect circular closing transition using clip-path that mirrors the opening animation
  - Closing animation contracts from full screen to 32px circle at bottom center in 1.5s
  - Enhanced user experience with symmetrical open/close animations for professional feel
- July 2, 2025. Fixed white footer background and z-index layering issues
  - Eliminated white footer background that was blocking 20% of screen behind chat button
  - Fixed OrderFi Tokens card overlapping AI chat button on narrow screens using proper z-index layering
  - Optimized ScrollArea bottom padding from pb-32 to pb-2 for better content flow
  - Set AI chat button to z-[999] and tokens card to z-0 to maintain proper stacking order
  - Resolved all unwanted white background elements throughout interface
- July 2, 2025. Enhanced AI orb with gas giant atmospheric effects and rotating stars
  - Applied gas giant atmospheric texture to both header logo and main chat orb
  - Added planetary rotation animation with flowing atmospheric bands using multi-layer gradients
  - Implemented counter-rotation for center star logo to keep it stationary while background rotates
  - Added 6 tiny (1.5px) rotating and pulsing stars around main chat orb perimeter
  - Created unified branding between header mini-orb and main chat orb with consistent gas giant aesthetic
  - Maintained orange-pink-magenta color palette throughout for cohesive OrderFi brand identity
  - Removed unwanted white circular elements and reduced white gradient opacity for clean appearance
  - Eliminated rocking circle animations while preserving atmospheric flow effects
- July 2, 2025. Fixed AI orb positioning and scroll area padding issues
  - Restructured bottom navigation with dedicated centering container for perfect AI orb alignment
  - Used absolute positioning with flex justify-center for true center alignment independent of navigation buttons
  - Fixed ScrollArea padding inconsistency by moving px-4 from container to content div for even spacing
  - Restored navigation button layout to justify-around for proper Home and Orders button positioning
  - Eliminated card hover overflow issues where left-side cards would extend outside the frame
  - Applied consistent fixes across both orderfi-new.tsx and StandardLayout.tsx components
- July 1, 2025. Professional restaurant dashboard UI overhaul with real-time features
  - Completely redesigned dashboard with modern, professional interface using OrderFi brand colors
  - Added real-time system status bar with live clock, connection status, and system metrics
  - Implemented comprehensive KPI cards: Today's Revenue, Orders, Pending Orders, Average Order Value
  - Integrated real-time data fetching with automatic refresh intervals (10s orders, 30s menu items)
  - Created tabbed interface: Overview, Live Orders, Analytics, Performance with professional styling
  - Added live activity feed showing real-time order updates with status badges
  - Built performance metrics dashboard with progress bars and completion rates
  - Implemented quick action grid for navigation to Inventory, Payments, Staff, and Reports
  - Applied strategic OrderFi gradient colors throughout for brand consistency
  - Enhanced responsive design for optimal viewing on all devices
- July 1, 2025. Strategic color coding and OrderFi brand consistency implementation
  - Removed user-customizable themes in favor of cohesive OrderFi brand colors
  - Implemented strategic color psychology: Orange for urgent items, Pink for financial data, Slate for overview info
  - Applied OrderFi gradient (hsl(25, 95%, 53%) to hsl(340, 82%, 52%)) throughout inventory interface
  - Used Slate Blue (hsl(215, 28%, 17%)) for professional contrast and readability
  - Updated dashboard metrics, buttons, tabs, and data visualization to maintain brand consistency
  - Enhanced navigation psychology with color-coded zones for intuitive data interpretation
- July 1, 2025. Complete UI standardization and header duplication fix
  - Successfully implemented StandardLayout component across all pages for consistent branding
  - Applied OrderFi header with animated stars and Playwrite AU VIC font to all pages
  - Fixed critical header duplication issue by updating hideNavigation array in AppLayout
  - Eliminated duplicate hamburger menu buttons by preventing AppLayout navigation on StandardLayout pages
  - Added standardized hamburger menu to top-right corner of every page without conflicts
  - Positioned AI chat button consistently in center footer across entire application
  - Updated routing structure: /kitchen-printing → /network, /admin/menu → /inventory, /admin/payments → /payments
  - Created clean, simplified admin pages with proper StandardLayout integration
  - Updated Navigation component menu items to reflect new standardized route structure
  - Maintained orange gradient branding and theme-aware design throughout all pages
  - Removed problematic legacy dashboard and orders files with syntax errors
- July 1, 2025. Route reorganization and theme-aware gradients implementation
  - Reorganized page routing structure for better navigation flow
  - Renamed login page (/) to /landing-page for marketing/onboarding
  - Renamed orderfi page (/orderfi) to /orderfi-home as the new default home
  - Updated all home button links throughout app to point to /orderfi-home
  - Updated navigation menu items to reflect new route structure
  - Successfully implemented sunrise/sunset gradient themes for AI chat interface
  - Light mode: Original orange-red-pink gradient for readability
  - Dark mode: Beautiful sunset gradient (orange to red to deep purple)
  - Added useTheme hook integration for automatic theme detection
- June 30, 2025. Navigation white screen flash resolution and UI improvements
  - Successfully eliminated white screen flash during home to orderfi navigation
  - Implemented SPA routing using wouter instead of page reload for seamless transitions
  - Added immediate background colors in HTML to prevent flash on page load
  - Set proper theme colors and meta tags for consistent background rendering
  - Simplified transition system for improved reliability and performance
- June 30, 2025. Dark mode implementation and UI improvements
  - Implemented comprehensive dark mode system with theme toggle on home page
  - Added smooth theme transitions with 0.3s ease animations
  - Updated all components to use semantic color tokens for proper dark mode support
  - Fixed /orderfi page scroll behavior to load at top instead of auto-scrolling to bottom
  - Enhanced Quick Actions with orange gradient styling and hover animations
  - Maintained orange gradient branding consistency across both light and dark themes
- June 29, 2025. Font customization and AI POS MVP completion
  - Changed OrderFi title font to "Playwrite AU VIC" for distinctive branding
  - Removed subtitle element for cleaner logo presentation
  - Completed comprehensive AI POS MVP with all core objectives achieved
  - Fully implemented conversational AI layer replacing traditional POS interfaces
  - Added Google Fonts integration for custom typography
  - Completed all high-priority features: payment system, rewards, voice input, user profiles
  - Implemented restaurant admin dashboard and analytics
  - Added customer order history and fast reorder functionality
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