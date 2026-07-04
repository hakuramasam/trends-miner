# Trends Miner Dockerfile
# Multi-stage build for production optimization

# Stage 1: Install contracts dependencies and compile
FROM node:18-alpine AS contracts-builder

WORKDIR /app/contracts

COPY contracts/package.json contracts/package-lock.json* ./
RUN npm ci

COPY contracts/contracts contracts/
RUN npx hardhat compile

# Stage 2: Builder for frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy contracts artifacts
COPY --from=contracts-builder /app/contracts/artifacts ./contracts/artifacts

# Install frontend dependencies
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm ci

# Copy all source files
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs &&     adduser -S nodejs -u 1001

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/contracts ./contracts

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3   CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]