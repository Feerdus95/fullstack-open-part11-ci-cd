package com.noteapp.controller;

import com.noteapp.dto.NoteRequest;
import com.noteapp.exception.CategoryNotFoundException;
import com.noteapp.exception.NoteNotFoundException;
import com.noteapp.model.Category;
import com.noteapp.model.Note;
import com.noteapp.service.CategoryService;
import com.noteapp.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/notes")
public class NoteController {

    private final NoteService noteService;
    private final CategoryService categoryService;

    public NoteController(NoteService noteService, CategoryService categoryService) {
        this.noteService = noteService;
        this.categoryService = categoryService;
    }

    // Endpoint to get ALL notes
    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes() {
        System.out.println("[DEBUG] Getting all notes");
        try {
            List<Note> notes = noteService.getAllNotes();
            System.out.println("[DEBUG] Found " + notes.size() + " notes");
            return ResponseEntity.ok(notes);
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to get notes: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // Endpoint to get all active notes
    @GetMapping("/active")
    public ResponseEntity<List<Note>> getAllActiveNotes() {
        List<Note> activeNotes = noteService.getAllActiveNotes();
        return ResponseEntity.ok(activeNotes);
    }

    // Endpoint to get all archived notes
    @GetMapping("/archived")
    public ResponseEntity<List<Note>> getAllArchivedNotes() {
        List<Note> archivedNotes = noteService.getAllArchivedNotes();
        return ResponseEntity.ok(archivedNotes);
    }

    // Endpoint to get a note by ID
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        Optional<Note> note = noteService.getNoteById(id);
        return note.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Endpoint to create a new note
    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody NoteRequest noteRequest) {
        Note createdNote = noteService.createNoteFromRequest(noteRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
    }

    // Endpoint to update an existing note
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody NoteRequest noteRequest) {
        try {
            Note updatedNote = new Note();
            updatedNote.setId(id);
            updatedNote.setTitle(noteRequest.getTitle());
            updatedNote.setContent(noteRequest.getContent());
            updatedNote.setArchived(noteRequest.isArchived());

            Set<Category> categories = new HashSet<>();
            if (noteRequest.getCategoryIds() != null) {
                for (Long categoryId : noteRequest.getCategoryIds()) {
                    Category category = categoryService.getCategoryById(categoryId)
                            .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + categoryId));
                    categories.add(category);
                }
            }
            updatedNote.setCategories(categories);
            Note note = noteService.updateNote(id, updatedNote);
            return ResponseEntity.ok(note);
        } catch (NoteNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Endpoint to delete a note
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        try {
            noteService.deleteNote(id);
            return ResponseEntity.noContent().build();
        } catch (NoteNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Endpoint to archive a note
    @PatchMapping("/{id}/archive")
    public ResponseEntity<Void> archiveNote(@PathVariable Long id) {
        noteService.archiveNote(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint to unarchive a note
    @PatchMapping("/{id}/unarchive")
    public ResponseEntity<Void> unarchiveNote(@PathVariable Long id) {
        noteService.unarchiveNote(id);
        return ResponseEntity.noContent().build();
    }

    // Global exception handler for NoteNotFoundException
    @ExceptionHandler(NoteNotFoundException.class)
    public ResponseEntity<String> handleNoteNotFoundException(NoteNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // Endpoints for categories
    @PostMapping("/{noteId}/categories/{categoryId}")
    public ResponseEntity<Note> addCategoryToNote(@PathVariable Long noteId, @PathVariable Long categoryId) {
        try {
            Note note = noteService.addCategoryToNote(noteId, categoryId);
            return ResponseEntity.ok(note);
        } catch (NoteNotFoundException | CategoryNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{noteId}/categories/{categoryId}")
    public ResponseEntity<Note> removeCategoryFromNote(@PathVariable Long noteId, @PathVariable Long categoryId) {
        try {
            Note note = noteService.removeCategoryFromNote(noteId, categoryId);
            return ResponseEntity.ok(note);
        } catch (NoteNotFoundException | CategoryNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Note>> getNotesByCategory(@PathVariable Long categoryId) {
        try {
            List<Note> notes = noteService.getNotesByCategory(categoryId);
            return ResponseEntity.ok(notes);
        } catch (CategoryNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/category/{categoryId}/active")
    public ResponseEntity<List<Note>> getActiveNotesByCategory(@PathVariable Long categoryId) {
        try {
            List<Note> notes = noteService.getNotesByCategoryAndArchived(categoryId, false);
            return ResponseEntity.ok(notes);
        } catch (CategoryNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/category/{categoryId}/archived")
    public ResponseEntity<List<Note>> getArchivedNotesByCategory(@PathVariable Long categoryId) {
        try {
            List<Note> notes = noteService.getNotesByCategoryAndArchived(categoryId, true);
            return ResponseEntity.ok(notes);
        } catch (CategoryNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Exception handler for CategoryNotFoundException
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<String> handleCategoryNotFoundException(CategoryNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}