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
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';

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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'score_high' | 'score_low'>('newest');
  
  const { 
    data: historyResponse, 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching,
  } = useAnalysisHistory();

  const historyData: AnalysisHistory[] = historyResponse?.data || [];

  // Filter and Sort
  const filteredData = useMemo(() => {
    let result = [...historyData];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.code.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((item) => {
        const signal = getSignalFromAdvice(item.operation_advice);
        return signal === statusFilter;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'score_high':
          return b.sentiment_score - a.sentiment_score;
        case 'score_low':
          return a.sentiment_score - b.sentiment_score;
        default:
          return 0;
      }
    });

    return result;
  }, [historyData, searchQuery, statusFilter, sortOrder]);

  const handleStatusFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: string | null,
  ) => {
    if (newFilter !== null) {
      setStatusFilter(newFilter);
    }
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value as any);
  };

  const handleViewDetail = (item: AnalysisHistory) => {
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
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={2} 
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', md: 'center' }}
            >
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
                sx={{ width: { xs: '100%', md: 280 } }}
              />

              <Stack direction="row" spacing={2} alignItems="center">
                {/* Status Filter */}
                <ToggleButtonGroup
                  value={statusFilter}
                  exclusive
                  onChange={handleStatusFilterChange}
                  size="small"
                  aria-label="status filter"
                >
                  <ToggleButton value="all" aria-label="all">
                    All
                  </ToggleButton>
                  <ToggleButton value="buy" aria-label="buy" color="success">
                    Buy
                  </ToggleButton>
                  <ToggleButton value="hold" aria-label="hold" color="warning">
                    Hold
                  </ToggleButton>
                  <ToggleButton value="sell" aria-label="sell" color="error">
                    Sell
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* Sort Order */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="sort-select-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-select-label"
                    id="sort-select"
                    value={sortOrder}
                    label="Sort By"
                    onChange={handleSortChange}
                  >
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                    <MenuItem value="score_high">Score (High)</MenuItem>
                    <MenuItem value="score_low">Score (Low)</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
            
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {isLoading ? (
                  <Skeleton width={80} />
                ) : (
                  `${filteredData.length} records found`
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
                        <Stack spacing={2} alignItems="center">
                          <FilterListRoundedIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5 }} />
                          <Typography color="text.secondary">
                            {searchQuery || statusFilter !== 'all' 
                              ? '没有找到匹配的记录' 
                              : '暂无分析历史'}
                          </Typography>
                        </Stack>
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
