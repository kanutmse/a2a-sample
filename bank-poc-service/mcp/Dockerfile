# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Debug: Show what we have before building
RUN echo "=== BEFORE BUILD ===" && ls -la
RUN echo "=== SRC DIRECTORY ===" && ls -la src/ || echo "No src directory"

# Build the TypeScript application
RUN npm run build

# Debug: Show what we have after building
RUN echo "=== AFTER BUILD ===" && ls -la
RUN echo "=== DIST DIRECTORY ===" && ls -la dist/ || echo "No dist directory"

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Debug: Show what we copied
RUN echo "=== PRODUCTION STAGE ===" && ls -la
RUN echo "=== DIST IN PRODUCTION ===" && ls -la dist/ || echo "No dist directory"

# Expose port
EXPOSE 3001

ENV NODE_ENV=production
ENV BANKING_HOST=http://mobile-banking-api:3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Debug: Show the exact command we're about to run
RUN echo "=== ABOUT TO RUN: node dist/index.js --protocol streamable-http ==="

# Use npm start which should run the correct command
CMD ["npm", "start"]