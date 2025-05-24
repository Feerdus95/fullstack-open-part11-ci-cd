import React, { useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useNotes, useCategories } from "@/hooks/use-notes";
import AppHeader from "@/components/AppHeader";
import AppSidebar from "@/components/AppSidebar";
import NotesContent from "@/components/NotesContent";
import CategoriesContent from "@/components/CategoriesContent";
import NewNoteContent from "@/components/NewNoteContent";
import { ErrorBoundary } from 'react-error-boundary';

const NoteApp = () => {
  const [view, setView] = useState<"list" | "grid">("list");
  const [activeTab, setActiveTab] = useState<"active" | "archived" | "all">("active");
  const [activeView, setActiveView] = useState<"notes" | "categories" | "new-note">("notes");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const { data: notes = [], isLoading: notesLoading } = useNotes(activeTab, selectedCategoryId);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const handleAddNote = () => {
    setActiveView("new-note");
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setActiveTab("all");
  };

  console.log("NoteApp rendered");

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <SidebarProvider>
        <div className="h-screen w-full flex bg-gradient-to-br from-noteapp-light to-white">
          <AppSidebar
            categories={categories}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddNoteClick={handleAddNote}
            onCategorySelect={handleCategorySelect}
          />

          <SidebarInset className="flex-1 flex flex-col">
            <AppHeader
              activeView={activeView}
              onViewChange={setActiveView}
              onAddNoteClick={handleAddNote}
            />
            {activeView === "new-note" ? (
              <NewNoteContent onBackClick={() => setActiveView("notes")} />
            ) : activeView === "categories" ? (
              <CategoriesContent />
            ) : (
              <NotesContent
                notes={notes}
                view={view}
                setView={setView}
                categories={categories}
                onAddNoteClick={handleAddNote}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={handleCategorySelect}
              />
            )}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default NoteApp;