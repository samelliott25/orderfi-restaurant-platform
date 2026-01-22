# OrderFi Voice API - Simplified AI Food Ordering

## Overview

OrderFi Voice API is a simplified, voice-only AI food ordering backend. It uses GPT-4o for natural language processing to take orders through speech-to-text transcripts and responds with AI-generated text (with optional TTS).

## User Preferences

Preferred communication style: Simple, everyday language.
Design philosophy: Voice-first, backend-focused, minimal complexity.

## System Architecture

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints for voice processing
- **Entry Point**: `server/index.ts`

### Data Storage
- **Storage**: In-memory storage (`MemStorage`) for development
- **Schema Location**: `shared/schema.ts` defines data structures
- **Pattern**: Interface-based storage abstraction (`IStorage`) in `server/storage.ts`

### AI Integration
- **Primary AI**: OpenAI GPT-4o for conversational ordering
- **Voice Output**: OpenAI TTS with Nova voice
- **Session Management**: In-memory session tracking for orders

## API Endpoints

### Voice Ordering
- `POST /api/voice/process` - Process voice transcript, returns AI response and order updates
- `POST /api/voice/speak` - Text-to-speech conversion
- `GET /api/voice/session/:sessionId` - Get current session state
- `POST /api/voice/complete/:sessionId` - Complete and submit order

### Menu & Orders
- `GET /api/menu` - Get menu items
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `GET /health` - Health check

## Required Environment Variables
- `OPENAI_API_KEY` - OpenAI API for chat and TTS

## Key Files
- `server/index.ts` - Express server entry point
- `server/voice-routes.ts` - Voice API endpoints
- `server/storage.ts` - Data storage interface and implementation
- `shared/schema.ts` - Database schemas and types

## Recent Changes
- Simplified from full-stack to voice-only API backend
- Removed React UI, blockchain features, visual tools
- Focus on speech-to-text, NLP ordering, backend operations
