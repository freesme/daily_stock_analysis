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
import GpsFixedRoundedIcon from '@mui/icons-material/GpsFixedRounded';
import type { Dashboard, DecisionType } from '@/types';

import StockChart from './StockChart';

interface DecisionDashboardProps {
  dashboard: Dashboard;
  stockCode: string;
  stockName: string;
}

const signalConfig = {
  buy: {
    label: 'Buy',
    color: 'success' as const,
    icon: <TrendingUpRoundedIcon />,
    bgColor: 'success.main',
  },
  hold: {
    label: 'Hold',
    color: 'warning' as const,
    icon: <TrendingFlatRoundedIcon />,
    bgColor: 'warning.main',
  },
  sell: {
    label: 'Sell',
    color: 'error' as const,
    icon: <TrendingDownRoundedIcon />,
    bgColor: 'error.main',
  },
};

function getSignalFromType(signalType: string): DecisionType {
  const type = signalType.toLowerCase();
  if (type.includes('buy') || type.includes('买入')) return 'buy';
  if (type.includes('sell') || type.includes('卖出')) return 'sell';
  return 'hold';
}

export default function DecisionDashboard({ dashboard, stockCode, stockName }: DecisionDashboardProps) {
  const { core_conclusion, data_perspective, intelligence, battle_plan } = dashboard;
  const signal = getSignalFromType(core_conclusion.signal_type);
  const config = signalConfig[signal];

  return (
    <Stack spacing={3}>
      {/* Header - Core Conclusion */}
      <Card
        variant="outlined"
        sx={{
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette[config.color].main, 0.2)} 0%, ${alpha(theme.palette[config.color].main, 0.05)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette[config.color].main, 0.15)} 0%, ${alpha(theme.palette[config.color].main, 0.02)} 100%)`,
          borderColor: (theme) => alpha(theme.palette[config.color].main, 0.5),
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            {/* Stock Info & Signal */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stockCode}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stockName}
                </Typography>
              </Box>
              <Chip
                icon={config.icon}
                label={core_conclusion.signal_type}
                color={config.color}
                size="medium"
                sx={{ fontWeight: 600, fontSize: '0.9rem', py: 2.5, px: 1 }}
              />
            </Stack>

            {/* One Sentence Summary */}
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {core_conclusion.one_sentence}
            </Typography>

            {/* Time Sensitivity */}
            <Chip
              label={core_conclusion.time_sensitivity}
              variant="outlined"
              size="small"
              sx={{ alignSelf: 'flex-start' }}
            />

            {/* Position Advice */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    空仓建议
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {core_conclusion.position_advice.no_position}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    持仓建议
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {core_conclusion.position_advice.has_position}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {/* Sniper Points */}
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <GpsFixedRoundedIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                狙击点位
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                    borderLeft: '4px solid',
                    borderColor: 'success.main',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    理想买点
                  </Typography>
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                    {battle_plan.sniper_points.ideal_buy}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                    borderLeft: '4px solid',
                    borderColor: 'info.main',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    次优买点
                  </Typography>
                  <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>
                    {battle_plan.sniper_points.secondary_buy}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    borderLeft: '4px solid',
                    borderColor: 'error.main',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    止损位
                  </Typography>
                  <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                    {battle_plan.sniper_points.stop_loss}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                    borderLeft: '4px solid',
                    borderColor: 'warning.main',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    止盈位
                  </Typography>
                  <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600 }}>
                    {battle_plan.sniper_points.take_profit}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {/* Technical Chart */}
      <StockChart 
        code={stockCode} 
        name={stockName} 
      />

      {/* Data Perspective & Intelligence */}
      <Grid container spacing={3}>
        {/* Data Perspective */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                数据透视
              </Typography>

              <Stack spacing={2}>
                {/* Trend Status */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    趋势状态
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      label={data_perspective.trend_status.ma_alignment}
                      size="small"
                      color={data_perspective.trend_status.is_bullish ? 'success' : 'error'}
                    />
                    <Chip
                      label={`趋势评分: ${data_perspective.trend_status.trend_score}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Box>

                <Divider />

                {/* Price Position */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    价格位置
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        当前价
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ¥{data_perspective.price_position.current_price.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        乖离状态
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {data_perspective.price_position.bias_status}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Volume Analysis */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    量能分析
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      label={`量比: ${data_perspective.volume_analysis.volume_ratio.toFixed(2)}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={data_perspective.volume_analysis.volume_status}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Intelligence */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                情报信息
              </Typography>

              <Stack spacing={2}>
                {/* Latest News */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    最新消息
                  </Typography>
                  <Typography variant="body2">
                    {intelligence.latest_news || '暂无最新消息'}
                  </Typography>
                </Box>

                <Divider />

                {/* Risk Alerts */}
                {intelligence.risk_alerts.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="error.main" gutterBottom>
                      风险提示
                    </Typography>
                    <Stack spacing={0.5}>
                      {intelligence.risk_alerts.map((alert, index) => (
                        <Typography key={index} variant="body2" color="text.secondary">
                          • {alert}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Positive Catalysts */}
                {intelligence.positive_catalysts.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="success.main" gutterBottom>
                      利好因素
                    </Typography>
                    <Stack spacing={0.5}>
                      {intelligence.positive_catalysts.map((catalyst, index) => (
                        <Typography key={index} variant="body2" color="text.secondary">
                          • {catalyst}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Checklist */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            行动清单
          </Typography>
          <Stack spacing={1}>
            {battle_plan.action_checklist.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <Chip
                  label={index + 1}
                  size="small"
                  color="primary"
                  sx={{ minWidth: 28, height: 28 }}
                />
                <Typography variant="body2">{item}</Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
