# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js Express API called "Acquisitions" that provides authentication functionality with security features, using PostgreSQL via Drizzle ORM and dual database configurations for development (Neon Local) and production (Neon Cloud).

## Development Commands

### Local Development

```bash
# Development with hot reloading
npm run dev

# Start server normally
npm start
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### Database Operations

```bash
# Generate new migration
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Docker Development

```bash
# Development environment with Neon Local
npm run dev:docker
# OR
docker-compose -f docker-compose.dev.yml up --build

# Production environment with Neon Cloud
npm run prod:docker
# OR
docker-compose -f docker-compose.prod.yml up -d --build

# Access Drizzle Studio in Docker dev environment
docker-compose -f docker-compose.dev.yml --profile tools up drizzle-studio
```

### Database Management in Docker

```bash
# Run migrations in development container
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Generate schema in development container
docker-compose -f docker-compose.dev.yml exec app npm run db:generate
```

## Architecture Overview

### Application Structure

- **Entry Point**: `src/index.js` → `src/server.js` → `src/app.js`
- **Path Aliases**: Uses Node.js imports map with `#` prefix (e.g., `#config/*`, `#controller/*`)
- **Database**: Dual-mode setup - Neon Local (dev) vs Neon Cloud (prod) with automatic detection
- **Security**: Arcjet integration for bot protection, rate limiting, and shield protection
- **Logging**: Winston with file and console outputs, structured JSON logging

### Key Directories

- **`src/config/`**: Database connection, logger, and Arcjet security configuration
- **`src/controller/`**: HTTP request handlers (auth, users)
- **`src/middleware/`**: Security middleware with role-based rate limiting
- **`src/models/`**: Drizzle ORM schema definitions
- **`src/routes/`**: Express route definitions
- **`src/services/`**: Business logic layer (auth operations, password hashing)
- **`src/utils/`**: Utilities (JWT, cookie handling, validation formatting)
- **`src/validations/`**: Zod schema validations

### Database Configuration Logic

The app automatically detects the environment and uses appropriate database drivers:

- **Development**: Uses `pg` (PostgreSQL driver) when `DATABASE_URL` contains `neon-local` or `localhost`
- **Production**: Uses `@neondatabase/serverless` for Neon Cloud connections
- **Configuration**: Defined in `src/config/database.js` with graceful shutdown handling

### Security Features

- **Arcjet Shield**: Protects against SQL injection and common attacks
- **Bot Detection**: Allows search engines and preview bots, blocks others
- **Role-based Rate Limiting**: Different limits for admin (20), user (10), guest (5) per minute
- **JWT Authentication**: HTTP-only cookies with role-based access
- **Helmet**: Security headers middleware

### Authentication Flow

1. User registration/login through `/api/auth` routes
2. Password hashing with bcrypt (salt rounds: 10)
3. JWT token generation with user ID, email, role
4. HTTP-only cookie storage
5. Role-based access control (admin, user, guest)

## Environment Configuration

### Development (.env.development)

- Uses Neon Local PostgreSQL on port 5432
- Debug logging enabled
- Hot reloading with `--watch` flag

### Production (.env.production)

- Uses Neon Cloud with SSL
- Info-level logging
- Docker multi-stage build optimization

## Common Development Patterns

### Adding New Routes

1. Create validation schema in `src/validations/`
2. Add service function in `src/services/`
3. Create controller in `src/controller/`
4. Define routes in `src/routes/`
5. Register routes in `src/app.js`

### Database Schema Changes

1. Modify model in `src/models/`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:migrate` to apply changes
4. Use `npm run db:studio` to verify schema

### Security Middleware

The `securityMiddleware` applies role-based rate limiting automatically. User role is extracted from JWT token in `req.user.role`, defaulting to 'guest' if not authenticated.

## Testing and Validation

The codebase uses:

- **Zod** for runtime validation
- **ESLint** with custom configuration for code quality
- **Prettier** for code formatting
- **Winston** for structured logging with error tracking

## Docker Integration

### Development Environment

- Uses `docker-compose.dev.yml` with Neon Local proxy
- Volume mounting for hot reloading
- Includes optional Drizzle Studio service
- Automatic database branching for testing

### Production Environment

- Uses `docker-compose.prod.yml` with optimized build
- Optional Nginx reverse proxy with rate limiting
- Health checks and resource limits
- Multi-stage Docker build for smaller images

Access points:

- App: http://localhost:3000
- API: http://localhost:3000/api
- Health: http://localhost:3000/health
- Drizzle Studio: http://localhost:4983 (dev only)
