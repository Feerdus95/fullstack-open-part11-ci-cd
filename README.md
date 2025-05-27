# Fullstack Open Part 11 - CI/CD (Exercises 11.1-11.21)

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

## Exercises Completed

### Exercise 11.1: Getting started with GitHub Actions
- ✅ Set up GitHub Actions workflow
- ✅ Configured linting for Go code with golangci-lint
- ✅ Added testing for both frontend and backend

### Exercise 11.2: Containerizing the application
- ✅ Created a multi-stage Dockerfile
- ✅ Optimized Docker image size
- ✅ Added health check endpoint

### Exercise 11.3: Deployment
- ✅ Basic deployment configuration in GitHub Actions
- ✅ Environment setup for production

### Exercise 11.4: Health check
- ✅ Implemented `/health` endpoint
- ✅ Added health check to Docker container
- ✅ Added health check verification in CI pipeline

### Exercise 11.5: Linting Workflow
- ✅ Created a dedicated linting workflow
- ✅ Configured ESLint for the project
- ✅ Set up automatic linting on push and pull requests

### Exercise 11.6: Fixing Lint Issues
- ✅ Fixed ESLint configuration issues
- ✅ Added proper environment settings for linting
- ✅ Addressed console.log warnings with appropriate ESLint rules

### Exercise 11.7: Building and Testing
- ✅ Added build and test steps to the CI pipeline
- ✅ Configured the workflow to run tests automatically
- ✅ Ensured the build process completes successfully

### Exercise 11.8: Test Fixes
- ✅ Investigated and fixed failing tests
- ✅ Ensured all tests pass in the CI environment
- ✅ Maintained test coverage requirements

### Exercise 11.9: End-to-End Testing
- ✅ Set up Playwright for end-to-end testing
- ✅ Created test directory structure for e2e tests
- ✅ Added initial test cases for the Pokedex front page
- ✅ Configured test environment for CI pipeline integration

### Exercise 11.10: Deploying to Render
- ✅ Deployed the application to Render
- ✅ Configured build and start commands
- ✅ Set up environment variables

### Exercise 11.11: Automatic Deployments
- ✅ Configured GitHub Actions for automatic deployments
- ✅ Added Render API key and service ID as GitHub secrets
- ✅ Set up deployment on push to main branch

### Exercise 11.12: Health Check
- ✅ Verified health check endpoint in production
- ✅ Added health check to Render service configuration
- ✅ Ensured zero-downtime deployments

### Exercise 11.13-11.14: Pull Request Workflow
- ✅ Updated workflow to run on pull requests
- ✅ Configured deployment to only run on main branch
- ✅ Added branch protection rules

### Exercise 11.15-11.16: Versioning
- ✅ Added automatic version bumping on main branch
- ✅ Configured semantic versioning with patch increments
- ✅ Added skip deployment with `#skip` in commit message

### Exercise 11.17: Branch Protection
- ✅ Protected main branch
- ✅ Required pull request reviews
- ✅ Required status checks to pass before merging

### Exercise 11.18: Build Notifications
- ✅ Set up Discord webhook notifications
- ✅ Configured success/failure notifications for deployments
- ✅ Added detailed error information for failed builds

### Exercise 11.19: Periodic Health Check
- ✅ Set up scheduled health checks
- ✅ Checks application health every 6 hours
- ✅ Automatically creates GitHub issues for failures
- ✅ Closes issues when health is restored
- ✅ Configure alerts for service downtime
- ✅ Integrated with GitHub Issues
- ✅ Automatic issue management
- ✅ Configurable health check URL

### Exercise 11.20: Your Own Pipeline
- ✅ Selected Notes App for containerization
- ✅ Set up CI/CD pipeline with GitHub Actions
- ✅ Configured automated testing and deployment
- ✅ Backend: Java/Spring Boot with Maven
- ✅ Frontend: React/TypeScript with npm
- ✅ PostgreSQL database for testing
- ✅ Docker containerization
- ✅ Automated deployment to Docker Hub

### Exercise 11.21: Protected Main Branch with Required Reviews
- ✅ Enable branch protection
- ✅ Require pull request reviews
- ✅ Enforce status checks before merging
- ✅ Configure required status checks for CI/CD pipeline

