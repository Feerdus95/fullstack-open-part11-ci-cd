package main

import (
	"fmt"
)

func main() {
	// Use fmt.Println instead of console.log
	// To silence a specific lint warning, use a special comment
	//nolint:forbidigo // Intentional print for demonstration
	fmt.Println("Hello, World!")
}
