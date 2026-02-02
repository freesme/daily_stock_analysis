import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Stack,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

import { useTriggerAnalysis, useTask } from '@/hooks/useApi';
import { useNotificationStore } from '@/stores/notificationStore';
import { DecisionDashboard, AnalysisSummary, TaskProgress } from '@/components/analysis';
import type { ReportType, Task } from '@/types';

export default function AnalysisPage() {
  const { taskId: urlTaskId } = useParams<{ taskId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const codeFromUrl = searchParams.get('code') || '';
  
  // Form state
  const [stockCode, setStockCode] = useState(codeFromUrl);
  const [reportType, setReportType] = useState<ReportType>('simple');
  
  // Task state
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(urlTaskId || null);
  const [currentStockCode, setCurrentStockCode] = useState<string>('');
  
  // Notification
  const notification = useNotificationStore();
  
  // API hooks
  const triggerAnalysisMutation = useTriggerAnalysis();
  
  // Polling for task status
  const { 
    data: taskData, 
    isLoading: isLoadingTask,
  } = useTask(currentTaskId, {
    enabled: !!currentTaskId,
    polling: true,
  });

  // Extract task from response
  const task: Task | undefined = taskData?.data;

  // Handle task status changes
  useEffect(() => {
    if (task?.status === 'completed') {
      notification.success(`股票 ${task.code} 分析完成！`);
    } else if (task?.status === 'failed') {
      notification.error(`分析失败: ${task.error || '未知错误'}`);
    }
  }, [task?.status, task?.code, task?.error]);

  // Sync URL taskId to state
  useEffect(() => {
    if (urlTaskId && urlTaskId !== currentTaskId) {
      setCurrentTaskId(urlTaskId);
    }
  }, [urlTaskId]);

  const handleAnalyze = async () => {
    const code = stockCode.trim();
    if (!code) {
      notification.warning('请输入股票代码');
      return;
    }

    try {
      const result = await triggerAnalysisMutation.mutateAsync({
        code,
        report_type: reportType,
      });

      if (result.success && result.data?.task_id) {
        const taskId = result.data.task_id;
        setCurrentTaskId(taskId);
        setCurrentStockCode(code);
        notification.info(`已开始分析 ${code}，请稍候...`);
        
        // Update URL to include task ID
        navigate(`/analysis/${taskId}`, { replace: true });
      } else {
        notification.error(result.message || '启动分析失败');
      }
    } catch (error) {
      notification.error('网络错误，请检查后端服务是否运行');
      console.error('Analysis error:', error);
    }
  };

  const handleReportTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: ReportType | null,
  ) => {
    if (newType !== null) {
      setReportType(newType);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentTaskId(null);
    setCurrentStockCode('');
    setStockCode('');
    navigate('/analysis', { replace: true });
  };

  const isAnalyzing = triggerAnalysisMutation.isPending || task?.status === 'running';
  const hasResult = task?.status === 'completed' && task?.result;
  const hasFailed = task?.status === 'failed';

  return (
    <Box>
      {/* Page Title */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 600 }}>
          Stock Analysis
        </Typography>
        {currentTaskId && (
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={handleNewAnalysis}
          >
            New Analysis
          </Button>
        )}
      </Stack>

      <Grid container spacing={3}>
        {/* Analysis Form */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    New Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter a stock code and select report type
                  </Typography>
                </Box>

                {/* Stock Code Input */}
                <TextField
                  fullWidth
                  label="Stock Code"
                  placeholder="e.g., 600519, 000858"
                  value={stockCode}
                  onChange={(e) => setStockCode(e.target.value)}
                  disabled={isAnalyzing}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isAnalyzing && stockCode.trim()) {
                      handleAnalyze();
                    }
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }
                  }}
                />

                {/* Report Type Toggle */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Report Type
                  </Typography>
                  <ToggleButtonGroup
                    value={reportType}
                    exclusive
                    onChange={handleReportTypeChange}
                    fullWidth
                    size="small"
                    disabled={isAnalyzing}
                  >
                    <ToggleButton value="simple">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <SummarizeRoundedIcon fontSize="small" />
                        <span>Simple</span>
                      </Stack>
                    </ToggleButton>
                    <ToggleButton value="full">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DescriptionRoundedIcon fontSize="small" />
                        <span>Full Report</span>
                      </Stack>
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {reportType === 'simple' 
                      ? 'Quick analysis with key insights' 
                      : 'Comprehensive analysis with detailed breakdown'}
                  </Typography>
                </Box>

                <Divider />

                {/* Analyze Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!stockCode.trim() || isAnalyzing}
                  onClick={handleAnalyze}
                  startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <PlayArrowRoundedIcon />}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Current Task Info */}
          {currentTaskId && task && (
            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Current Task
                </Typography>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Task ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {currentTaskId}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Stock Code
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {task.code || currentStockCode}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Report Type
                    </Typography>
                    <Typography variant="body2">
                      {task.report_type === 'full' ? 'Full Report' : 'Simple'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Analysis Result */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Loading Task */}
          {isLoadingTask && currentTaskId && !task && (
            <Paper
              variant="outlined"
              sx={{
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
              }}
            >
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography color="text.secondary">
                Loading task...
              </Typography>
            </Paper>
          )}

          {/* Running Task */}
          {task?.status === 'running' && (
            <TaskProgress
              taskId={currentTaskId!}
              stockCode={task.code || currentStockCode}
              status="running"
            />
          )}

          {/* Failed Task */}
          {hasFailed && (
            <Stack spacing={2}>
              <TaskProgress
                taskId={currentTaskId!}
                stockCode={task!.code || currentStockCode}
                status="failed"
                error={task!.error}
              />
              <Alert severity="error" variant="outlined">
                分析失败，请检查股票代码是否正确，或稍后重试。
              </Alert>
            </Stack>
          )}

          {/* Completed Task - Show Results */}
          {hasResult && task!.result && (
            <Stack spacing={3}>
              {/* Success indicator */}
              <Alert severity="success" variant="outlined">
                分析完成！以下是 {task!.result.name || task!.code} 的分析结果。
              </Alert>

              {/* Decision Dashboard (if available) */}
              {task!.result.dashboard ? (
                <DecisionDashboard
                  dashboard={task!.result.dashboard}
                  stockCode={task!.result.code}
                  stockName={task!.result.name}
                />
              ) : (
                /* Fallback to AnalysisSummary */
                <AnalysisSummary result={task!.result} />
              )}
            </Stack>
          )}

          {/* No Task - Empty State */}
          {!currentTaskId && !isAnalyzing && (
            <Paper
              variant="outlined"
              sx={{
                height: '100%',
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                textAlign: 'center',
                bgcolor: 'background.default',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                  mb: 3,
                }}
              >
                <TrendingUpRoundedIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                No Analysis Selected
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                Enter a stock code and click "Start Analysis" to get AI-powered insights
              </Typography>
            </Paper>
          )}

          {/* Analyzing - waiting for task creation */}
          {triggerAnalysisMutation.isPending && !currentTaskId && (
            <Paper
              variant="outlined"
              sx={{
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
              }}
            >
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography color="text.secondary">
                正在创建分析任务...
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
