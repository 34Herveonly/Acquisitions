# Acquisitions App - Docker Setup with Neon Database

This guide explains how to run the Acquisitions application using Docker with Neon Database support for both development and production environments.

## Overview

The application supports two database configurations:

- **Development**: Uses Neon Local via Docker for local development
- **Production**: Uses Neon Cloud Database for production deployment

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development without Docker)
- A Neon Cloud account and database (for production)

## Development Environment

### Quick Start

1. **Clone and setup**:

```bash
git clone <your-repo-url>
cd acquisitions
```

2. **Start the development environment**:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This will:

- Build the application Docker image
- Start Neon Local proxy (PostgreSQL-compatible)
- Start the application with hot reloading
- Create automatic database branches for development

3. **Access the application**:

- App: http://localhost:3000
- API: http://localhost:3000/api
- Health Check: http://localhost:3000/health

4. **Optional: Start Drizzle Studio** (for database management):

```bash
docker-compose -f docker-compose.dev.yml --profile tools up drizzle-studio
```

- Drizzle Studio: http://localhost:4983

### Development Features

- **Hot Reloading**: Source code changes are automatically reflected
- **Neon Local**: Provides a local PostgreSQL-compatible database
- **Automatic Branching**: Neon Local creates ephemeral branches for testing
- **Volume Mounting**: Source code is mounted for development
- **Database Persistence**: Database data persists between container restarts

### Development Configuration

The development setup uses `.env.development`:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_URL=postgres://postgres:password@neon-local:5432/neondb
ENABLE_LOGGING=true
DEBUG_MODE=true
```

### Database Migrations (Development)

Run database migrations in development:

```bash
# Run migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Generate new migration
docker-compose -f docker-compose.dev.yml exec app npm run db:generate
```

## Production Environment

### Configuration

1. **Set up your Neon Cloud Database**:
   - Create a Neon project at https://neon.tech
   - Get your connection string (e.g., `postgres://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname`)

2. **Configure production environment**:
   Update `.env.production` with your actual values:

```env
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
DATABASE_URL=postgres://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
ENABLE_LOGGING=true
DEBUG_MODE=false
```

### Deployment Options

#### Option 1: Basic Production Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

#### Option 2: With Nginx Reverse Proxy

```bash
docker-compose -f docker-compose.prod.yml --profile proxy up -d --build
```

#### Option 3: With Monitoring

```bash
docker-compose -f docker-compose.prod.yml --profile monitoring up -d --build
```

#### Option 4: Full Production Stack

```bash
docker-compose -f docker-compose.prod.yml --profile proxy --profile monitoring up -d --build
```

### Production Features

- **Optimized Docker Image**: Multi-stage build with production dependencies only
- **Health Checks**: Built-in health monitoring
- **Security**: Non-root user, limited resources
- **Logging**: Structured JSON logs with rotation
- **Nginx Reverse Proxy**: Rate limiting and security headers
- **Resource Limits**: CPU and memory constraints

### Production Environment Variables

You can override default ports and settings:

```bash
# Custom ports
export APP_PORT=8080
export NGINX_PORT=80
export NGINX_SSL_PORT=443

# Run with custom configuration
docker-compose -f docker-compose.prod.yml up -d
```

## Database Configuration Details

The application automatically detects the environment and uses the appropriate database driver:

- **Development (Neon Local)**: Uses `pg` (PostgreSQL driver) with connection pooling
- **Production (Neon Cloud)**: Uses `@neondatabase/serverless` for serverless connections

### Connection Logic

```javascript
// Automatic detection based on NODE_ENV and DATABASE_URL
const isNeonLocal =
  process.env.NODE_ENV === 'development' &&
  process.env.DATABASE_URL &&
  (process.env.DATABASE_URL.includes('neon-local') ||
    process.env.DATABASE_URL.includes('localhost'));
```

## Useful Commands

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Reset database (removes volume)
docker-compose -f docker-compose.dev.yml down -v

# Access app container shell
docker-compose -f docker-compose.dev.yml exec app sh
```

### Production

```bash
# Deploy production
docker-compose -f docker-compose.prod.yml up -d --build

# View production logs
docker-compose -f docker-compose.prod.yml logs -f app

# Scale application (if needed)
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Stop production
docker-compose -f docker-compose.prod.yml down
```

### Database Management

```bash
# Run migrations (development)
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Generate schema (development)
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Open Drizzle Studio
docker-compose -f docker-compose.dev.yml --profile tools up drizzle-studio
```

## File Structure

```
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.dev.yml     # Development with Neon Local
├── docker-compose.prod.yml    # Production with Neon Cloud
├── .env.development          # Development environment variables
├── .env.production           # Production environment variables
├── .dockerignore             # Docker build optimization
├── nginx.conf                # Nginx reverse proxy config
└── src/
    └── config/
        └── database.js       # Smart database connection logic
```

## Troubleshooting

### Development Issues

1. **Neon Local connection failed**:

```bash
# Check if Neon Local is running
docker-compose -f docker-compose.dev.yml ps neon-local

# View Neon Local logs
docker-compose -f docker-compose.dev.yml logs neon-local
```

2. **Hot reloading not working**:
   - Ensure source code volumes are properly mounted
   - Check if `--watch` flag is working in the container

3. **Port conflicts**:
   - Change ports in docker-compose.dev.yml if 3000 or 5432 are occupied

### Production Issues

1. **Database connection failed**:
   - Verify your Neon Cloud DATABASE_URL is correct
   - Ensure the database is accessible from your deployment environment
   - Check SSL requirements (sslmode=require)

2. **Health check failing**:
   - Check application logs: `docker-compose -f docker-compose.prod.yml logs app`
   - Verify the `/health` endpoint is working

3. **Performance issues**:
   - Adjust resource limits in docker-compose.prod.yml
   - Monitor with: `docker stats`

## Security Considerations

- Environment files (`.env.*`) should never be committed to version control
- Use secrets management in production (Docker Secrets, Kubernetes Secrets, etc.)
- The production setup includes security headers via Nginx
- Database connections use SSL in production
- Application runs as non-root user in production

## Neon Database Features

### Development (Neon Local)

- Local PostgreSQL-compatible database
- Automatic branch creation for testing
- No internet connection required
- Full SQL compatibility

### Production (Neon Cloud)

- Serverless PostgreSQL
- Automatic scaling
- Branching and point-in-time recovery
- Global edge locations
- Connection pooling

For more information about Neon Database features, visit: https://neon.com/docs
