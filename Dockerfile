# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# VITE_* vars must be present at build time — Vite inlines them into the
# client bundle. Pass them via `docker build --build-arg` / compose `args`.
ARG VITE_API_URL
ARG VITE_AUTH_URL
ARG VITE_BACK_OFFICE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL
ENV VITE_BACK_OFFICE_URL=$VITE_BACK_OFFICE_URL

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm && apk add --no-cache wget

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs
USER nodejs

# remix-serve reads PORT (defaults to 3000). We pin it to 5173 to mirror dev.
ENV PORT=5173
EXPOSE 5173

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5173/ || exit 1

CMD ["pnpm", "start"]
