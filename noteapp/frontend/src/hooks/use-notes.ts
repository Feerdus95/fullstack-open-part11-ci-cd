import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Note } from '../types';

export function useNotes(activeTab: "active" | "archived" | "all" = "active", selectedCategoryId?: string) {
  return useQuery({
    queryKey: ['notes', activeTab, selectedCategoryId],
    queryFn: async () => {
      let url = '';

      if (selectedCategoryId && selectedCategoryId !== '') {
        // Convert string ID to number for backend
        const categoryId = parseInt(selectedCategoryId);
        url = `/notes/category/${categoryId}`;
      } else if (activeTab === "active") {
        url = '/notes/active';
      } else if (activeTab === "archived") {
        url = '/notes/archived';
      } else {
        url = '/notes';
      }

      console.log("Fetching URL:", url);

      try {
        const { data } = await apiClient.get<Note[]>(url);
        return data;
      } catch (error) {
        console.error("Error fetching notes:", error);
        throw error;
      }
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/categories');
      return data;
    },
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: Partial<Note>) => {
      const { data } = await apiClient.post('/notes', {
        title: note.title || "New Note",
        content: note.content || "",
        archived: false,
        categoryIds: note.categories?.map(category => parseInt(category.id)) || []
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Error creating note:', error);
    }
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: Note) => {
      const { data } = await apiClient.put(`/notes/${note.id}`, {
        title: note.title,
        content: note.content,
        archived: note.archived,
        categoryIds: note.categories?.map(category => parseInt(category.id)) || []
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Error updating note:', error);
    }
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      await apiClient.delete(`/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
    }
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: { name: string }) => {
      const { data } = await apiClient.post('/categories', { name: category.name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error creating category:', error);
    }
  });
}