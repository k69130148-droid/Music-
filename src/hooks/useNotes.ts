import { useState, useEffect, useCallback, useTransition } from 'react';
import { Note, ChecklistItem, ArabicFont, CategoryFilter } from '../types/note';
import { getSavedNotes, saveNotesToStorage } from '../utils/storage';

export type AutoSaveStatus = 'saved' | 'saving' | 'offline';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => getSavedNotes());
  const [activeNoteId, setActiveNoteId] = useState<string | null>(() => {
    const initial = getSavedNotes();
    return initial.length > 0 ? initial[0].id : null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('saved');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [, startTransition] = useTransition();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setAutoSaveStatus('saved');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setAutoSaveStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save notes to storage on update with status indicator
  const persistNotes = useCallback((updatedNotes: Note[]) => {
    setAutoSaveStatus('saving');
    const success = saveNotesToStorage(updatedNotes);
    setTimeout(() => {
      if (navigator.onLine) {
        setAutoSaveStatus('saved');
      } else {
        setAutoSaveStatus('offline');
      }
    }, 400);
    return success;
  }, []);

  // Active Note helper
  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  // Create new note
  const createNewNote = useCallback((subject?: string, backgroundId?: string) => {
    const newNote: Note = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: '',
      content: '',
      checklists: [],
      backgroundId: backgroundId || (subject === 'الرياضيات' ? 'math' : subject === 'الفيزياء' ? 'physics' : subject === 'الكيمياء' ? 'chemistry' : 'arabic'),
      fontFamily: 'Cairo',
      subject: subject || 'عام',
      tags: subject ? [subject] : ['جديد'],
      pinned: false,
      favorite: false,
      archived: false,
      inTrash: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setNotes((prev) => {
      const updated = [newNote, ...prev];
      persistNotes(updated);
      return updated;
    });
    setActiveNoteId(newNote.id);
    return newNote;
  }, [persistNotes]);

  // Update existing note
  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes((prev) => {
      const updated = prev.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            ...updates,
            updatedAt: Date.now(),
          };
        }
        return n;
      });
      persistNotes(updated);
      return updated;
    });
  }, [persistNotes]);

  // Toggle favorite
  const toggleFavorite = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.map((n) => n.id === id ? { ...n, favorite: !n.favorite, updatedAt: Date.now() } : n);
      persistNotes(updated);
      return updated;
    });
  }, [persistNotes]);

  // Toggle pin
  const togglePin = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.map((n) => n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n);
      persistNotes(updated);
      return updated;
    });
  }, [persistNotes]);

  // Toggle checklist item
  const toggleChecklistItem = useCallback((noteId: string, itemId: string) => {
    setNotes((prev) => {
      const updated = prev.map((n) => {
        if (n.id === noteId) {
          const updatedLists = n.checklists.map((c) => c.id === itemId ? { ...c, completed: !c.completed } : c);
          return { ...n, checklists: updatedLists, updatedAt: Date.now() };
        }
        return n;
      });
      persistNotes(updated);
      return updated;
    });
  }, [persistNotes]);

  // Add checklist item
  const addChecklistItem = useCallback((noteId: string, text: string) => {
    if (!text.trim()) return;
    setNotes((prev) => {
      const updated = prev.map((n) => {
        if (n.id === noteId) {
          const newItem: ChecklistItem = {
            id: `chk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            text: text.trim(),
            completed: false,
          };
          return { ...n, checklists: [...n.checklists, newItem], updatedAt: Date.now() };
        }
        return n;
      });
      persistNotes(updated);
      return updated;
    });
  }, [persistNotes]);

  // Delete checklist item
  const deleteChecklistItem = useCallback((noteId: string, itemId: string) => {
    setNotes((prev) => {
      const updated = prev.map((n) => {
        if (n.id === noteId) {
          return { ...n, checklists: n.checklists.filter((c) => c.id !== itemId), updatedAt: Date.now() };
        }
        return n;
      });
      persistNotes(updated);
      return updated;
    });
  }, [persistNotes]);

  // Move note to trash
  const moveToTrash = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.map((n) => n.id === id ? { ...n, inTrash: true, updatedAt: Date.now() } : n);
      persistNotes(updated);
      return updated;
    });
    if (activeNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id && !n.inTrash);
      setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
    }
  }, [activeNoteId, notes, persistNotes]);

  // Restore from trash
  const restoreFromTrash = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.map((n) => n.id === id ? { ...n, inTrash: false, updatedAt: Date.now() } : n);
      persistNotes(updated);
      return updated;
    });
  }, [persistNotes]);

  // Permanently delete note
  const deletePermanently = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      persistNotes(updated);
      return updated;
    });
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  }, [activeNoteId, persistNotes]);

  // Empty trash
  const emptyTrash = useCallback(() => {
    setNotes((prev) => {
      const updated = prev.filter((n) => !n.inTrash);
      persistNotes(updated);
      return updated;
    });
  }, [persistNotes]);

  // Duplicate note
  const duplicateNote = useCallback((id: string) => {
    const target = notes.find((n) => n.id === id);
    if (!target) return;
    const clone: Note = {
      ...target,
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: `${target.title || 'ملاحظة'} (نسخة)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => {
      const updated = [clone, ...prev];
      persistNotes(updated);
      return updated;
    });
    setActiveNoteId(clone.id);
  }, [notes, persistNotes]);

  // Filtered Notes
  const filteredNotes = notes.filter((note) => {
    // Trash filter
    if (activeCategory === 'trash') {
      return note.inTrash;
    }
    if (note.inTrash) return false;

    // Archive filter
    if (activeCategory === 'archived') {
      return note.archived;
    }
    if (note.archived) return false;

    // Favorites
    if (activeCategory === 'favorites' && !note.favorite) {
      return false;
    }

    // Pinned
    if (activeCategory === 'pinned' && !note.pinned) {
      return false;
    }

    // Subject
    if (selectedSubject !== 'all' && note.subject !== selectedSubject) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (note.title || '').toLowerCase().includes(q);
      const matchContent = (note.content || '').toLowerCase().includes(q);
      const matchSubject = (note.subject || '').toLowerCase().includes(q);
      const matchTag = note.tags.some((t) => t.toLowerCase().includes(q));
      const matchChecklist = note.checklists.some((c) => c.text.toLowerCase().includes(q));
      return matchTitle || matchContent || matchSubject || matchTag || matchChecklist;
    }

    return true;
  });

  // Extract all subjects used
  const availableSubjects = Array.from(
    new Set(notes.map((n) => n.subject).filter(Boolean))
  );

  return {
    notes,
    filteredNotes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNewNote,
    updateNote,
    toggleFavorite,
    togglePin,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
    moveToTrash,
    restoreFromTrash,
    deletePermanently,
    emptyTrash,
    duplicateNote,
    searchQuery,
    setSearchQuery,
    selectedSubject,
    setSelectedSubject,
    availableSubjects,
    activeCategory,
    setActiveCategory,
    autoSaveStatus,
    isOnline,
  };
}
