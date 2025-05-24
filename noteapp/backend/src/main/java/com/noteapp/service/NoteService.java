package com.noteapp.service;

import com.noteapp.dto.NoteRequest;
import com.noteapp.exception.CategoryNotFoundException;
import com.noteapp.exception.NoteNotFoundException;
import com.noteapp.model.Category;
import com.noteapp.model.Note;
import com.noteapp.repository.CategoryRepository;
import com.noteapp.repository.NoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository;

    public NoteService(NoteRepository noteRepository, CategoryRepository categoryRepository) {
        this.noteRepository = noteRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Note> getAllNotes() {
        System.out.println("[DEBUG] Fetching all notes from repository");
        List<Note> notes = noteRepository.findAll();
        System.out.println("[DEBUG] Repository returned " + notes.size() + " notes");
        return notes;
    }

    public List<Note> getAllActiveNotes() {
        return noteRepository.findByArchived(false);
    }

    public List<Note> getAllArchivedNotes() {
        return noteRepository.findByArchived(true);
    }

    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    @Transactional
    public Note createNote(Note note) {
        // Basic save functionality, without category handling
        return noteRepository.save(note);
    }

    @Transactional
    public Note createNoteFromRequest(NoteRequest request) {
        System.out.println("[DEBUG] Creating note from request: " + request.getTitle());
        System.out.println("[DEBUG] Category IDs from request: " + request.getCategoryIds());
        
        // Create and save the note first to get an ID
        Note note = new Note();
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setArchived(request.isArchived());
        
        // Save the note first
        Note savedNote = noteRepository.save(note);
        System.out.println("[DEBUG] Saved note with ID: " + savedNote.getId());
        
        // Now add categories if provided
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            System.out.println("[DEBUG] Adding " + request.getCategoryIds().size() + " categories to note");
            
            for (Long categoryId : request.getCategoryIds()) {
                System.out.println("[DEBUG] Finding category with ID: " + categoryId);
                
                Category category = categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + categoryId));
                
                System.out.println("[DEBUG] Found category: " + category.getName());
                
                // Use the utility method that handles both sides of the relationship
                savedNote.addCategory(category);
                System.out.println("[DEBUG] Added category to note");
            }
            
            // Save again to update relationships
            savedNote = noteRepository.save(savedNote);
            System.out.println("[DEBUG] Saved note with categories. Category count: " + savedNote.getCategories().size());
        } else {
            System.out.println("[DEBUG] No categories to add");
        }
        
        return savedNote;
    }

    @Transactional
    public Note updateNote(Long id, Note updatedNote) {
        return noteRepository.findById(id).map(note -> {
            note.setTitle(updatedNote.getTitle());
            note.setContent(updatedNote.getContent());
            note.setArchived(updatedNote.isArchived());

            // Clear existing categories and add the updated ones
            note.getCategories().clear();
            if (updatedNote.getCategories() != null) {
                for (Category category : updatedNote.getCategories()) {
                    Category managedCategory = categoryRepository.findById(category.getId())
                            .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
                    note.addCategory(managedCategory);
                }
            }
            return noteRepository.save(note);
        }).orElseThrow(() -> new NoteNotFoundException("Note not found"));
    }

    @Transactional
    public void deleteNote(Long id) {
        if (noteRepository.existsById(id)) {
            noteRepository.deleteById(id);
        } else {
            throw new NoteNotFoundException("Note with id " + id + " not found");
        }
    }

    @Transactional
    public void archiveNote(Long id) {
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new NoteNotFoundException("Note with id " + id + " not found"));
        note.setArchived(true);
        noteRepository.save(note);
    }

    @Transactional
    public void unarchiveNote(Long id) {
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new NoteNotFoundException("Note with id " + id + " not found"));
        note.setArchived(false);
        noteRepository.save(note);
    }

    // Methods for categories
    @Transactional
    public Note addCategoryToNote(Long noteId, Long categoryId) {
        System.out.println("[DEBUG] Adding category " + categoryId + " to note " + noteId);
        
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new NoteNotFoundException("Note not found"));
        
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        
        note.addCategory(category);
        return noteRepository.save(note);
    }

    @Transactional
    public List<Note> getNotesByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new CategoryNotFoundException("Category not found");
        }
        return noteRepository.findByCategoryId(categoryId);
    }

    @Transactional
    public Note removeCategoryFromNote(Long noteId, Long categoryId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new NoteNotFoundException("Note not found"));
        
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        
        note.removeCategory(category);
        return noteRepository.save(note);
    }

    public List<Note> getNotesByCategoryAndArchived(Long categoryId, boolean archived) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new CategoryNotFoundException("Category not found");
        }
        return noteRepository.findByCategoryIdAndArchived(categoryId, archived);
    }
}