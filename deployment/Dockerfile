# Multi-stage build for Mimi Waitress
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Development dependencies for build
FROM base AS dev-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Build both client and server
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 mimiuser

# Copy built application
COPY --from=builder --chown=mimiuser:nodejs /app/dist ./dist
COPY --from=builder --chown=mimiuser:nodejs /app/client/dist ./client/dist
COPY --from=deps --chown=mimiuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=mimiuser:nodejs /app/package*.json ./

USER mimiuser

EXPOSE 5000

CMD ["node", "dist/index.js"]