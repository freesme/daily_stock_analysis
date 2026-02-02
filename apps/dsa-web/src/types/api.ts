/**
 * API 响应类型定义
 */

import type { Task, AnalysisHistory } from './analysis';

/** 通用 API 响应包装器 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** 基础响应 */
export interface BaseResponse {
  success: boolean;
  error?: string;
}

/** 健康检查响应 */
export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
}

/** 分析触发响应 */
export interface AnalysisResponse extends BaseResponse {
  message?: string;
  code?: string;
  task_id?: string;
  report_type?: string;
}

/** 任务状态响应 */
export interface TaskResponse extends BaseResponse {
  task?: Task;
}

/** 任务列表响应 */
export interface TaskListResponse extends BaseResponse {
  tasks: Task[];
}

/** 分析历史响应 */
export interface HistoryResponse extends BaseResponse {
  records: AnalysisHistory[];
  count: number;
}

/** 分析历史查询参数 */
export interface HistoryParams {
  code?: string;
  query_id?: string;
  days?: number;
  limit?: number;
}
