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

# Copy the binary from builder
COPY --from=builder /app/server .

# Create static directory (no need to copy since we don't have static files yet)
RUN mkdir -p static

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Add curl for healthcheck and debugging
RUN apk --no-cache add curl

# Expose port
EXPOSE $PORT

# Health check with retry and better error handling
HEALTHCHECK --interval=5s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Command to run the application
CMD ["./server"]
