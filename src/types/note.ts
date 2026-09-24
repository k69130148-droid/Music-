export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TableRow {
  id: string;
  cells: string[];
}

export interface NoteTable {
  id: string;
  title?: string;
  headers: string[];
  rows: TableRow[];
}

export interface BranchNode {
  id: string;
  text: string;
  children: BranchNode[];
}

export type ArabicFont = 'Cairo' | 'Tajawal' | 'Amiri' | 'Readex Pro';

export interface Note {
  id: string;
  title: string;
  content: string;
  checklists: ChecklistItem[];
  tables?: NoteTable[];
  branchRoots?: BranchNode[];
  backgroundId: string;
  fontFamily: ArabicFont;
  subject: string;
  tags: string[];
  stickers?: string[];
  pinned: boolean;
  favorite: boolean;
  archived: boolean;
  inTrash: boolean;
  audioData?: string;
  drawingData?: string;
  createdAt: number;
  updatedAt: number;
}

export type CategoryFilter = 'all' | 'favorites' | 'pinned' | 'subjects' | 'trash' | 'archived';

export interface NoteStats {
  totalNotes: number;
  totalWords: number;
  completedTasks: number;
  totalTasks: number;
}
