# NoteApp - Note Application

*Last updated: 2025-05-24 00:32*

A web application for creating, editing, and organizing notes with categories. Implemented as a Single Page Application (SPA) with a RESTful backend.

## Project Description

NoteApp is an application that allows users to manage digital notes with the following functionalities:

### Phase 1 (Implemented)
- Create, edit, and delete notes
- Archive and unarchive notes
- List active notes
- List archived notes

### Phase 2 (Implemented)
- Add/remove categories to notes
- Filter notes by category

## Technologies Used

### Backend
- **Java**: 17
- **Spring Boot**: 3.2.2
- **Spring Data JPA**: For the persistence layer
- **PostgreSQL**: 16 (Relational database)
- **Maven**: Dependency management system

### Frontend
- **React**: 18.x
- **TypeScript**: 5.x
- **Vite**: Build tool
- **React Query**: For state management and API requests
- **Radix UI**: User interface components
- **Tailwind CSS**: Styling framework
- **Axios**: HTTP client for backend communication

## Prerequisites

To run this application you need to have installed:

- **Docker**: For the PostgreSQL database
- **Node.js**: v18.17.0 or higher
- **npm**: 9.6.0 or higher
- **Java**: JDK 17
- **Maven**: 3.8.0 or higher (or use the included wrapper)

## Project Structure

```
noteapp/
├── backend/             # Spring Boot application
│   ├── src/main/
│   │   ├── java/       # Java source code
│   │   └── resources/  # Configuration
│   └── pom.xml         # Maven dependencies
├── frontend/           # React application
│   ├── src/            # TypeScript/React source code
│   ├── public/         # Static files
│   └── package.json    # npm dependencies
└── start.sh           # Startup script
```

## Installation and Execution

### Method 1: Automatic Startup Script

The `start.sh` script provides a complete development environment setup with these features:

1. **Database Setup**:
   - Creates and configures a PostgreSQL container named `noteapp-db`
   - Sets up the database schema automatically

2. **Parallel Service Startup**:
   - Starts the Spring Boot backend in one terminal
   - Starts the React frontend in another terminal
   - Automatically handles port assignments

3. **Cleanup Functionality**:
   - Stops and removes the database container when done
   - Cleans up temporary files

To use the script:

```bash
# Give execution permissions to the script
chmod +x start.sh

# Run the script (add -v for verbose output)
./start.sh

# To stop all services and clean up:
./start.sh --clean
```

Note: The script requires Docker, Java 17, and Node.js to be installed.

### Method 2: Manual Installation

#### Backend

1. Start the PostgreSQL database:
   ```bash
   docker run --name noteapp-db -e POSTGRES_DB=noteapp \
       -e POSTGRES_USER=noteuser -e POSTGRES_PASSWORD=notepass \
       -p 5432:5432 -d postgres:16
   ```

2. Navigate to the backend directory and start the application:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application in development mode:
   ```bash
   npm run dev
   ```

## Accessing the Application

- **Backend API**: http://localhost:8080
- **Frontend**: http://localhost:5173 (or the port assigned by Vite)

## Architecture

### Backend

The backend application is structured in layers:

- **Controllers**: Handle HTTP requests and define REST endpoints
- **Services**: Contain business logic
- **Repositories**: Interact with the database
- **Models**: Represent database entities
- **DTOs**: Data transfer objects

### Frontend

The frontend application is organized into:

- **Components**: Reusable interface elements
- **Pages**: Main application views
- **Hooks**: Reusable logic and state management
- **Services**: API communication

## REST API

The backend exposes the following main endpoints:

- `GET /notes`: Get all notes
- `GET /notes/active`: Get active notes
- `GET /notes/archived`: Get archived notes
- `POST /notes`: Create a new note
- `PUT /notes/{id}`: Update an existing note
- `DELETE /notes/{id}`: Delete a note
- `PATCH /notes/{id}/archive`: Archive a note
- `PATCH /notes/{id}/unarchive`: Unarchive a note
- `GET /notes/category/{categoryId}`: Get notes by category
- `POST /notes/{noteId}/categories/{categoryId}`: Add category to a note
- `DELETE /notes/{noteId}/categories/{categoryId}`: Remove category from a note

## Contribution

To contribute to the project:

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

## CI/CD Pipeline

This project includes a GitHub Actions workflow for continuous integration and deployment:

### Workflow Triggers
- On push to `main` branch (for deployment)
- On pull requests to `main` (for testing)

### Jobs
1. **Test**
   - Runs on: Ubuntu latest
   - Tests backend with Maven
   - Tests frontend with npm
   - Uses PostgreSQL for testing

2. **Deploy** (runs after successful test)
   - Builds and pushes Docker images to Docker Hub
   - Only runs on `main` branch

### Environment Variables
Required GitHub Secrets:
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token

## Local Development with Docker

1. Make sure Docker and Docker Compose are installed
2. Clone the repository
3. Run:
   ```bash
   docker-compose up --build
   ```
4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080

## License

Distributed under the MIT License. See `LICENSE` for more information.