import { useIsMobile } from "@/hooks/use-mobile";
import NoteList from "@/components/NoteList";
import NotesHeader from "@/components/NotesHeader";
import AddNoteButton from "@/components/AddNoteButton";
import { useCreateNote, useDeleteNote, useUpdateNote } from "@/hooks/use-notes";
import EditNoteContent from "@/components/EditNoteContent";
import { useState } from "react";
import type { Note, Category } from "@/types";

interface NotesContentProps {
  notes: Note[];
  view: "list" | "grid";
  setView: (view: "list" | "grid") => void;
  categories: Category[];
  onAddNoteClick?: () => void;
  selectedCategoryId?: string;
  onCategoryChange?: (categoryId: string) => void;
}

const NotesContent = ({ 
  notes, 
  view, 
  setView, 
  categories, 
  onAddNoteClick,
  selectedCategoryId,
  onCategoryChange
}: NotesContentProps) => {
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const isMobile = useIsMobile();
  const { mutate: createNote } = useCreateNote();
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: updateNote } = useUpdateNote();

  const handleDeleteNote = (note: Note) => {
    deleteNote(note.id);
  };

  const handleAddNote = () => {
    createNote({
      title: "New Note",
      content: "",
      categories: selectedCategoryId ? [categories.find(cat => cat.id === selectedCategoryId)].filter(Boolean) as Category[] : []
    });
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-white to-noteapp-light overflow-auto noteapp-scrollbar">
      <div className="max-w-5xl mx-auto p-3 md:p-6 h-full flex flex-col">
        <NotesHeader 
          view={view} 
          setView={setView}
          categories={categories.map(cat => cat.id)}
          selectedCategory={selectedCategoryId}
          onCategorySelect={(categoryId) => onCategoryChange?.(categoryId)}
          onClearCategory={() => onCategoryChange?.('')}
        />
        
        <div className="flex-1 pb-4 md:pb-6 overflow-y-auto noteapp-scrollbar">
          <div className="flex gap-4 mb-4">
            <select
              className="px-3 py-2 border rounded-md bg-white text-noteapp-text"
              value={selectedCategoryId || ''}
              onChange={(e) => onCategoryChange?.(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {editingNote ? (
            <EditNoteContent
              note={editingNote}
              onBackClick={() => setEditingNote(null)}
            />
          ) : (
            <NoteList 
              notes={notes} 
              view={view} 
              categories={categories}
              onEditNote={(note) => setEditingNote(note)}
              onDeleteNote={handleDeleteNote}
              onAddNoteClick={onAddNoteClick}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={onCategoryChange}
            />
          )}
        </div>
        
        {/* Mobile Add Button (Fixed at bottom) */}
        {isMobile && (
          <div className="fixed bottom-6 right-6 z-10">
            <AddNoteButton 
              onAddNoteClick={onAddNoteClick || handleAddNote}
              className="bg-gradient-to-r from-noteapp-primary to-pink-500 hover:from-noteapp-primary hover:to-pink-600 transition-all duration-300 rounded-full shadow-lg btn-glow"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesContent;