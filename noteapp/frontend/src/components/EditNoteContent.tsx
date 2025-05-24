import { useState, useEffect } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import { useUpdateNote, useCategories } from "@/hooks/use-notes";
import { toast } from "@/components/ui/sonner";
import type { Note, Category } from "@/types";

interface EditNoteContentProps {
  note: Note;
  onBackClick: () => void;
}

const EditNoteContent = ({ note, onBackClick }: EditNoteContentProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(note.categories || []);
  const [isSaving, setIsSaving] = useState(false);
  const { mutate: updateNote } = useUpdateNote();
  const { data: allCategories = [] } = useCategories();

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Please add a title for your note");
      return;
    }
    
    setIsSaving(true);
    updateNote(
      {
        id: note.id,
        title: title.trim(),
        content: content.trim(),
        archived: note.archived,
        categories: selectedCategories,
        createdAt: note.createdAt
      },
      {
        onSuccess: () => {
          toast.success("Note updated successfully");
          onBackClick();
        },
        onError: (error) => {
          toast.error("Failed to update note");
          console.error("Error updating note:", error);
        },
        onSettled: () => {
          setIsSaving(false);
        }
      }
    );
  };

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className="flex-1 bg-gradient-to-br from-white to-noteapp-light overflow-auto noteapp-scrollbar">
        <div className="max-w-5xl mx-auto p-3 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Edit Note</h2>
            <button
              onClick={onBackClick}
              className="text-noteapp-primary hover:text-noteapp-primary/80 transition-colors"
            >
              Back
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-noteapp-border p-4 md:p-6">
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-medium mb-4 outline-none focus:border-b focus:border-noteapp-primary pb-2 transition-colors"
            />
            <textarea
              placeholder="Start typing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 outline-none resize-none mb-4"
            />
            
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <label key={category.id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.some(c => c.id === category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
                        }
                      }}
                      className="mr-1"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-noteapp-primary text-white rounded-lg hover:bg-noteapp-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default EditNoteContent;
