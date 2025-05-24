import { useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import NewNoteHeader from "@/components/NewNoteHeader"
import { useCreateNote, useUpdateNote, useCategories } from "@/hooks/use-notes"
import { toast } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Archive, Plus, ChevronDown } from "lucide-react"
import type { Category, Note } from "@/types"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NewNoteContentProps {
    onBackClick: () => void
    note?: Note
}

const NewNoteContent = ({ onBackClick, note }: NewNoteContentProps) => {
    const [title, setTitle] = useState(note?.title || "")
    const [content, setContent] = useState(note?.content || "")
    const [isSaving, setIsSaving] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(note?.categories || [])

    const { mutate: createNote } = useCreateNote()
    const { mutate: updateNote } = useUpdateNote()
    const { data: categories = [] } = useCategories()

    const handleSave = () => {
        if (isSaving) return;

        if (!title.trim()) {
            toast.error("Please add a title for your note")
            return
        }

        setIsSaving(true)

        const payload = {
            title: title.trim(),
            content: content.trim(),
            archived: false,
            categories: selectedCategories,
            createdAt: note?.createdAt || new Date().toISOString(),
            id: note?.id,
        }

        console.log("Saving note with payload:", payload)
        const mutation = note?.id ? updateNote : createNote

        mutation(payload, {
            onSuccess: () => {
                toast.success(`Note ${note?.id ? "updated" : "saved"} successfully!`)
                setIsSaving(false)
                onBackClick()
            },
            onError: (error) => {
                console.error(`Failed to ${note?.id ? "update" : "save"} note:`, error)
                toast.error("Something went wrong. Please try again.")
                setIsSaving(false)
            },
        })
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <div className="flex-1 bg-gradient-to-br from-white to-noteapp-light overflow-auto noteapp-scrollbar">
                <div className="max-w-5xl mx-auto p-3 md:p-6">
                    <NewNoteHeader onBackClick={onBackClick} />

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
                            className="w-full h-64 outline-none resize-none"
                        />
                    </div>

                    <div className="mt-4">
                        {selectedCategories.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium mb-2">Selected Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCategories.map((category) => (
                                        <div 
                                            key={category.id} 
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-noteapp-primary/10 text-noteapp-primary"
                                        >
                                            {category.name}
                                            <button 
                                                onClick={() => setSelectedCategories(prev => prev.filter(c => c.id !== category.id))}
                                                className="ml-1 text-noteapp-primary hover:text-noteapp-primary/80"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex flex-wrap justify-end gap-2">
                            <Button
                                variant="outline"
                                className={`bg-noteapp-primary hover:bg-noteapp-primary/90 flex items-center gap-2 !text-white ${!title.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleSave}
                                disabled={isSaving || !title.trim()}
                            >
                                Save Note
                            </Button>

                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Category
                                    <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {categories.map((category) => {
                                    const isSelected = selectedCategories.some((sel) => sel.id === category.id)
                                    if (isSelected) return null
                                    return (
                                        <DropdownMenuItem
                                            key={category.id}
                                            onClick={() => {
                                                setSelectedCategories((prev) => [...prev, category])
                                                toast.success(`Added category: ${category.name}`)
                                            }}
                                        >
                                            {category.name}
                                        </DropdownMenuItem>
                                    )
                                })}
                                {categories.every((cat) =>
                                    selectedCategories.some((sel) => sel.id === cat.id)
                                ) && <DropdownMenuItem disabled>No more categories available</DropdownMenuItem>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
        </ErrorBoundary>
    )
}

export default NewNoteContent