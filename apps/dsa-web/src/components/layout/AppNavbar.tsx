import { useLocation } from 'react-router';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import { useThemeStore } from '@/stores/themeStore';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

const StyledToolbar = styled(Toolbar)({
  width: '100%',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '12px',
  flexShrink: 0,
});

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: NavItem[] = [
  { text: 'Dashboard', icon: <HomeRoundedIcon />, path: '/dashboard' },
  { text: 'Analysis', icon: <AnalyticsRoundedIcon />, path: '/analysis' },
  { text: 'History', icon: <HistoryRoundedIcon />, path: '/history' },
  { text: 'Tasks', icon: <AssignmentRoundedIcon />, path: '/tasks' },
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
];

export default function AppNavbar() {
  const { mode, toggleMode } = useThemeStore();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => isActive(item.path));
    return currentItem?.text || 'Dashboard';
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: 'auto', md: 'none' },
        boxShadow: 0,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <StyledToolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'center', mr: 'auto', alignItems: 'center' }}
          >
            <Box
              sx={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: 'linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)',
                color: 'hsla(210, 100%, 95%, 0.9)',
              }}
            >
              <ShowChartRoundedIcon sx={{ fontSize: '1rem' }} />
            </Box>
            <Typography variant="h6" component="h1" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {getCurrentPageTitle()}
            </Typography>
          </Stack>
          
          <IconButton
            size="small"
            onClick={toggleMode}
            color="inherit"
          >
            {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
          </IconButton>
        </Stack>
      </StyledToolbar>
    </AppBar>
  );
}
