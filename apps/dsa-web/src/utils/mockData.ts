// Mock data generator for stock charts

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function generateMockCandleData(days: number = 100, startPrice: number = 100): CandleData[] {
  const data: CandleData[] = [];
  let currentPrice = startPrice;
  const now = new Date();
  
  // Go back 'days' days
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }

    const dateStr = date.toISOString().split('T')[0];
    
    // Random fluctuation
    const volatility = currentPrice * 0.02; // 2% daily volatility
    const change = (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = currentPrice + change;
    
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    data.push({
      time: dateStr,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    });

    currentPrice = close;
  }

  return data;
}
