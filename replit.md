# OrderFi AI - Comprehensive System Architecture

## Overview

OrderFi AI is a blockchain-first, decentralized restaurant platform revolutionizing dining experiences with conversational AI and Web3 integration. It features a React frontend, Express.js backend, PostgreSQL with Drizzle ORM, and smart contracts for token rewards. Key capabilities include AI-powered conversational ordering, kitchen printing, multi-language support, and decentralized Web3 payments using USDC. The platform aims to provide a comprehensive, intelligent solution for modern restaurant management.

## User Preferences

Preferred communication style: Simple, everyday language.
Typography preferences:
- OrderFi logo/brand name must always use Playwrite font
- Playwrite font for headings and titles (changed from Rock Salt)
- SUSE font for body text
Development workflow:
- Use "ADA" as shorthand for Autonomous Development Agent
- When user asks for ADA, run competitive analysis and refinement process

## System Architecture

**UI/UX Decisions:**
- **Frontend Framework**: React 18, TypeScript, Vite.
- **Styling**: Tailwind CSS with shadcn/ui (New York variant) and custom cream-themed (#ffe6b0) retro aesthetic.
- **State Management**: TanStack Query.
- **Routing**: Wouter.
- **Mobile-First Design**: Responsive grid layouts (2-column for mobile), 16px margins, 12px gutters, 200px card height (60% image, 35% content, 5% padding), 4:3 image aspect ratio. Typography scaled for mobile (product names 12px, prices 12px bold, badges 10px).
- **Design System**: Apple Liquid Glass (glassmorphism) applied across the dashboard and UI elements, with consistent orange/pink gradient branding. Modern progressive loading (skeleton screens, shimmer effects).
- **Typography**: Inter (primary) for UI/headings/body, Comfortaa (brand) for OrderFi logo only.
- **UI Innovations**: Dynamic Glass Morphism Cards, Spatial Voice Navigation, Contextual Gesture Zones for enhanced interaction.

**Technical Implementations:**
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: PostgreSQL with Drizzle ORM.
- **AI Integration**: OpenAI GPT-4o for conversational ordering, operations assistance, and UI analysis/generation.
- **Authentication**: API key-based with rate limiting.
- **Blockchain**: Hardhat, Solidity smart contracts (MIMI rewards, USDC payments), multi-chain support (Base, Polygon, Ethereum), Ethers.js, IPFS for decentralized storage.
- **Kitchen Operations**: Real-time order processing, support for thermal/impact/cloud printers (PrintNode, Google Cloud Print, ezeep Blue), USB printer communication.
- **AI Chat System**: GPT-4o for natural language, context awareness, multi-language support (English, Spanish, Portuguese, French), OpenAI TTS for voice integration.
- **Restaurant Management**: CRUD for menu, real-time order tracking, analytics, role-based staff management.
- **KDS**: Responsive grid, scrollable item lists, priority sorting, pagination, audio alerts, offline mode, customizable display, multi-station routing.
- **Figma Integration**: API for design system sync, token extraction, automated component generation.

**System Design Choices:**
- **Decentralized Approach**: Leveraging blockchain for loyalty (MIMI tokens) and payments (USDC) to provide transparency and reduce fees.
- **Conversational UI**: AI-first interaction paradigm for ordering and management.
- **Real-time Operations**: WebSockets for live updates in KDS and dashboard.
- **Autonomous Development Agent (ADA)**: AI-driven system for competitive analysis, feature discovery, UI/UX improvement, code generation, and automated implementation/testing.
- **Progressive Disclosure**: Dashboard organized into Executive, Operations, and Analytics views to reduce cognitive load.

## External Dependencies

- **AI Services**: OpenAI (GPT-4o, TTS), Anthropic (alternative).
- **Blockchain Services**: Hardhat, Ethers.js, OpenZeppelin (contract templates).
- **Database & Storage**: Neon (serverless PostgreSQL), Drizzle ORM, IPFS.
- **Payment Processing**: Circle API (USDC), Base Network, Polygon.
- **Printing Services**: PrintNode, ESC/POS.