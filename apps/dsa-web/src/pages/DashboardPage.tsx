import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import { StatCard, HighlightedCard } from '@/components/common';
import { useState } from 'react';

// Mock data for demo
const recentAnalyses = [
  { code: '600519', name: '贵州茅台', signal: 'hold', time: '2 hours ago', score: 72 },
  { code: '000858', name: '五粮液', signal: 'buy', time: '3 hours ago', score: 85 },
  { code: '002594', name: '比亚迪', signal: 'sell', time: '5 hours ago', score: 45 },
];

const recentTasks = [
  { id: 'task-001', code: '600519', status: 'completed', time: '2 hours ago' },
  { id: 'task-002', code: '000858', status: 'completed', time: '3 hours ago' },
  { id: 'task-003', code: '300750', status: 'running', time: 'In progress' },
];

const signalColors = {
  buy: 'success',
  hold: 'warning',
  sell: 'error',
} as const;

const signalLabels = {
  buy: 'Buy',
  hold: 'Hold',
  sell: 'Sell',
};

const statusIcons = {
  completed: <CheckCircleRoundedIcon color="success" fontSize="small" />,
  running: <PlayCircleRoundedIcon color="primary" fontSize="small" />,
  failed: <ErrorRoundedIcon color="error" fontSize="small" />,
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stockCode, setStockCode] = useState('');

  const handleAnalyze = () => {
    if (stockCode.trim()) {
      navigate(`/analysis?code=${stockCode.trim()}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <Box>
      {/* Page Title */}
      <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Overview
      </Typography>

      {/* Stats Cards Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Analyses"
            value="128"
            interval="Last 30 days"
            trend="up"
            trendValue="+12%"
            icon={<AnalyticsRoundedIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Active Tasks"
            value="3"
            interval="Currently running"
            trend="neutral"
            trendValue="0"
            icon={<AssignmentRoundedIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Stocks Tracked"
            value="24"
            interval="In watchlist"
            trend="up"
            trendValue="+4"
            icon={<ShowChartRoundedIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard
            title="AI Analysis"
            description="Get comprehensive insights powered by AI."
            buttonText="Start Analysis"
            onButtonClick={() => navigate('/analysis')}
          />
        </Grid>
      </Grid>

      {/* Quick Analysis & Recent Activity */}
      <Grid container spacing={2}>
        {/* Quick Analysis */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Quick Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter a stock code to start AI-powered analysis
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter stock code (e.g., 600519)"
                    value={stockCode}
                    onChange={(e) => setStockCode(e.target.value)}
                    onKeyPress={handleKeyPress}
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
                  <Button
                    variant="contained"
                    onClick={handleAnalyze}
                    disabled={!stockCode.trim()}
                    endIcon={<ArrowForwardRoundedIcon />}
                  >
                    Analyze
                  </Button>
                </Stack>

                <Divider />

                {/* Recent Analyses */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Recent Analyses
                  </Typography>
                  <List dense disablePadding>
                    {recentAnalyses.map((item) => (
                      <ListItem
                        key={item.code}
                        disablePadding
                        sx={{
                          py: 1,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          '&:last-child': { borderBottom: 'none' },
                        }}
                        secondaryAction={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              size="small"
                              label={signalLabels[item.signal as keyof typeof signalLabels]}
                              color={signalColors[item.signal as keyof typeof signalColors]}
                              sx={{ minWidth: 60 }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/analysis?code=${item.code}`)}
                            >
                              <ArrowForwardRoundedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        }
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {item.signal === 'buy' ? (
                            <TrendingUpRoundedIcon color="success" fontSize="small" />
                          ) : item.signal === 'sell' ? (
                            <TrendingDownRoundedIcon color="error" fontSize="small" />
                          ) : (
                            <ShowChartRoundedIcon color="warning" fontSize="small" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {item.code}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.name}
                              </Typography>
                            </Stack>
                          }
                          secondary={item.time}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tasks */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Recent Tasks
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track your analysis tasks
                    </Typography>
                  </Box>
                  <Button
                    variant="text"
                    size="small"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => navigate('/tasks')}
                  >
                    View all
                  </Button>
                </Stack>

                <List dense disablePadding>
                  {recentTasks.map((task) => (
                    <ListItem
                      key={task.id}
                      disablePadding
                      sx={{
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {statusIcons[task.status as keyof typeof statusIcons]}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {task.code}
                            </Typography>
                            <Chip
                              size="small"
                              label={task.status}
                              variant="outlined"
                              sx={{ 
                                textTransform: 'capitalize',
                                height: 20,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Stack>
                        }
                        secondary={
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                            <AccessTimeRoundedIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {task.time}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider />

                {/* System Status */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                    System Status
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: 'success.main',
                          color: 'success.contrastText',
                        }}
                      >
                        <CheckCircleRoundedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          API Online
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: 'success.main',
                          color: 'success.contrastText',
                        }}
                      >
                        <CheckCircleRoundedIcon fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          AI Ready
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
