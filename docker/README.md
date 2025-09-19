# Docker Setup for MeetAI

This project includes separate Docker configurations for development and production environments.

## Development Environment

The development setup provides hot reloading and includes all development dependencies.

### Using Docker Compose (Recommended)

```bash
# Start development environment
pnpm run docker:dev

# Stop development environment
pnpm run docker:dev:down
```

### Manual Docker Commands

```bash
# Build development image
pnpm run docker:build:dev

# Run development container
docker run -p 3000:3000 -v $(pwd):/app meetai-dev
```

## Production Environment

The production setup builds and runs the application in production mode.

### Using Docker Compose (Recommended)

```bash
# Start production environment
pnpm run docker:prod

# Stop production environment
pnpm run docker:prod:down
```

### Manual Docker Commands

```bash
# Build production image
pnpm run docker:build:prod

# Run production container
docker run -p 3000:3000 meetai-prod
```

## Environment Variables

Make sure to set up your environment variables:

1. Copy `.env.example` to `.env.local`
2. Fill in your environment variables
3. For production, uncomment the `env_file` line in `docker-compose.prod.yml`

## Key Differences

### Development (`docker/local.dockerfile`)

- Runs `pnpm run dev` (Next.js development server)
- Includes all dependencies (dev + production)
- Mounts source code for hot reloading
- Larger image size but faster development

### Production (`docker/prod.dockerfile`)

- Runs `pnpm run start` (Next.js production server)
- Multi-stage build for smaller image
- Only production dependencies in final image
- Optimized for performance and security
- Uses standalone output for minimal footprint

## Health Checks

The production environment includes health checks. You may want to add a health endpoint at `/api/health` for monitoring.
