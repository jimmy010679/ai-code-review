# Stage 1: Install dependencies
FROM node:24.14.0-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable corepack for Yarn 4
RUN corepack enable && corepack prepare yarn@4.13.0 --activate

COPY package.json yarn.lock .yarnrc.yml ./
# COPY .yarn ./.yarn (If you have releases or plugins)

RUN yarn install --immutable

# Stage 2: Build the application
FROM node:24.14.0-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.13.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Stage 3: Runner
FROM node:24.14.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permissions for cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone output and static files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Set Memory 512MB/75%
ENV NODE_OPTIONS="--max-old-space-size=384"

# server.js is created by next build when output: 'standalone' is used
CMD ["node", "server.js"]
