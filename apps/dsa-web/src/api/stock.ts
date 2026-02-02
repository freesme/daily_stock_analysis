import type { KLineData } from '@/types/stock';
import { generateMockCandleData } from '@/utils/mockData';

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch K-Line data for a stock
 * Currently uses mock data, but structured to easily swap for real API
 */
export async function fetchStockKLine(code: string, days: number = 90): Promise<KLineData[]> {
  // Simulate network request
  await delay(500);

  // In the future, this will be:
  // const response = await apiClient.get<KLineData[]>(`/stock/${code}/kline`, { params: { days } });
  // return response.data;

  // Generate mock data based on the code to make it look slightly different for different stocks
  // We use the code's char code sum to seed the price slightly if we wanted, 
  // but for now just random start price around 100-200.
  const startPrice = 100 + (code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100);
  
  const mockData = generateMockCandleData(days, startPrice);
  
  // Cast to KLineData (mock data matches structure, volume is optional)
  return mockData as KLineData[];
}
