import { useState } from "react"
import { useCategories, useCreateCategory } from "@/hooks/use-notes"
import { ErrorBoundary } from "react-error-boundary"
import CategoriesHeader from "@/components/CategoriesHeader"
import CategoriesList from "@/components/CategoriesList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const CategoriesContent = () => {
	const [view, setView] = useState<"list" | "grid">("grid")
	const { data: categories = [], isLoading } = useCategories()
	const { mutate: createCategory } = useCreateCategory()

	if (isLoading) return <div>Loading...</div>

	return (
		<ErrorBoundary fallback={<div>Something went wrong</div>}>
			<div className="flex-1 bg-gradient-to-br from-white to-noteapp-light overflow-auto noteapp-scrollbar">
				<div className="max-w-5xl mx-auto p-3 md:p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold">All Categories</h2>
						<div className="flex items-center gap-4 h-9">
							<Button
								variant="outline"
								className="h-9 flex items-center justify-center"
								onClick={() => {
									const name = prompt("Enter category name:")
									if (name) {
										createCategory({ name })
									}
								}}
							>
								<Plus className="h-4 w-4 mr-2" />
								New Category
							</Button>
							<CategoriesHeader view={view} setView={setView} />
						</div>
					</div>
					<CategoriesList categories={categories} view={view} />
				</div>
			</div>
		</ErrorBoundary>
	)
}

export default CategoriesContent
