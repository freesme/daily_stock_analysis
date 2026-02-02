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
  LinearProgress,
  Button,
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
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';

import { useTasks } from '@/hooks/useApi';
import type { Task, TaskStatus } from '@/types';

const statusConfig: Record<TaskStatus, { 
  label: string; 
  labelZh: string;
  color: 'primary' | 'success' | 'error' | 'default'; 
  icon: React.ReactElement;
  progress: number;
}> = {
  running: { 
    label: 'Running', 
    labelZh: '运行中',
    color: 'primary', 
    icon: <PlayCircleRoundedIcon fontSize="small" />,
    progress: 50,
  },
  completed: { 
    label: 'Completed', 
    labelZh: '已完成',
    color: 'success', 
    icon: <CheckCircleRoundedIcon fontSize="small" />,
    progress: 100,
  },
  failed: { 
    label: 'Failed', 
    labelZh: '失败',
    color: 'error', 
    icon: <ErrorRoundedIcon fontSize="small" />,
    progress: 100,
  },
};

function formatTime(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function formatDuration(start?: string, end?: string): string {
  if (!start) return '-';
  
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const diffMs = endDate.getTime() - startDate.getTime();
  
  if (diffMs < 0) return '-';
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${remainingSeconds}s`;
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><Skeleton width={120} height={20} /></TableCell>
      <TableCell><Skeleton width={60} height={20} /></TableCell>
      <TableCell><Skeleton width={80} height={24} /></TableCell>
      <TableCell><Skeleton width={60} height={24} /></TableCell>
      <TableCell><Skeleton width={100} height={20} /></TableCell>
      <TableCell><Skeleton width={80} height={20} /></TableCell>
      <TableCell><Skeleton width={60} height={20} /></TableCell>
      <TableCell align="right"><Skeleton width={32} height={32} /></TableCell>
    </TableRow>
  );
}

export default function TasksPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  const { 
    data: tasksResponse, 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching,
  } = useTasks();

  const tasksData: Task[] = tasksResponse?.data || [];

  // Calculate summary counts (based on raw data)
  const summary = useMemo(() => {
    const counts = { running: 0, completed: 0, failed: 0 };
    tasksData.forEach(task => {
      if (task.status in counts) {
        counts[task.status]++;
      }
    });
    return counts;
  }, [tasksData]);

  // Filter and Sort
  const filteredData = useMemo(() => {
    let result = [...tasksData];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const timeA = new Date(a.start_time).getTime();
      const timeB = new Date(b.start_time).getTime();
      
      switch (sortOrder) {
        case 'newest':
          return timeB - timeA;
        case 'oldest':
          return timeA - timeB;
        default:
          return 0;
      }
    });

    return result;
  }, [tasksData, statusFilter, sortOrder]);

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

  const handleViewTask = (task: Task) => {
    navigate(`/analysis/${task.task_id}`);
  };

  return (
    <Box>
      {/* Page Title */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
          Tasks
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={isFetching ? <CircularProgress size={16} /> : <RefreshRoundedIcon />}
          onClick={() => refetch()}
          disabled={isFetching}
        >
          Refresh
        </Button>
      </Stack>

      {/* Error Alert */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          加载任务列表失败: {(error as Error)?.message || '未知错误'}
        </Alert>
      )}

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={3}>
            {/* Summary Chips (Clickable as shortcuts) */}
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<PlayCircleRoundedIcon />}
                label={isLoading ? 'Loading...' : `${summary.running} Running`}
                color="primary"
                variant={statusFilter === 'running' ? 'filled' : 'outlined'}
                onClick={() => setStatusFilter(statusFilter === 'running' ? 'all' : 'running')}
              />
              <Chip
                icon={<CheckCircleRoundedIcon />}
                label={isLoading ? 'Loading...' : `${summary.completed} Completed`}
                color="success"
                variant={statusFilter === 'completed' ? 'filled' : 'outlined'}
                onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
              />
              <Chip
                icon={<ErrorRoundedIcon />}
                label={isLoading ? 'Loading...' : `${summary.failed} Failed`}
                color="error"
                variant={statusFilter === 'failed' ? 'filled' : 'outlined'}
                onClick={() => setStatusFilter(statusFilter === 'failed' ? 'all' : 'failed')}
              />
            </Stack>

            {/* Filters and Sort */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
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
                <ToggleButton value="running" aria-label="running">
                  Running
                </ToggleButton>
                <ToggleButton value="completed" aria-label="completed">
                  Completed
                </ToggleButton>
                <ToggleButton value="failed" aria-label="failed">
                  Failed
                </ToggleButton>
              </ToggleButtonGroup>

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
                </Select>
              </FormControl>
            </Stack>

            {/* Tasks Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task ID</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Report Type</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>Duration</TableCell>
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
                    </>
                  )}

                  {/* Empty State */}
                  {!isLoading && filteredData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Stack spacing={2} alignItems="center">
                          <FilterListRoundedIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5 }} />
                          <Typography color="text.secondary">
                            {statusFilter !== 'all' 
                              ? '没有找到匹配的任务' 
                              : '暂无任务'}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Data Rows */}
                  {!isLoading && filteredData.map((task) => {
                    const status = statusConfig[task.status];
                    return (
                      <TableRow key={task.task_id} hover>
                        <TableCell>
                          <Tooltip title={task.task_id}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: 'monospace', 
                                fontSize: '0.75rem',
                                maxWidth: 120,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {task.task_id.slice(0, 8)}...
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {task.code}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            icon={status.icon}
                            label={status.labelZh}
                            color={status.color}
                            sx={{ minWidth: 90 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={task.report_type === 'full' ? 'Full' : 'Simple'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 120 }}>
                          <Stack spacing={0.5}>
                            <LinearProgress
                              variant={task.status === 'running' ? 'indeterminate' : 'determinate'}
                              value={status.progress}
                              color={task.status === 'failed' ? 'error' : task.status === 'completed' ? 'success' : 'primary'}
                              sx={{ height: 6, borderRadius: 1 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {task.status === 'running' ? 'In progress...' : `${status.progress}%`}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(task.start_time)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDuration(task.start_time, task.end_time)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small"
                              onClick={() => handleViewTask(task)}
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
