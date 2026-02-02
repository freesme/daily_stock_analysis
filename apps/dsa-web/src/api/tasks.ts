import apiClient from './client';
import type { AnalysisTask, ApiResponse } from '@/types';

export interface TaskListParams {
  status?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get all tasks
 */
export async function getTasks(params?: TaskListParams): Promise<ApiResponse<AnalysisTask[]>> {
  const response = await apiClient.get('/tasks', { params });
  return response.data;
}

/**
 * Get task by ID
 */
export async function getTask(taskId: string): Promise<ApiResponse<AnalysisTask>> {
  const response = await apiClient.get('/task', { params: { id: taskId } });
  return response.data;
}

/**
 * Cancel a task
 */
export async function cancelTask(taskId: string): Promise<ApiResponse<void>> {
  const response = await apiClient.delete(`/task/${taskId}`);
  return response.data;
}
