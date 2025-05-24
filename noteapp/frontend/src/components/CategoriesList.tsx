import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoriesListProps {
  categories: Category[];
  view: "list" | "grid";
}

const CategoriesList = ({ categories, view }: CategoriesListProps) => {
  const isMobile = useIsMobile();

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-400 mb-2">No categories found</p>
        <p className="text-sm text-gray-400">Create a new category to get started</p>
      </div>
    );
  }

  return (
    <div className={cn(
      view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-h-[calc(100vh-12rem)] overflow-y-auto pb-4" : "space-y-3 md:space-y-4"
    )}>
      {categories.map((category) => (
        <div
          key={category.id}
          className={cn(
            "bg-white border border-noteapp-border rounded-lg p-3 md:p-4 flex flex-col",
            view === "list" ? "hover:shadow-sm" : "hover:shadow-md",
            "transition-shadow duration-200"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0" 
              style={{ backgroundColor: category.color }} 
            />
            <h3 className="font-medium text-noteapp-text text-sm md:text-base">
              {category.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesList;