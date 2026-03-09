# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development
# Install netcat for health checks and all dependencies
RUN apk add --no-cache netcat-openbsd
RUN npm ci

# Copy source code
COPY . .

# Make scripts executable
RUN chmod +x ./scripts/docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Run in development mode with watch
CMD ["npm", "run", "dev"]

# Production dependencies stage
FROM base AS prod-deps
# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Production stage
FROM node:20-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy source code and set ownership
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]