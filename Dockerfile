# Build the Go application
FROM golang:1.21 AS builder
WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod .
COPY go.sum .

# Download dependencies
RUN go mod download

# Copy the rest of the application
COPY . .


# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/app

# Final production image
FROM alpine:3.18
WORKDIR /app

# Install curl for healthcheck
RUN apk --no-cache add curl

# Build the Pokedex app
FROM node:16 AS pokedex-builder
WORKDIR /app/pokedex
COPY fullstack-open-part11-pokedex/package*.json ./
RUN npm ci
COPY fullstack-open-part11-pokedex/ .
RUN npm run build

# Final production image
FROM alpine:3.18
WORKDIR /app

# Install curl for healthcheck
RUN apk --no-cache add curl

# Copy the Go binary
COPY --from=builder /app/server .

# Copy the built Pokedex app
COPY --from=pokedex-builder /app/pokedex/dist ./pokedex-dist

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Expose port
EXPOSE $PORT

# Health check with retry and better error handling
HEALTHCHECK --interval=5s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Command to run the application
CMD ["./server"]
