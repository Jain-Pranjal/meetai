# --- Stage 1: Builder ---
FROM node:20-alpine AS builder

RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# --- Stage 2: Final Image ---
FROM node:20-alpine

RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000
CMD ["pnpm", "start"]


# uses the multi stage build to optimize the image size and performance. The first stage builds the application, and the second stage creates a lightweight image for running the app in production.