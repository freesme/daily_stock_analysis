import { create } from 'zustand';
import type { AnalysisTask, TaskStatus } from '@/types';

interface TaskState {
  tasks: AnalysisTask[];
  currentTaskId: string | null;
  
  // Actions
  addTask: (task: AnalysisTask) => void;
  updateTask: (taskId: string, updates: Partial<AnalysisTask>) => void;
  removeTask: (taskId: string) => void;
  setCurrentTask: (taskId: string | null) => void;
  clearTasks: () => void;
  
  // Selectors
  getTask: (taskId: string) => AnalysisTask | undefined;
  getTasksByStatus: (status: TaskStatus) => AnalysisTask[];
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  currentTaskId: null,

  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.task_id === taskId ? { ...task, ...updates } : task
      ),
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.task_id !== taskId),
      currentTaskId: state.currentTaskId === taskId ? null : state.currentTaskId,
    })),

  setCurrentTask: (taskId) =>
    set({ currentTaskId: taskId }),

  clearTasks: () =>
    set({ tasks: [], currentTaskId: null }),

  getTask: (taskId) => get().tasks.find((task) => task.task_id === taskId),

  getTasksByStatus: (status) =>
    get().tasks.filter((task) => task.status === status),
}));
