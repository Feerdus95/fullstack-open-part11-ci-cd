import { LayoutList, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface CategoriesHeaderProps {
	view: "list" | "grid"
	setView: (view: "list" | "grid") => void
}

const CategoriesHeader = ({ view, setView }: CategoriesHeaderProps) => {
	const isMobile = useIsMobile()

	return (
		<div className="flex items-center bg-white rounded-lg border border-noteapp-border shadow-sm h-9">
			<button
				className={cn(
					"p-1 md:p-1.5 h-full flex items-center justify-center rounded-l-lg transition-colors",
					view === "list"
						? "bg-noteapp-highlight text-noteapp-primary"
						: "text-gray-500 hover:text-noteapp-primary"
				)}
				onClick={() => setView("list")}
			>
				<LayoutList size={isMobile ? 18 : 20} />
			</button>
			<button
				className={cn(
					"p-1 md:p-1.5 h-full flex items-center justify-center rounded-r-lg transition-colors",
					view === "grid"
						? "bg-noteapp-highlight text-noteapp-primary"
						: "text-gray-500 hover:text-noteapp-primary"
				)}
				onClick={() => setView("grid")}
			>
				<LayoutGrid size={isMobile ? 18 : 20} />
			</button>
		</div>
	)
}

export default CategoriesHeader
