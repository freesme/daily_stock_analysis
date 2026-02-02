/**
 * 股票相关类型定义
 */

/** 股票市场类型 */
export type MarketType = 'A' | 'HK' | 'US';

/** 股票基础信息 */
export interface StockInfo {
  code: string;
  name: string;
  market: MarketType;
}

/** 实时行情 */
export interface RealtimeQuote {
  code: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  amount: number;
  volume_ratio?: number;
  turnover_rate?: number;
  pe_ratio?: number;
  pb_ratio?: number;
  total_mv?: number;
  circ_mv?: number;
  timestamp: string;
}

/** K 线数据点 */
export interface KLineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

/** 日线数据 */
export interface DailyData {
  code: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  amount: number;
  pct_chg: number;
  ma5?: number;
  ma10?: number;
  ma20?: number;
  volume_ratio?: number;
}

/**
 * 解析股票代码，判断市场类型
 */
export function parseStockCode(code: string): { code: string; market: MarketType } {
  const upperCode = code.toUpperCase().trim();
  
  // 港股: HK + 5位数字
  if (/^HK\d{5}$/.test(upperCode)) {
    return { code: upperCode, market: 'HK' };
  }
  
  // A股: 6位数字
  if (/^\d{6}$/.test(upperCode)) {
    return { code: upperCode, market: 'A' };
  }
  
  // 美股: 1-5个字母
  if (/^[A-Z]{1,5}(\.[A-Z]{1,2})?$/.test(upperCode)) {
    return { code: upperCode, market: 'US' };
  }
  
  // 默认按输入返回
  return { code: upperCode, market: 'A' };
}

/**
 * 格式化股票代码显示
 */
export function formatStockCode(code: string, market: MarketType): string {
  switch (market) {
    case 'HK':
      return code.startsWith('HK') ? code : `HK${code}`;
    case 'US':
      return code.toUpperCase();
    case 'A':
    default:
      return code;
  }
}
