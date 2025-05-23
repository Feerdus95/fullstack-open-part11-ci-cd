# Fullstack Open Part 11 - CI/CD (Exercises 11.1-11.17)

This repository contains the implementation of a CI/CD pipeline for the Pokedex application as part of the Fullstack Open course (Part 11). The application is deployed to [Render](https://render.com/) with automated deployments from the main branch.

## Project Structure

- `/cmd/app` - Go backend application with health check endpoint
  - `main.go` - Main application file with HTTP server and routes
- `/fullstack-open-part11-pokedex` - React frontend application
  - `/src` - React application source code
  - `/e2e-tests` - End-to-end tests using Playwright
  - `package.json` - Frontend dependencies and scripts
- `/.github/workflows` - GitHub Actions CI/CD pipelines
  - `pipeline.yml` - Initial CI pipeline for testing and building
  - `deploy.yml` - Deployment and versioning workflow
- `Dockerfile` - Multi-stage Dockerfile for building the application
- `build_step.sh` - Build script for the application

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

### Exercise 11.5: Linting Workflow
- Created a dedicated linting workflow
- Configured ESLint for the project
- Set up automatic linting on push and pull requests

### Exercise 11.6: Fixing Lint Issues
- Fixed ESLint configuration issues
- Added proper environment settings for linting
- Addressed console.log warnings with appropriate ESLint rules

### Exercise 11.7: Building and Testing
- Added build and test steps to the CI pipeline
- Configured the workflow to run tests automatically
- Ensured the build process completes successfully

### Exercise 11.8: Test Fixes
- Investigated and fixed failing tests
- Ensured all tests pass in the CI environment
- Maintained test coverage requirements

### Exercise 11.9: End-to-End Testing
- Set up Playwright for end-to-end testing
- Created test directory structure for e2e tests
- Added initial test cases for the Pokedex front page
- Configured test environment for CI pipeline integration

### Exercise 11.10: Deploying to Render
- Deployed the application to Render
- Configured build and start commands
- Set up environment variables

### Exercise 11.11: Automatic Deployments
- Configured GitHub Actions for automatic deployments
- Added Render API key and service ID as GitHub secrets
- Set up deployment on push to main branch

### Exercise 11.12: Health Check
- Verified health check endpoint in production
- Added health check to Render service configuration
- Ensured zero-downtime deployments

### Exercise 11.13-11.14: Pull Request Workflow
- Updated workflow to run on pull requests
- Configured deployment to only run on main branch
- Added branch protection rules

### Exercise 11.15-11.16: Versioning
- Added automatic version bumping on main branch
- Configured semantic versioning with patch increments
- Added skip deployment with `#skip` in commit message

### Exercise 11.17: Branch Protection
- Protected main branch
- Required pull request reviews
- Required status checks to pass before merging

## Local Development

### Prerequisites
- Docker
- Node.js 16+
- Go 1.21+
- Git

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Feerdus95/fullstack-open-part11-ci-cd.git
   cd fullstack-open-part11-ci-cd
   ```

2. Install frontend dependencies:
   ```bash
   cd fullstack-open-part11-pokedex
   npm install
   ```

3. Install Playwright for end-to-end testing:
   ```bash
   npx playwright install
   ```

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

The project uses GitHub Actions with two main workflows:

### 1. CI Pipeline ([pipeline.yml](.github/workflows/pipeline.yml))
- Linting and testing Go code
- Building and testing the React application
- Running end-to-end tests with Playwright
- Building and testing the Docker image
- Verifying the health check endpoint

### 2. Deployment Workflow ([deploy.yml](.github/workflows/deploy.yml))
- Automatic deployment to Render on push to main
- Version tagging with semantic versioning
- Branch protection and PR verification
- Skip deployment with `#skip` in commit message

## Live Application

The application is deployed to Render and can be accessed at:
[Pokedex App on Render](https://pokedex-app-gmwc.onrender.com/)

### Health Check
Health check endpoint: [https://pokedex-app-gmwc.onrender.com/health](https://pokedex-app-gmwc.onrender.com/health)

## Health Check

The application exposes a health check endpoint that's used for monitoring and zero-downtime deployments:

```http
GET /health
```

**Response:**
```json
{"status": "ok"}
```

This endpoint is used by:
- Render for health monitoring
- CI/CD pipeline for deployment verification
- Kubernetes/Docker for container health checks

## License

ISC
