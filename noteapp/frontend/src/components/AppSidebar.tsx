
import { FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import AddNoteButton from "@/components/AddNoteButton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { useCreateCategory, useCreateNote } from "@/hooks/use-notes";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface AppSidebarProps {
  categories: Category[];
  activeTab: "active" | "archived" | "all";
  setActiveTab: (tab: "active" | "archived" | "all") => void;
  onAddNoteClick?: () => void;
  onCategorySelect?: (categoryId: string) => void;
}

const AppSidebar = ({ 
  categories,
  activeTab, 
  setActiveTab,
  onAddNoteClick,
  onCategorySelect
}: AppSidebarProps) => {
  const isMobile = useIsMobile();
  const { mutate: createNote } = useCreateNote();
  const { mutate: createCategory } = useCreateCategory();

  const handleAddNote = () => {
    createNote({
      title: "New Note",
      content: "",
      categories: [],
      createdAt: new Date().toISOString()
    }, {
      onError: (error) => {
        console.error('Failed to create note:', error);
        // Could add a toast notification here
      }
    });
  };



  return (
    <Sidebar variant={isMobile ? "floating" : "sidebar"}>
      <SidebarHeader className="p-0">
        {/* App Title */}
        <div className="p-4 flex items-center">
          <div className="w-6 h-6 bg-gradient-to-br from-noteapp-primary/20 to-purple-100/60 flex items-center justify-center rounded">
            <FileText size={16} className="text-noteapp-primary" />
          </div>
          <h1 className="text-xl font-semibold ml-2 bg-gradient-to-r from-noteapp-primary to-purple-600 text-transparent bg-clip-text">NoteApp</h1>
        </div>
        
        {/* New Note Button */}
        <div className="px-4 my-4">
          <AddNoteButton 
            onAddNoteClick={onAddNoteClick} 
            className="bg-gradient-to-r from-noteapp-primary to-pink-500 hover:from-noteapp-primary hover:to-pink-600 transition-all duration-300 btn-glow"
          />
        </div>

        {/* Active/Archived/All Tabs */}
        <div className="flex px-4 mb-4">
          <button
            className={cn(
              "flex-1 text-sm py-2 rounded-l-md border border-noteapp-border transition-colors",
              activeTab === "archived" ? "bg-gradient-to-r from-white to-noteapp-highlight/30 text-noteapp-text font-medium" : "bg-gray-50 text-noteapp-muted"
            )}
            onClick={() => setActiveTab("archived")}
          >
            Archived
          </button>
          <button
            className={cn(
              "flex-1 text-sm py-2 border border-noteapp-border transition-colors",
              activeTab === "active" ? "bg-gradient-to-r from-white to-noteapp-highlight/30 text-noteapp-text font-medium" : "bg-gray-50 text-noteapp-muted"
            )}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button
            className={cn(
              "flex-1 text-sm py-2 rounded-r-md border border-noteapp-border transition-colors",
              activeTab === "all" ? "bg-gradient-to-r from-white to-noteapp-highlight/30 text-noteapp-text font-medium" : "bg-gray-50 text-noteapp-muted"
            )}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton onClick={() => {
                      console.log("Category ID clicked:", category.id);
                      onCategorySelect?.(category.id)}}>
                    {category.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-center py-4 text-sm text-noteapp-muted">
          © {new Date().getFullYear()} NoteApp. All rights reserved.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
