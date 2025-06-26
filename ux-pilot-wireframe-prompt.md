# UX Pilot Wireframe Generation Prompt: OrderFi AI Platform

## Project Overview
Create comprehensive Hi-Fi wireframes for **OrderFi AI** - a revolutionary blockchain-first AI restaurant platform that transforms dining experiences through intelligent conversational interactions. This is a mobile-first Progressive Web App (PWA) with two distinct user experiences:

1. **Customer OrderFi Interface** - AI-powered conversational ordering system
2. **Restaurant Dashboard** - Back office management with AI Operations Agent

## Core Concept & Value Proposition
OrderFi AI reimagines restaurant ordering by making AI conversation the primary interface, not traditional menu browsing. Customers interact naturally with an AI chatbot that understands preferences, makes recommendations, and guides the entire ordering process through voice and text. The platform integrates blockchain technology for transparent transactions and loyalty rewards.

## Primary User Flows

### Customer Journey (OrderFi Interface)
1. **Home Screen**: Video logo animation with "Enter DApp" button
2. **OrderFi Chat Interface**: Full-screen AI conversation with bottom input panel
3. **Voice Interaction**: Speech-to-text ordering with visual wave animations
4. **Menu Discovery**: AI mentions items that appear as interactive buttons
5. **Cart Management**: Items added through AI conversation flow
6. **Checkout**: AI-guided payment with blockchain token rewards
7. **Order Tracking**: Real-time status updates

### Restaurant Staff Journey (Dashboard)
1. **Dashboard Overview**: Live order statistics and kitchen display
2. **Order Management**: Real-time order queue with status updates
3. **Kitchen Printing**: Thermal printer setup and management
4. **Token Rewards**: Customer loyalty program administration
5. **Operations AI**: Bottom chat interface for staff assistance
6. **Settings**: System configuration and preferences

## Design System & Theme

### Color Palette
- **Primary Orange**: #FF6B35 (vibrant orange for CTAs and branding)
- **Background**: #FCFCFC (consistent off-white background across all pages)
- **Text Primary**: #1A1A1A (dark charcoal for main text)
- **Text Secondary**: #6B7280 (gray for secondary information)
- **Success**: #10B981 (green for positive states)
- **Warning**: #F59E0B (amber for alerts)
- **Error**: #EF4444 (red for errors)

### Typography
- **Headings**: "Playwrite Australia Victoria" (handwritten style for OrderFi branding)
- **Body Text**: System font stack with high readability
- **AI Messages**: Clean, conversational typography with proper spacing

### Visual Elements
- **AI Icon**: Diamond/sparkle symbol (modern AI representation)
- **Loading States**: Orange gradient animations
- **Wave Animation**: Voice input visual feedback
- **Glassmorphism**: Subtle blur effects for modals and overlays

## Key Interface Components

### Bottom Chat Interface (Both Apps)
- Fixed bottom position with rounded top corners
- Voice input button with pulsing animation
- Text input with send button
- Quick action pills above input area
- Collapsible/expandable interface

### AI Chat Experience
- Conversational bubbles with distinct styling
- User messages: Right-aligned, orange gradient
- AI messages: Left-aligned, white with subtle shadow
- Menu item buttons: Inline clickable elements within AI messages
- Voice wave visualization during speech input

### Restaurant Dashboard Elements
- Real-time order cards with status indicators
- Kitchen display with order queue
- Statistics widgets with live data
- Printer status indicators
- Settings panels with tabbed interface

## Technical Integration Points

### AI & Voice Features
- OpenAI GPT-4o integration for natural conversation
- Web Speech API for voice input/output
- Real-time response streaming
- Context-aware menu recommendations
- Order processing through natural language

### Blockchain Integration
- Multi-tier loyalty system (Bronze/Silver/Gold/Platinum)
- Token reward visualization
- Transaction history tracking
- Crypto bonus displays

### Kitchen Printing System
- Thermal printer management interface
- USB/Network/Cloud printer discovery
- Driver installation workflows
- Print queue management
- ESC/POS receipt formatting

### Real-time Features
- Live order status updates
- Kitchen display synchronization
- WebSocket connections for instant updates
- Push notification system

## Specific Wireframe Requirements

### Mobile-First Design
- Optimize for iPhone/Android portrait orientation
- Touch-friendly interface elements (minimum 44px targets)
- Swipe gestures for navigation
- Bottom-heavy layout for thumb accessibility

### Progressive Web App Features
- Home screen installable icon
- Offline capability indicators
- Loading states and skeleton screens
- Native app-like transitions

### Accessibility Considerations
- High contrast mode compatibility
- Screen reader optimization
- Voice control integration
- Large text support

## Key User Scenarios to Visualize

1. **First-time Customer**: Discovering OrderFi through AI conversation
2. **Voice Ordering**: Hands-free food ordering while multitasking
3. **Loyalty Rewards**: Earning and redeeming tokens
4. **Restaurant Staff**: Managing orders during peak hours
5. **Kitchen Operations**: Receiving and processing printed orders

## Platform Specifications
- **Primary Platform**: Progressive Web App (mobile browsers)
- **Secondary**: Desktop web browser support
- **Technology**: React frontend with Express backend
- **Database**: PostgreSQL with real-time synchronization
- **Payment**: Blockchain-enabled transactions

## Competitive Differentiation
- AI-first ordering (not menu browsing)
- Voice-native experience
- Blockchain transparency and rewards
- Integrated kitchen operations
- Real-time synchronization across all touchpoints

## Success Metrics to Consider in Design
- Order completion rate through AI conversation
- Voice interaction adoption
- Token reward engagement
- Kitchen operational efficiency
- Customer return frequency

Please generate comprehensive Hi-Fi wireframes that showcase the complete user journey for both customer and restaurant experiences, emphasizing the conversational AI interface, voice interactions, and seamless integration between all system components. Focus on the mobile-first approach while maintaining the sophisticated, modern aesthetic that reflects OrderFi's innovative positioning in the restaurant technology space.