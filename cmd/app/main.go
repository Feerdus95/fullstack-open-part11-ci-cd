package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// CSPHeader is the Content Security Policy header
const CSPHeader = "default-src 'self'; " +
	"script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
	"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
	"img-src 'self' data: https://raw.githubusercontent.com; " +
	"font-src 'self' https://fonts.gstatic.com; " +
	"connect-src 'self' https://pokeapi.co;"

// securityHeaders adds security-related headers to all responses
func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Add security headers
		headers := map[string]string{
			"Content-Security-Policy":    CSPHeader,
			"X-Content-Type-Options":     "nosniff",
			"X-Frame-Options":            "DENY",
			"X-XSS-Protection":           "1; mode=block",
			"Referrer-Policy":            "strict-origin-when-cross-origin",
			"Permissions-Policy":         "geolocation=(), microphone=(), camera=()",
			"Cross-Origin-Opener-Policy": "same-origin",
		}

		for key, value := range headers {
			w.Header().Set(key, value)
		}

		// Continue to the next handler
		next.ServeHTTP(w, r)
	})
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "ok"}`))
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s", r.RemoteAddr, r.Method, r.URL)
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Get port from environment variable or default to 5000
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	// Create a new ServeMux
	mux := http.NewServeMux()

	// Log current working directory for debugging
	if wd, err := os.Getwd(); err == nil {
		log.Printf("Current working directory: %s", wd)
	}

	// List files in potential directories for debugging
	checkDir := func(path string) bool {
		if _, err := os.Stat(path); err != nil {
			log.Printf("Directory not found: %s", path)
			return false
		}

		log.Printf("Contents of %s:", path)
		if entries, err := os.ReadDir(path); err == nil {
			for _, entry := range entries {
				info, _ := entry.Info()
				log.Printf("  %s (%d bytes)", entry.Name(), info.Size())
			}
		} else {
			log.Printf("Error reading directory: %v", err)
		}
		return true
	}

	// Check both possible locations
	devPath := "../fullstack-open-part11-pokedex/dist"
	prodPath := "./pokedex-dist"

	log.Printf("Checking for Pokedex app in: %s", devPath)
	devExists := checkDir(devPath)

	log.Printf("Checking for Pokedex app in: %s", prodPath)
	prodExists := checkDir(prodPath)

	// Log which directory we're using
	switch {
	case devExists:
		log.Printf("Serving Pokedex app from development directory: %s", devPath)
	case prodExists:
		log.Printf("Serving Pokedex app from production directory: %s", prodPath)
	default:
		log.Fatal("Could not find Pokedex app. Please build the Pokedex app first.")
	}

	// Handle all routes by serving index.html for SPA routing
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// If the request is for a file that exists, serve it
		path := r.URL.Path
		if path == "/" {
			path = "/index.html"
		}

		// Try to open the file
		filePath := ""
		if devExists {
			filePath = filepath.Join(devPath, path)
		} else {
			filePath = filepath.Join(prodPath, path)
		}

		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			// If file doesn't exist, serve index.html for SPA routing
			if devExists {
				http.ServeFile(w, r, filepath.Join(devPath, "index.html"))
			} else {
				http.ServeFile(w, r, filepath.Join(prodPath, "index.html"))
			}
			return
		}

		// Otherwise serve the file
		if devExists {
			http.FileServer(http.Dir(devPath)).ServeHTTP(w, r)
		} else {
			http.FileServer(http.Dir(prodPath)).ServeHTTP(w, r)
		}
	})

	// Health check endpoint
	mux.HandleFunc("/health", healthHandler)

	// Create the server with all middleware
	server := &http.Server{
		Addr:    ":" + port,
		Handler: loggingMiddleware(securityHeaders(mux)),
	}

	log.Printf("Server starting on port %s...", port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server failed to start: %v", err)
	}
}
