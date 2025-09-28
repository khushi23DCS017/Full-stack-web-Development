#!/bin/bash

# Taskify MERN App Setup Script
# This script will set up the entire development environment

echo "🚀 Setting up Taskify MERN Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    print_error "Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_status "npm $(npm -v) detected"

# Install root dependencies
print_info "Installing root dependencies..."
npm install

# Setup Backend
print_info "Setting up backend..."
cd backend

# Install backend dependencies
print_info "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating backend .env file..."
    cat > .env << EOL
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskify
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
EOL
    print_warning "Please update the .env file with your actual MongoDB URI and JWT secret"
else
    print_status "Backend .env file already exists"
fi

cd ..

# Setup Frontend
print_info "Setting up frontend..."
cd frontend

# Install frontend dependencies
print_info "Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating frontend .env file..."
    cat > .env << EOL
REACT_APP_API_URL=http://localhost:5000
EOL
    print_status "Frontend .env file created"
else
    print_status "Frontend .env file already exists"
fi

cd ..

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p frontend/public/images

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        print_status "MongoDB is running"
    else
        print_warning "MongoDB is not running. Please start MongoDB before running the application."
        print_info "To start MongoDB: mongod"
    fi
else
    print_warning "MongoDB is not installed. Please install MongoDB or use MongoDB Atlas."
fi

# Create start scripts
print_info "Creating start scripts..."

# Create start-dev.sh
cat > start-dev.sh << 'EOL'
#!/bin/bash
echo "🚀 Starting Taskify in development mode..."
echo "Backend will run on http://localhost:5000"
echo "Frontend will run on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
cd ../frontend && npm start &
FRONTEND_PID=$!

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
EOL

chmod +x start-dev.sh

# Create start-prod.sh
cat > start-prod.sh << 'EOL'
#!/bin/bash
echo "🚀 Starting Taskify in production mode..."

# Build frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

# Start backend
echo "Starting backend server..."
cd backend
npm start
EOL

chmod +x start-prod.sh

print_status "Start scripts created:"
print_info "  - start-dev.sh (development mode)"
print_info "  - start-prod.sh (production mode)"

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    print_info "Creating .gitignore file..."
    # .gitignore content is already created above
    print_status ".gitignore file created"
fi

# Display setup completion
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure MongoDB is running (or use MongoDB Atlas)"
echo "2. Update the .env files with your actual configuration"
echo "3. Run the application:"
echo "   - Development: ./start-dev.sh"
echo "   - Production:  ./start-prod.sh"
echo ""
echo "🔗 URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:5000"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview and features"
echo "   - DEPLOYMENT.md - Deployment guide"
echo ""
echo "Happy coding! 🚀"
