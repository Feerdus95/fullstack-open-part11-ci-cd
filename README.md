# Fullstack Open Part 11 - CI/CD (Exercises 11.1-11.9)

This repository contains the implementation of a CI/CD pipeline for the Pokedex application as part of the Fullstack Open course (Part 11).

## Project Structure

- `/cmd/app` - Go backend application with health check endpoint
- `/fullstack-open-part11-pokedex` - React frontend application
- `/.github/workflows` - GitHub Actions CI/CD pipeline
- `Dockerfile` - Container configuration for the application

## Exercises Implementation

### Exercise 11.1: Getting started with GitHub Actions
- Set up GitHub Actions workflow
- Configured linting for Go code with golangci-lint
- Added testing for both frontend and backend

### Exercise 11.2: Containerizing the application
- Created a multi-stage Dockerfile
- Optimized Docker image size
- Added health check endpoint

### Exercise 11.3: Deployment
- Basic deployment configuration in GitHub Actions
- Environment setup for production

### Exercise 11.4: Health check
- Implemented `/health` endpoint
- Added health check to Docker container
- Added health check verification in CI pipeline

## Local Development

### Prerequisites
- Docker
- Node.js 16+
- Go 1.21+

### Running the application

1. Start the backend:
   ```bash
   go run cmd/app/main.go
   ```

2. In a separate terminal, start the frontend:
   ```bash
   cd fullstack-open-part11-pokedex
   npm install
   npm start
   ```

### Building and running with Docker

```bash
# Build the Docker image
docker build -t pokedex-app .

# Run the container
docker run -p 5000:5000 pokedex-app
```

## CI/CD Pipeline

The GitHub Actions workflow includes:
1. Linting and testing Go code
2. Building and testing the React application
3. Building and testing the Docker image
4. Deployment to production (stub implementation)

View the workflow in [.github/workflows/pipeline.yml](.github/workflows/pipeline.yml).

## Health Check

The application exposes a health check endpoint:
- `GET /health` - Returns 200 OK when the service is healthy

## License

ISC
