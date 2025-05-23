# Build the React app
FROM node:16 AS frontend-builder
WORKDIR /app/frontend

# First copy only package files for better caching
COPY fullstack-open-part11-pokedex/package*.json ./

# Install all dependencies including devDependencies for building
RUN npm ci

# Copy the rest of the application
COPY fullstack-open-part11-pokedex/ .

# Build the React app
RUN npm run build

# Build the Go application
FROM golang:1.21 AS backend-builder
WORKDIR /app
COPY go.mod .
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/app

# Final production image
FROM alpine:3.18
WORKDIR /app

# Install curl for healthcheck
RUN apk --no-cache add curl

# Copy built artifacts
COPY --from=backend-builder /app/server .
# Copy the built React app from the dist directory
COPY --from=frontend-builder /app/frontend/dist ./static

# Set environment variables
ENV PORT=10000
ENV NODE_ENV=production

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Command to run the application
CMD ["./server"]
