import { useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded';

export interface StatCardProps {
  title: string;
  value: string;
  interval: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  interval,
  trend,
  trendValue,
  icon,
}: StatCardProps) {
  const theme = useTheme();

  const trendColors = {
    up: theme.palette.success.main,
    down: theme.palette.error.main,
    neutral: theme.palette.grey[500],
  };

  const labelColors = {
    up: 'success' as const,
    down: 'error' as const,
    neutral: 'default' as const,
  };

  const trendIcons = {
    up: <TrendingUpRoundedIcon sx={{ fontSize: 16 }} />,
    down: <TrendingDownRoundedIcon sx={{ fontSize: 16 }} />,
    neutral: <TrendingFlatRoundedIcon sx={{ fontSize: 16 }} />,
  };

  const defaultTrendValues = { up: '+25%', down: '-25%', neutral: '0%' };
  const displayTrendValue = trendValue || defaultTrendValues[trend];

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography component="h2" variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
          {icon && (
            <Box sx={{ color: 'text.secondary' }}>
              {icon}
            </Box>
          )}
        </Stack>
        
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
        >
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="h4" component="p" sx={{ fontWeight: 600 }}>
                {value}
              </Typography>
              <Chip
                size="small"
                color={labelColors[trend]}
                icon={trendIcons[trend]}
                label={displayTrendValue}
                sx={{ 
                  fontWeight: 500,
                  '& .MuiChip-icon': {
                    marginLeft: '4px',
                  }
                }}
              />
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {interval}
            </Typography>
          </Stack>

          {/* Mini chart placeholder - can be replaced with actual chart */}
          <Box
            sx={{
              width: '100%',
              height: 40,
              borderRadius: 1,
              background: `linear-gradient(90deg, ${trendColors[trend]}15 0%, ${trendColors[trend]}05 100%)`,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 0.5,
              px: 1,
              py: 0.5,
            }}
          >
            {/* Simple bar visualization */}
            {[0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 0.75, 0.9, 0.85, 1].map((height, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  height: `${height * 100}%`,
                  backgroundColor: trendColors[trend],
                  borderRadius: 0.5,
                  opacity: 0.6 + (index * 0.04),
                }}
              />
            ))}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
