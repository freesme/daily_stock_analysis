import { Box, Card, CardContent, CircularProgress, Stack, Typography, alpha } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import type { TaskStatus } from '@/types';

interface TaskProgressProps {
  taskId: string;
  stockCode: string;
  status: TaskStatus;
  error?: string;
}

const statusConfig = {
  running: {
    label: '分析中...',
    color: 'primary' as const,
  },
  completed: {
    label: '分析完成',
    color: 'success' as const,
  },
  failed: {
    label: '分析失败',
    color: 'error' as const,
  },
};

export default function TaskProgress({ taskId, stockCode, status, error }: TaskProgressProps) {
  const config = statusConfig[status];

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: (theme) => alpha(theme.palette[config.color].main, 0.5),
      }}
    >
      <CardContent>
        <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
          {status === 'running' && (
            <CircularProgress size={60} color={config.color} />
          )}
          {status === 'completed' && (
            <CheckCircleRoundedIcon sx={{ fontSize: 60, color: 'success.main' }} />
          )}
          {status === 'failed' && (
            <ErrorRoundedIcon sx={{ fontSize: 60, color: 'error.main' }} />
          )}

          <Box textAlign="center">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {config.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              股票代码: {stockCode}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              任务 ID: {taskId}
            </Typography>
          </Box>

          {status === 'running' && (
            <Typography variant="body2" color="text.secondary">
              AI 正在分析股票数据，请稍候...
            </Typography>
          )}

          {status === 'failed' && error && (
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                width: '100%',
              }}
            >
              <Typography variant="body2" color="error.main">
                错误信息: {error}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
