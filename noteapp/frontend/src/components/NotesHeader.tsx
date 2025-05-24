import { LayoutList, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

interface NotesHeaderProps {
  view: "list" | "grid";
  setView: (view: "list" | "grid") => void;
  categories: string[]; 
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
  onClearCategory: () => void;
}

const NotesHeader = ({ 
  view, 
  setView, 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  onClearCategory 
}: NotesHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <div className="flex items-center gap-2">
        
        <h2 className="text-lg md:text-xl font-semibold text-noteapp-text">All Notes</h2>
      </div>
      
      {/* View Options */}
      <div className="flex items-center gap-1 md:gap-2 bg-white rounded-lg border border-noteapp-border shadow-sm">
        <button
          className={cn(
            "p-1 md:p-1.5 rounded-l-lg transition-colors", 
            view === "list" ? "bg-noteapp-highlight text-noteapp-primary" : "text-gray-500 hover:text-noteapp-primary"
          )}
          onClick={() => setView("list")}
        >
          <LayoutList size={isMobile ? 18 : 20} />
        </button>
        <button
          className={cn(
            "p-1 md:p-1.5 transition-colors", 
            view === "grid" ? "bg-noteapp-highlight text-noteapp-primary" : "text-gray-500 hover:text-noteapp-primary"
          )}
          onClick={() => setView("grid")}
        >
          <LayoutGrid size={isMobile ? 18 : 20} />
        </button>
      </div>
    </div>
  );
};

export default NotesHeader;
