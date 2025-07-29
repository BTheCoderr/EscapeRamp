import { create } from 'zustand';
import { Migration, File, IntakeResponse, User } from './types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Migration state
  currentMigration: Migration | null;
  migrations: Migration[];
  setCurrentMigration: (migration: Migration | null) => void;
  setMigrations: (migrations: Migration[]) => void;
  addMigration: (migration: Migration) => void;
  updateMigration: (id: string, updates: Partial<Migration>) => void;
  
  // File state
  files: File[];
  setFiles: (files: File[]) => void;
  addFile: (file: File) => void;
  updateFile: (id: string, updates: Partial<File>) => void;
  removeFile: (id: string) => void;
  
  // Intake state
  intakeResponse: IntakeResponse | null;
  setIntakeResponse: (response: IntakeResponse | null) => void;
  
  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Reset state
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  
  // Migration state
  currentMigration: null,
  migrations: [],
  setCurrentMigration: (migration) => set({ currentMigration: migration }),
  setMigrations: (migrations) => set({ migrations }),
  addMigration: (migration) => set((state) => ({ 
    migrations: [...state.migrations, migration] 
  })),
  updateMigration: (id, updates) => set((state) => ({
    migrations: state.migrations.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ),
    currentMigration: state.currentMigration?.id === id 
      ? { ...state.currentMigration, ...updates }
      : state.currentMigration
  })),
  
  // File state
  files: [],
  setFiles: (files) => set({ files }),
  addFile: (file) => set((state) => ({ 
    files: [...state.files, file] 
  })),
  updateFile: (id, updates) => set((state) => ({
    files: state.files.map(f => 
      f.id === id ? { ...f, ...updates } : f
    )
  })),
  removeFile: (id) => set((state) => ({
    files: state.files.filter(f => f.id !== id)
  })),
  
  // Intake state
  intakeResponse: null,
  setIntakeResponse: (response) => set({ intakeResponse: response }),
  
  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Reset state
  reset: () => set({
    user: null,
    currentMigration: null,
    migrations: [],
    files: [],
    intakeResponse: null,
    isLoading: false,
  }),
})); 