## Projects

### 1. Pokedex App
- [Documentation](./fullstack-open-part11-pokedex/README.md)

### 2. Notes App
- [Documentation](./noteapp/README.md)
- A full-stack note-taking application with React/TypeScript frontend and Spring Boot/Java backend
- 🔄 **Smart CI/CD Pipeline**: Workflow automatically triggers on changes within the `noteapp/` directory
- 🐳 Containerized with Docker for consistent environments
- ✅ Automated testing and deployment to Docker Hub
- 🛡️ Protected main branch with required reviews and status checks

## Local Development

### Prerequisites

#### For Pokedex App
- Docker
- Node.js 16+
- Go 1.21+
- Git

#### For Notes App
- Docker and Docker Compose
- Java 17 or later (for local development without Docker)
- Maven 3.8.6 or later (for local development without Docker)
- Node.js 18 or later (for frontend development)
- PostgreSQL 15 (or use the provided Docker Compose setup)

### Environment Setup

#### Using Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/Feerdus95/fullstack-open-part11-ci-cd.git
   cd fullstack-open-part11-ci-cd/noteapp
   ```

2. Start the application stack:
   ```bash
   docker-compose up --build
   ```

3. Access the applications:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - Database: PostgreSQL on localhost:5432

#### Manual Setup

For development without Docker:

1. **Backend Setup**
   ```bash
   cd noteapp/backend
   mvn spring-boot:run
   ```

2. **Frontend Setup**
   ```bash
   cd noteapp/frontend
   npm install
   npm run dev
   ```

3. **Database Setup**
   - Install PostgreSQL 15
   - Create a database named `noteapp`
   - Update the database credentials in `noteapp/backend/src/main/resources/application.properties`

### Development Workflow

- The CI/CD pipeline automatically triggers on changes to the `noteapp/` directory
- Run tests locally before pushing:
  ```bash
  # In backend directory
  mvn test
  
  # In frontend directory
  npm test
  ```
- Create feature branches for new changes
- Open pull requests for code review
- Merge to main after approval and passing CI checks

## Running the Pokedex Application

### Development Mode

1. Start the backend:
   ```bash
   cd fullstack-open-part11-pokedex/backend
   go run cmd/app/main.go
   ```

2. In a separate terminal, start the frontend:
   ```bash
   cd fullstack-open-part11-pokedex/frontend
   npm install
   npm start
   ```

### Production Build with Docker

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

### 3. Notification Workflow ([notifications.yml](.github/workflows/notifications.yml))
- Discord notifications for build status
- Success/failure alerts with detailed information
- Real-time updates on deployment status

### 4. Health Check Workflow ([health-check.yml](.github/workflows/health-check.yml))
- Scheduled health checks for the deployed application
- Automatic issue creation for failures
- Self-healing issue management
- Configurable check frequency and target URL

## Live Application

The application is deployed to Render and can be accessed at:
[Pokedex App on Render](https://pokedex-app-gmwc.onrender.com/)

### Health Check
Health check endpoint: [https://pokedex-app-gmwc.onrender.com/health](https://pokedex-app-gmwc.onrender.com/health)

## Health Check Configuration

The application includes a comprehensive health check system:

1. **Endpoint Monitoring**
   - Default URL: `https://pokedex-app-gmwc.onrender.com/health`
   - Expected response: `200 OK` with `{"status": "ok"}`
   - Timeout: 10 seconds

2. **Customization**
   To change the health check URL, add a repository variable:
   - Go to Repository Settings > Secrets and variables > Actions
   - Add a new repository variable:
     - Name: `HEALTH_CHECK_URL`
     - Value: Your custom health check URL

3. **Monitoring**
   - Checks run every 6 hours
   - Creates GitHub issues for failures
   - Automatically resolves issues when service recovers

4. **Manual Testing**
   ```bash
   # Test the health check manually
   curl -v https://pokedex-app-gmwc.onrender.com/health
   ```

5. **Troubleshooting**
   - Check GitHub Actions logs for detailed error information
   - Review open issues for recurring problems
   - Verify application logs on Render dashboard

## Health Check Endpoint

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
