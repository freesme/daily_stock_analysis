/**
 * 分析结果相关类型定义
 */

/** 决策类型 */
export type DecisionType = 'buy' | 'hold' | 'sell';

/** 置信度等级 */
export type ConfidenceLevel = '高' | '中' | '低';

/** 报告类型 */
export type ReportType = 'simple' | 'full';

/** 核心结论 */
export interface CoreConclusion {
  one_sentence: string;
  signal_type: string;
  time_sensitivity: string;
  position_advice: {
    no_position: string;
    has_position: string;
  };
}

/** 趋势状态 */
export interface TrendStatus {
  ma_alignment: string;
  is_bullish: boolean;
  trend_score: number;
}

/** 价格位置 */
export interface PricePosition {
  current_price: number;
  ma5: number;
  ma10: number;
  ma20: number;
  bias_ma5: number;
  bias_status: string;
  support_level?: number;
  resistance_level?: number;
}

/** 量能分析 */
export interface VolumeAnalysis {
  volume_ratio: number;
  volume_status: string;
  turnover_rate: number;
  volume_meaning?: string;
}

/** 筹码结构 */
export interface ChipStructure {
  profit_ratio: number;
  avg_cost: number;
  concentration: number;
  chip_health: string;
}

/** 数据透视 */
export interface DataPerspective {
  trend_status: TrendStatus;
  price_position: PricePosition;
  volume_analysis: VolumeAnalysis;
  chip_structure?: ChipStructure;
}

/** 情报信息 */
export interface Intelligence {
  latest_news: string;
  risk_alerts: string[];
  positive_catalysts: string[];
  earnings_outlook?: string;
  sentiment_summary?: string;
}

/** 狙击点位 */
export interface SniperPoints {
  ideal_buy: string;
  secondary_buy: string;
  stop_loss: string;
  take_profit: string;
}

/** 仓位策略 */
export interface PositionStrategy {
  suggested_position: string;
  entry_plan: string;
  risk_control: string;
}

/** 作战计划 */
export interface BattlePlan {
  sniper_points: SniperPoints;
  position_strategy?: PositionStrategy;
  action_checklist: string[];
}

/** 决策仪表盘 */
export interface Dashboard {
  core_conclusion: CoreConclusion;
  data_perspective: DataPerspective;
  intelligence: Intelligence;
  battle_plan: BattlePlan;
}

/** 分析结果 */
export interface AnalysisResult {
  code: string;
  name: string;
  sentiment_score: number;
  trend_prediction: string;
  operation_advice: string;
  decision_type: DecisionType;
  confidence_level: ConfidenceLevel;
  analysis_summary: string;
  
  // 详细分析
  trend_analysis?: string;
  short_term_outlook?: string;
  medium_term_outlook?: string;
  technical_analysis?: string;
  ma_analysis?: string;
  volume_analysis?: string;
  pattern_analysis?: string;
  fundamental_analysis?: string;
  sector_position?: string;
  company_highlights?: string;
  news_summary?: string;
  market_sentiment?: string;
  hot_topics?: string;
  key_points?: string;
  risk_warning?: string;
  buy_reason?: string;
  
  // 决策仪表盘
  dashboard?: Dashboard;
  
  // 元数据
  search_performed?: boolean;
  data_sources?: string;
  success: boolean;
  error_message?: string;
}

/** 任务状态 */
export type TaskStatus = 'running' | 'completed' | 'failed';

/** 任务 */
export interface Task {
  task_id: string;
  code: string;
  status: TaskStatus;
  start_time: string;
  end_time?: string;
  result?: AnalysisResult;
  error?: string;
  report_type: ReportType;
}

/** 分析历史记录 */
export interface AnalysisHistory {
  id: number;
  query_id: string;
  code: string;
  name: string;
  report_type: string;
  sentiment_score: number;
  operation_advice: string;
  trend_prediction: string;
  analysis_summary: string;
  ideal_buy?: number;
  secondary_buy?: number;
  stop_loss?: number;
  take_profit?: number;
  created_at: string;
}

/** AnalysisTask 是 Task 的别名，用于任务管理 */
export type AnalysisTask = Task;
