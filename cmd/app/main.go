package main

import (
	"log"
	"net/http"
	"os"
)

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "ok"}`))
}

func main() {
	// Get port from environment variable or default to 5000
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	// Serve static files from the React app
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	// Health check endpoint
	http.HandleFunc("/health", healthHandler)

	log.Printf("Server starting on port %s...", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
