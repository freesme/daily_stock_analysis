import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createChart, ColorType } from 'lightweight-charts';
import type { ISeriesApi } from 'lightweight-charts';
import { Box, Card, CardContent, Typography, useTheme, Skeleton } from '@mui/material';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import { fetchStockKLine } from '@/api/stock';
import type { KLineData } from '@/types/stock';

interface StockChartProps {
  code: string;
  name: string;
}

export default function StockChart({ code, name }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // Fetch K-Line data
  const { data: kLineData, isLoading } = useQuery<KLineData[]>({
    queryKey: ['stock', 'kline', code],
    queryFn: () => fetchStockKLine(code),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDark = theme.palette.mode === 'dark';
    const backgroundColor = 'transparent';
    const textColor = theme.palette.text.secondary;
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      timeScale: {
        borderColor: gridColor,
        timeVisible: true,
      },
    });

    chartRef.current = chart;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: theme.palette.success.main,
      downColor: theme.palette.error.main,
      borderVisible: false,
      wickUpColor: theme.palette.success.main,
      wickDownColor: theme.palette.error.main,
    });

    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [theme.palette.mode, theme.palette.success.main, theme.palette.error.main, theme.palette.text.secondary]);

  // Update Data
  useEffect(() => {
    if (seriesRef.current && kLineData) {
      seriesRef.current.setData(kLineData);
      chartRef.current?.timeScale().fitContent();
    }
  }, [kLineData]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
          <ShowChartRoundedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Technical Chart
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({code} {name}) - Daily K-Line {isLoading && '(Loading...)'}
          </Typography>
        </Box>
        
        {isLoading && !kLineData ? (
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 1 }} />
        ) : (
          <Box 
            ref={chartContainerRef} 
            sx={{ 
              width: '100%', 
              height: 300,
              '& .tv-lightweight-charts': {
                borderRadius: 1,
                overflow: 'hidden',
              }
            }} 
          />
        )}
      </CardContent>
    </Card>
  );
}
