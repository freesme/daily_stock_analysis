import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded';
import type { AnalysisResult } from '@/types';

interface AnalysisSummaryProps {
  result: AnalysisResult;
}

const signalConfig = {
  buy: {
    label: 'Buy',
    labelZh: '买入',
    color: 'success' as const,
    icon: <TrendingUpRoundedIcon />,
  },
  hold: {
    label: 'Hold',
    labelZh: '持有',
    color: 'warning' as const,
    icon: <TrendingFlatRoundedIcon />,
  },
  sell: {
    label: 'Sell',
    labelZh: '卖出',
    color: 'error' as const,
    icon: <TrendingDownRoundedIcon />,
  },
};

export default function AnalysisSummary({ result }: AnalysisSummaryProps) {
  const config = signalConfig[result.decision_type] || signalConfig.hold;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {result.code}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {result.name}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip
                icon={config.icon}
                label={config.labelZh}
                color={config.color}
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label={`置信度: ${result.confidence_level}`}
                variant="outlined"
                size="small"
              />
            </Stack>
          </Stack>

          <Divider />

          {/* Summary */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              分析摘要
            </Typography>
            <Typography variant="body1">
              {result.analysis_summary}
            </Typography>
          </Box>

          {/* Key Metrics */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  情绪评分
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: result.sentiment_score >= 70
                      ? 'success.main'
                      : result.sentiment_score >= 50
                        ? 'warning.main'
                        : 'error.main',
                  }}
                >
                  {result.sentiment_score}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  趋势预测
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                  {result.trend_prediction}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette[config.color].main, 0.1),
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  操作建议
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: `${config.color}.main` }}>
                  {result.operation_advice}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  决策类型
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {config.labelZh}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Additional Analysis */}
          {result.trend_analysis && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  趋势分析
                </Typography>
                <Typography variant="body2">
                  {result.trend_analysis}
                </Typography>
              </Box>
            </>
          )}

          {result.key_points && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                关键要点
              </Typography>
              <Typography variant="body2">
                {result.key_points}
              </Typography>
            </Box>
          )}

          {result.risk_warning && (
            <Box>
              <Typography variant="subtitle2" color="error.main" gutterBottom>
                风险提示
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {result.risk_warning}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
