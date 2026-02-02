import apiClient from './client';
import type { ApiResponse } from '@/types';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  version?: string;
  uptime?: number;
  services?: Record<string, boolean>;
}

/**
 * Health check
 */
export async function checkHealth(): Promise<ApiResponse<HealthStatus>> {
  const response = await apiClient.get('/health');
  return response.data;
}
