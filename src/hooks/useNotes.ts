import { useState, useEffect, useCallback, useRef, useTransition, useMemo } from 'react';
import { Note, ChecklistItem, ArabicFont, CategoryFilter, NoteFolder } from '../types/note';
import { getSavedNotes, saveNotesToStorage, getSavedFolders, saveFoldersToStorage } from '../utils/storage';

export type AutoSaveStatus = 'saved' | 'saving' | 'offline';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => getSavedNotes());
  const [folders, setFolders] = useState<NoteFolder[]>(() => getSavedFolders());
  const [activeFolderId, setActiveFolderId] = useState<string | 'all'>('folder_general');
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

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const statusTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Debounced save notes to storage to keep UI ultra responsive and 60fps smooth
  const persistNotes = useCallback((updatedNotes: Note[]) => {
    setAutoSaveStatus('saving');

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      saveNotesToStorage(updatedNotes);
      statusTimerRef.current = setTimeout(() => {
        setAutoSaveStatus(navigator.onLine ? 'saved' : 'offline');
      }, 150);
    }, 200);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  // Active Note helper
  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  // Create new note
  const createNewNote = useCallback((subject?: string, backgroundId?: string, folderId?: string) => {
    const targetFolder = folderId || (activeFolderId !== 'all' ? activeFolderId : 'folder_general');
    const newNote: Note = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: '',
      content: '',
      checklists: [],
      backgroundId: backgroundId || (subject === 'الرياضيات' ? 'math' : subject === 'الفيزياء' ? 'physics' : subject === 'الكيمياء' ? 'chemistry' : 'arabic'),
      fontFamily: 'Cairo',
      subject: subject || 'عام',
      folderId: targetFolder,
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
  }, [activeFolderId, persistNotes]);

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

  // Reorder notes array
  const reorderNotes = useCallback(
    (newOrder: Note[]) => {
      setNotes(newOrder);
      persistNotes(newOrder);
    },
    [persistNotes]
  );

  // Move a note by index (e.g. up or down)
  const moveNote = useCallback(
    (fromIndex: number, toIndex: number) => {
      setNotes((prev) => {
        if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) {
          return prev;
        }
        const updated = [...prev];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        persistNotes(updated);
        return updated;
      });
    },
    [persistNotes]
  );

  // Extract all subjects used
  const availableSubjects = Array.from(
    new Set(notes.map((n) => n.subject).filter(Boolean))
  );

  // Folder Actions
  const createFolder = useCallback((name: string, icon: string = '📁', color: string = '#10b981') => {
    const newFolder: NoteFolder = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim() || 'مجلد جديد',
      icon,
      color,
      createdAt: Date.now(),
    };
    setFolders((prev) => {
      const updated = [...prev, newFolder];
      saveFoldersToStorage(updated);
      return updated;
    });
    return newFolder;
  }, []);

  const updateFolder = useCallback((id: string, updates: Partial<NoteFolder>) => {
    setFolders((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, ...updates } : f));
      saveFoldersToStorage(updated);
      return updated;
    });
  }, []);

  const deleteFolder = useCallback(
    (id: string) => {
      setFolders((prev) => {
        const updated = prev.filter((f) => f.id !== id);
        saveFoldersToStorage(updated);
        return updated;
      });
      // Move any notes inside deleted folder to general
      setNotes((prev) => {
        const updated = prev.map((n) =>
          n.folderId === id ? { ...n, folderId: 'folder_general' } : n
        );
        persistNotes(updated);
        return updated;
      });
      if (activeFolderId === id) {
        setActiveFolderId('all');
      }
    },
    [activeFolderId, persistNotes]
  );

  const moveNoteToFolder = useCallback(
    (noteId: string, targetFolderId: string) => {
      updateNote(noteId, { folderId: targetFolderId });
    },
    [updateNote]
  );

  // Reorder notes inside whatever view/folder is currently displayed
  const moveNoteInActiveView = useCallback(
    (fromIndexInView: number, toIndexInView: number, currentViewNotes: Note[]) => {
      if (
        fromIndexInView < 0 ||
        fromIndexInView >= currentViewNotes.length ||
        toIndexInView < 0 ||
        toIndexInView >= currentViewNotes.length
      ) {
        return;
      }
      const noteA = currentViewNotes[fromIndexInView];
      const noteB = currentViewNotes[toIndexInView];

      setNotes((prev) => {
        const idxA = prev.findIndex((n) => n.id === noteA.id);
        const idxB = prev.findIndex((n) => n.id === noteB.id);
        if (idxA === -1 || idxB === -1) return prev;

        const updated = [...prev];
        const [moved] = updated.splice(idxA, 1);
        const newIdxB = updated.findIndex((n) => n.id === noteB.id);
        const insertIdx = fromIndexInView < toIndexInView ? newIdxB + 1 : newIdxB;
        updated.splice(insertIdx, 0, moved);
        persistNotes(updated);
        return updated;
      });
    },
    [persistNotes]
  );

  // Move note to top in current view/folder
  const moveNoteToTopInView = useCallback(
    (indexInView: number, currentViewNotes: Note[]) => {
      if (indexInView <= 0 || indexInView >= currentViewNotes.length) return;
      const targetNote = currentViewNotes[indexInView];
      const topNoteInView = currentViewNotes[0];

      setNotes((prev) => {
        const idxA = prev.findIndex((n) => n.id === targetNote.id);
        const idxTop = prev.findIndex((n) => n.id === topNoteInView.id);
        if (idxA === -1 || idxTop === -1) return prev;

        const updated = [...prev];
        const [moved] = updated.splice(idxA, 1);
        const newIdxTop = updated.findIndex((n) => n.id === topNoteInView.id);
        updated.splice(newIdxTop, 0, moved);
        persistNotes(updated);
        return updated;
      });
    },
    [persistNotes]
  );

  return {
    notes,
    folders,
    activeFolderId,
    setActiveFolderId,
    createFolder,
    updateFolder,
    deleteFolder,
    moveNoteToFolder,
    moveNoteInActiveView,
    moveNoteToTopInView,
    filteredNotes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNewNote,
    updateNote,
    reorderNotes,
    moveNote,
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
