# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Store PIDs in a temporary file for later termination
PID_FILE="/tmp/noteapp_pids.txt"
touch "$PID_FILE"

# Cleanup function to terminate processes
cleanup() {
  echo -e "${YELLOW}Terminating NoteApp processes...${NC}"
  
  if [ -f "$PID_FILE" ]; then
    while read -r pid; do
      if ps -p "$pid" > /dev/null; then
        echo -e "${YELLOW}Terminating process with PID: $pid${NC}"
        kill "$pid" 2>/dev/null || kill -9 "$pid" 2>/dev/null
      fi
    done < "$PID_FILE"
    rm "$PID_FILE"
  fi
  
  # Find and kill any remaining Spring Boot or Vite processes
  echo -e "${YELLOW}Checking for any remaining processes...${NC}"
  
  # Different grep patterns for different operating systems
  if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows approach
    tasklist | grep -i "java.exe\|node.exe" | grep -v grep
    # Kill processes (simplified for Windows)
    pkill -f "spring-boot\|vite" 2>/dev/null
  else
    # Unix-like approach
    remaining_pids=$(pgrep -f "spring-boot\|vite")
    if [ -n "$remaining_pids" ]; then
      echo -e "${YELLOW}Found remaining processes: $remaining_pids${NC}"
      kill $remaining_pids 2>/dev/null || kill -9 $remaining_pids 2>/dev/null
    fi
  fi
  
  echo -e "${GREEN}All NoteApp processes terminated.${NC}"
}

# Handle script termination
trap cleanup EXIT INT

# Function to check if the script is being run for termination
check_termination() {
  if [ "$1" = "--stop" ] || [ "$1" = "-s" ]; then
    echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
    echo -e "${RED}🛑 Stopping NoteApp...${NC}"
    echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
    cleanup
    exit 0
  fi
}

# Check if script is called with --stop argument
check_termination "$1"

# Script header
echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 NoteApp Launcher${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"

# Check if PostgreSQL is installed and running
if command -v pg_isready >/dev/null 2>&1; then
  echo -e "${YELLOW}Checking if PostgreSQL is running...${NC}"
  if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL is running.${NC}"
  else
    echo -e "${RED}❌ PostgreSQL is not running or not available on port 5432.${NC}"
    echo -e "${YELLOW}Please ensure PostgreSQL is running before continuing.${NC}"
    read -p "Continue anyway? (y/n): " continue_anyway
    if [[ ! "$continue_anyway" =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi
else
  echo -e "${YELLOW}⚠️ PostgreSQL client utilities not found. Cannot verify database status.${NC}"
  echo -e "${YELLOW}Please ensure your database is correctly configured and running.${NC}"
  read -p "Continue anyway? (y/n): " continue_anyway
  if [[ ! "$continue_anyway" =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Database setup message
echo -e "${YELLOW}Using local PostgreSQL database${NC}"
echo -e "${YELLOW}Make sure your database is configured with:${NC}"
echo -e "${YELLOW}- Database name: noteapp${NC}"
echo -e "${YELLOW}- Username: noteuser${NC}"
echo -e "${YELLOW}- Password: notepass${NC}"
echo -e "${YELLOW}Or update application.properties with your database settings${NC}"

# Start backend and frontend in parallel
echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Starting application components...${NC}"

# Define function to start backend
start_backend() {
  echo -e "${YELLOW}Starting backend...${NC}"
  cd backend || { echo -e "${RED}❌ Backend directory not found${NC}"; return 1; }
  
  if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    ./mvnw.cmd spring-boot:run > backend.log 2>&1 &
  else
    # Linux/Mac
    ./mvnw spring-boot:run > backend.log 2>&1 &
  fi
  
  BACKEND_PID=$!
  echo $BACKEND_PID >> "$PID_FILE"
  echo -e "${GREEN}✅ Backend started with PID $BACKEND_PID${NC}"
  echo -e "${YELLOW}Backend logs at: ${PWD}/backend.log${NC}"
  
  # Return to project root
  cd ..
}

# Define function to start frontend
start_frontend() {
  echo -e "${YELLOW}Starting frontend...${NC}"
  cd frontend || { echo -e "${RED}❌ Frontend directory not found${NC}"; return 1; }
  
  # Check if node_modules exists, if not run npm install
  if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install || { echo -e "${RED}❌ Failed to install dependencies${NC}"; return 1; }
  fi
  
  npm run dev > frontend.log 2>&1 &
  FRONTEND_PID=$!
  echo $FRONTEND_PID >> "$PID_FILE"
  echo -e "${GREEN}✅ Frontend started with PID $FRONTEND_PID${NC}"
  echo -e "${YELLOW}Frontend logs at: ${PWD}/frontend.log${NC}"
  
  # Return to project root
  cd ..
}

# Use terminal multiplexer if available, or start both in background
if command -v tmux >/dev/null 2>&1; then
  echo -e "${GREEN}Using tmux to run both services...${NC}"
  
  # Start a new tmux session
  tmux new-session -d -s noteapp
  
  # Split window horizontally
  tmux split-window -h -t noteapp
  
  # Run backend in the left pane
  tmux send-keys -t noteapp:0.0 "cd $(pwd) && cd backend && ./mvnw spring-boot:run" C-m
  
  # Run frontend in the right pane
  tmux send-keys -t noteapp:0.1 "cd $(pwd) && cd frontend && npm run dev" C-m
  
  # Attach to the session
  echo -e "${GREEN}✅ Services started in tmux session. Attaching...${NC}"
  echo -e "${YELLOW}TIP: Press Ctrl+B then D to detach from tmux without stopping services${NC}"
  echo -e "${YELLOW}To stop services later, run: ./start.sh --stop${NC}"
  
  # Store tmux session info in PID file for later cleanup
  echo "tmux:noteapp" >> "$PID_FILE"
  
  tmux attach-session -t noteapp
else
  # Start both services in background
  echo -e "${YELLOW}Starting both services in background mode...${NC}"
  
  # Start backend
  start_backend
  
  # Give backend time to initialize before starting frontend
  echo -e "${YELLOW}Waiting for backend to initialize (10s)...${NC}"
  sleep 10
  
  # Start frontend
  start_frontend
  
  echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}✅ All services started!${NC}"
  echo -e "${YELLOW}Frontend should be available at: http://localhost:5173${NC}"
  echo -e "${YELLOW}Backend API available at: http://localhost:8080${NC}"
  echo -e ""
  echo -e "${YELLOW}To view logs:${NC}"
  echo -e "  Backend: tail -f backend/backend.log"
  echo -e "  Frontend: tail -f frontend/frontend.log"
  echo -e ""
  echo -e "${RED}To stop all services:${NC}"
  echo -e "  Run: ./start.sh --stop"
  echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
  
  # Optionally open browser
  if command -v xdg-open >/dev/null 2>&1; then  # Linux
    read -p "Open application in browser? (y/n): " open_browser
    if [[ "$open_browser" =~ ^[Yy]$ ]]; then
      xdg-open http://localhost:5173
    fi
  elif command -v open >/dev/null 2>&1; then  # macOS
    read -p "Open application in browser? (y/n): " open_browser
    if [[ "$open_browser" =~ ^[Yy]$ ]]; then
      open http://localhost:5173
    fi
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then  # Windows
    read -p "Open application in browser? (y/n): " open_browser
    if [[ "$open_browser" =~ ^[Yy]$ ]]; then
      start http://localhost:5173
    fi
  fi
fi

# Disarm the trap before exit to avoid double cleanup
trap - EXIT INT