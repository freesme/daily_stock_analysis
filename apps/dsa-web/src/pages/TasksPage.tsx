import { useMemo } from 'react';
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
} from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';

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
  
  const { 
    data: tasksResponse, 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching,
  } = useTasks();

  const tasksData: Task[] = tasksResponse?.data || [];

  // Calculate summary counts
  const summary = useMemo(() => {
    const counts = { running: 0, completed: 0, failed: 0 };
    tasksData.forEach(task => {
      if (task.status in counts) {
        counts[task.status]++;
      }
    });
    return counts;
  }, [tasksData]);

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
            {/* Summary */}
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<PlayCircleRoundedIcon />}
                label={isLoading ? 'Loading...' : `${summary.running} Running`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<CheckCircleRoundedIcon />}
                label={isLoading ? 'Loading...' : `${summary.completed} Completed`}
                color="success"
                variant="outlined"
              />
              <Chip
                icon={<ErrorRoundedIcon />}
                label={isLoading ? 'Loading...' : `${summary.failed} Failed`}
                color="error"
                variant="outlined"
              />
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
                  {!isLoading && tasksData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">
                          暂无任务
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Data Rows */}
                  {!isLoading && tasksData.map((task) => {
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
