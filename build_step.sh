#!/bin/bash

echo "Starting build process..."

# Build the React app
echo "Building React app..."
cd fullstack-open-part11-pokedex
npm install
npm run build
cd ..

# Build the Go binary
echo "Building Go binary..."
cd cmd/app
go build -o ../../app
cd ../..

echo "Build completed successfully!"
