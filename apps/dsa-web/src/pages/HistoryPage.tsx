import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tooltip,
  Skeleton,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded';

import { useAnalysisHistory } from '@/hooks/useApi';
import type { AnalysisHistory } from '@/types';

const signalConfig = {
  buy: { label: 'Buy', labelZh: '买入', color: 'success' as const, icon: <TrendingUpRoundedIcon fontSize="small" /> },
  hold: { label: 'Hold', labelZh: '持有', color: 'warning' as const, icon: <TrendingFlatRoundedIcon fontSize="small" /> },
  sell: { label: 'Sell', labelZh: '卖出', color: 'error' as const, icon: <TrendingDownRoundedIcon fontSize="small" /> },
};

function getSignalFromAdvice(advice: string): keyof typeof signalConfig {
  const lowerAdvice = advice.toLowerCase();
  if (lowerAdvice.includes('buy') || lowerAdvice.includes('买入') || lowerAdvice.includes('建仓')) {
    return 'buy';
  }
  if (lowerAdvice.includes('sell') || lowerAdvice.includes('卖出') || lowerAdvice.includes('减仓')) {
    return 'sell';
  }
  return 'hold';
}

function formatDateTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <Stack spacing={0.5}>
          <Skeleton width={80} height={20} />
          <Skeleton width={60} height={16} />
        </Stack>
      </TableCell>
      <TableCell><Skeleton width={70} height={24} /></TableCell>
      <TableCell><Skeleton width={40} height={20} /></TableCell>
      <TableCell><Skeleton width={120} height={20} /></TableCell>
      <TableCell align="right"><Skeleton width={32} height={32} /></TableCell>
    </TableRow>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    data: historyResponse, 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching,
  } = useAnalysisHistory();

  const historyData: AnalysisHistory[] = historyResponse?.data || [];

  // Filter by search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return historyData;
    const query = searchQuery.toLowerCase();
    return historyData.filter(
      (item) =>
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query)
    );
  }, [historyData, searchQuery]);

  const handleViewDetail = (item: AnalysisHistory) => {
    // Navigate to analysis page with query_id
    navigate(`/analysis/${item.query_id}`);
  };

  return (
    <Box>
      {/* Page Title */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
          Analysis History
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? <CircularProgress size={24} /> : <RefreshRoundedIcon />}
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Error Alert */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          加载历史记录失败: {(error as Error)?.message || '未知错误'}
        </Alert>
      )}

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={3}>
            {/* Search and Filters */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <TextField
                size="small"
                placeholder="Search by stock code or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{ width: 280 }}
              />
              <Typography variant="body2" color="text.secondary">
                {isLoading ? (
                  <Skeleton width={80} />
                ) : (
                  `${filteredData.length} records`
                )}
              </Typography>
            </Stack>

            {/* History Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Stock</TableCell>
                    <TableCell>Signal</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Report Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Loading State */}
                  {isLoading && (
                    <>
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                    </>
                  )}

                  {/* Empty State */}
                  {!isLoading && filteredData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">
                          {searchQuery ? '没有找到匹配的记录' : '暂无分析历史'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Data Rows */}
                  {!isLoading && filteredData.map((row) => {
                    const signalType = getSignalFromAdvice(row.operation_advice);
                    const signal = signalConfig[signalType];
                    return (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Stack>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {row.code}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {row.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            icon={signal.icon}
                            label={signal.labelZh}
                            color={signal.color}
                            sx={{ minWidth: 80 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: row.sentiment_score >= 70 
                                ? 'success.main' 
                                : row.sentiment_score >= 50 
                                  ? 'warning.main' 
                                  : 'error.main',
                            }}
                          >
                            {row.sentiment_score}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={row.report_type === 'full' ? 'Full' : 'Simple'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(row.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small"
                              onClick={() => handleViewDetail(row)}
                            >
                              <VisibilityRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
