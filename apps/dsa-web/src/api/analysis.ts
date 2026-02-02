import apiClient from './client';
import type { AnalysisResult, AnalysisHistory, ApiResponse } from '@/types';

export type ReportType = 'simple' | 'full';

export interface AnalysisParams {
  code: string;
  report_type?: ReportType;
}

export interface HistoryParams {
  stock_code?: string;
  limit?: number;
  offset?: number;
}

/**
 * Trigger a stock analysis
 */
export async function triggerAnalysis(params: AnalysisParams): Promise<ApiResponse<{ task_id: string }>> {
  const response = await apiClient.get('/analysis', { params });
  return response.data;
}

/**
 * Get analysis result by task ID
 */
export async function getAnalysisResult(taskId: string): Promise<ApiResponse<AnalysisResult>> {
  const response = await apiClient.get(`/analysis/${taskId}`);
  return response.data;
}

/**
 * Get analysis history
 */
export async function getAnalysisHistory(params?: HistoryParams): Promise<ApiResponse<AnalysisHistory[]>> {
  const response = await apiClient.get('/analysis/history', { params });
  return response.data;
}

/**
 * Get single history item by ID
 */
export async function getHistoryItem(historyId: string): Promise<ApiResponse<AnalysisHistory>> {
  const response = await apiClient.get(`/analysis/history/${historyId}`);
  return response.data;
}
