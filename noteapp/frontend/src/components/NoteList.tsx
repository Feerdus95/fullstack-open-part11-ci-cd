
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Note, Category } from "@/types";
import { apiClient } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import AddNoteButton from "@/components/AddNoteButton";

interface NoteListProps {
  notes: Note[];
  view: "list" | "grid";
  categories: Category[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (note: Note) => void;
  onAddNoteClick?: () => void;
  onCategoryChange?: (categoryId: string) => void;
  selectedCategoryId?: string;
}

const NoteList = ({ notes, view, categories, onEditNote, onDeleteNote, onAddNoteClick, onCategoryChange, selectedCategoryId }: NoteListProps) => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Helper function to find categories by ids
  const getCategoriesByIds = (ids: string[]) => {
    return categories.filter(category => ids.includes(category.id));
  };

  // Helper function to get category IDs from a note
  const getCategoryIds = (note: Note) => {
    return note.categories.map(category => category.id);
  };

  // Format date for display
  const formatNoteDate = (date: string | undefined) => {
    if (!date) return 'No date';
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch (e) {
      console.error('Invalid date format:', date);
      return 'Invalid date';
    }
  };

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-400 mb-2">No notes found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={cn(
        "grid gap-4",
        view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : ""
      )}>
        {notes.map(note => {
          const noteCategories = getCategoriesByIds(getCategoryIds(note));

          return (
            <div key={note.id} className="flex flex-col flex-grow p-4 border border-noteapp-border rounded-lg bg-white shadow-sm hover:shadow transition-shadow">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium text-noteapp-text text-sm md:text-base">{note.title}</h3>
                <span className="text-xs text-gray-400">{formatNoteDate(note.createdAt)}</span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4 line-clamp-2">{note.content}</p>
              
              <div className="flex gap-1">
                {noteCategories.map((category) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-noteapp-primary/10 text-noteapp-primary"
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              <TooltipProvider>
                <div className="flex items-center justify-end gap-2 mt-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onEditNote(note)}
                        className="p-2 rounded-full hover:bg-noteapp-primary/10 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Note</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          // Archive/unarchive the note
                          const endpoint = note.archived ? `/notes/${note.id}/unarchive` : `/notes/${note.id}/archive`;
                          apiClient.patch(endpoint)
                            .then(() => {
                              // Refresh the notes list
                              queryClient.invalidateQueries({ queryKey: ['notes'] });
                              // Show success toast
                              toast({
                                title: note.archived ? "Note unarchived" : "Note archived",
                                description: note.archived ? "The note has been successfully unarchived." : "The note has been successfully archived.",
                                variant: "default",
                              });
                            })
                            .catch(error => {
                              console.error('Error archiving/unarchiving note:', error);
                              toast({
                                title: note.archived ? "Error unarchiving note" : "Error archiving note",
                                description: "There was an error updating the note's archive status. Please try again.",
                                variant: "destructive",
                              });
                            });
                        }}
                        className="p-2 rounded-full hover:bg-noteapp-primary/10 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{note.archived ? "Unarchive Note" : "Archive Note"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
                            apiClient.delete(`/notes/${note.id}`)
                              .then(() => {
                                // Refresh the notes list
                                queryClient.invalidateQueries({ queryKey: ['notes'] });
                                // Show success toast
                                toast({
                                  title: "Note deleted",
                                  description: "The note has been successfully deleted.",
                                  variant: "default",
                                });
                              })
                              .catch(error => {
                                console.error('Error deleting note:', error);
                                toast({
                                  title: "Error deleting note",
                                  description: "There was an error deleting the note. Please try again.",
                                  variant: "destructive",
                                });
                              });
                          }
                        }}
                        className="p-2 rounded-full hover:bg-red-500/10 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-7.5 7.5-7.5-7.5M4.5 10.5h15m-15 4.5h15m-1.5 4.5h15m-15 4.5h15M9 16.5V21m4.5-4.5V21M9 16.5v4.5m4.5-4.5v4.5" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Note</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NoteList;
