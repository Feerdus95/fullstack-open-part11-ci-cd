import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AppHeaderProps {
  activeView: 'notes' | 'categories' | 'new-note';
  onViewChange: (view: 'notes' | 'categories') => void;
  onAddNoteClick?: () => void;
}

const AppHeader = ({ activeView, onViewChange, onAddNoteClick }: AppHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-noteapp-border h-14 flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* Navigation */}
      <div className="flex items-center justify-center flex-1">
        {isMobile && <SidebarTrigger className="mr-2" />}
        <div className="hidden md:flex items-center space-x-20">
          <button 
            className={`${activeView === 'notes' ? 'text-noteapp-primary font-medium' : 'text-gray-400'} hover:text-noteapp-primary/80 transition-colors`}
            onClick={() => onViewChange('notes')}
          >
            Notes
          </button>
          <button 
            className={`${activeView === 'categories' ? 'text-noteapp-primary font-medium' : 'text-gray-400'} hover:text-noteapp-primary transition-colors`}
            onClick={() => onViewChange('categories')}
          >
            Categories
          </button>
          <button 
            className={`${activeView === 'new-note' ? 'text-noteapp-primary font-medium' : 'text-gray-400'} hover:text-noteapp-primary transition-colors flex items-center gap-1`}
            onClick={() => onAddNoteClick && onAddNoteClick()}
          >
            <Plus size={16} />
            <span>New Note</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;