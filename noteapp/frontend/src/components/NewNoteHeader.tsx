import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NewNoteHeaderProps {
  onBackClick: () => void;
}

const NewNoteHeader = ({ onBackClick }: NewNoteHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <div className="flex items-center gap-2">
        <button 
          onClick={onBackClick}
          className="p-1 rounded-full hover:bg-noteapp-highlight text-noteapp-primary transition-colors"
        >
          <ArrowLeft size={isMobile ? 18 : 20} />
        </button>
        <h2 className="text-lg md:text-xl font-semibold text-noteapp-text">New Note</h2>
      </div>
    </div>
  );
};

export default NewNoteHeader;