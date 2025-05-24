
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddNoteButtonProps {
  onAddNoteClick: () => void;
  className?: string;
}

const AddNoteButton = ({ onAddNoteClick, className }: AddNoteButtonProps) => {
  return (
    <Button 
      className={`bg-noteapp-primary hover:bg-noteapp-primary/90 flex items-center gap-2 ${className}`} 
      onClick={onAddNoteClick}
    >
      <Plus size={18} />
      <span>New Note</span>
    </Button>
  );
};

export default AddNoteButton;
