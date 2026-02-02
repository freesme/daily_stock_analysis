import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { triggerAnalysis, getAnalysisHistory, type AnalysisParams, type HistoryParams } from '@/api/analysis';
import { getTasks, getTask } from '@/api/tasks';
import { checkHealth } from '@/api/system';

// ============ Query Keys ============

export const queryKeys = {
  health: ['health'] as const,
  tasks: ['tasks'] as const,
  task: (taskId: string) => ['task', taskId] as const,
  history: (params?: HistoryParams) => ['history', params] as const,
};

// ============ System Hooks ============

/**
 * 健康检查 Hook
 */
export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: checkHealth,
    refetchInterval: 30000, // 每30秒检查一次
    staleTime: 10000,
  });
}

// ============ Task Hooks ============

/**
 * 获取所有任务
 */
export function useTasks() {
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: () => getTasks(),
    refetchInterval: 5000, // 每5秒刷新
  });
}

/**
 * 获取单个任务状态（支持轮询）
 */
export function useTask(taskId: string | null, options?: { enabled?: boolean; polling?: boolean }) {
  return useQuery({
    queryKey: queryKeys.task(taskId || ''),
    queryFn: () => getTask(taskId!),
    enabled: !!taskId && (options?.enabled !== false),
    refetchInterval: options?.polling !== false ? 2000 : false, // 默认每2秒轮询
    staleTime: 1000,
  });
}

/**
 * 触发分析任务
 */
export function useTriggerAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: AnalysisParams) => triggerAnalysis(params),
    onSuccess: () => {
      // 刷新任务列表
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });
}

// ============ History Hooks ============

/**
 * 获取分析历史
 */
export function useAnalysisHistory(params?: HistoryParams) {
  return useQuery({
    queryKey: queryKeys.history(params),
    queryFn: () => getAnalysisHistory(params),
    staleTime: 60000, // 1分钟内不重新获取
  });
}
