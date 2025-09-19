# Development Dockerfile
FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies (including dev dependencies for development)
RUN pnpm install


# Expose port
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Start development server with hot reloading
CMD ["pnpm", "run", "dev"]



# we dont need the COPY . . line in the devlopment Dockerfile because in a development environment, we typically want to mount the source code from the host machine into the container using Docker volumes. This allows for hot reloading and immediate reflection of code changes without needing to rebuild the Docker image each time a change is made.



