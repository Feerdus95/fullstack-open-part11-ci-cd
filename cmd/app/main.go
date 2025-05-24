package main

import (
	"log"
	"net/http"
	"os"
)

// CSPHeader is the Content Security Policy header
const CSPHeader = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self';"

// securityHeaders adds security-related headers to all responses
func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Add security headers
		headers := map[string]string{
			"Content-Security-Policy":   CSPHeader,
			"X-Content-Type-Options":  "nosniff",
			"X-Frame-Options":          "DENY",
			"X-XSS-Protection":         "1; mode=block",
			"Referrer-Policy":          "strict-origin-when-cross-origin",
			"Permissions-Policy":       "geolocation=(), microphone=(), camera=()",
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

	// Serve static files from the static directory
	fs := http.FileServer(http.Dir("./static"))
	mux.Handle("/", fs)

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
