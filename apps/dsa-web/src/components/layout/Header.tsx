import { useLocation } from 'react-router';
import {
  Breadcrumbs,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
  Typography,
  Tooltip,
  Badge,
} from '@mui/material';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useThemeStore } from '@/stores/themeStore';

const pathNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  analysis: 'Analysis',
  history: 'History',
  tasks: 'Tasks',
  settings: 'Settings',
  about: 'About',
};

export default function Header() {
  const location = useLocation();
  const { mode, toggleMode } = useThemeStore();

  // Generate breadcrumbs from path
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    ...pathnames.map((value, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = pathNameMap[value] || value;
      return { label, path };
    }),
  ];

  // Remove duplicate "Dashboard" if we're on dashboard
  const filteredBreadcrumbs = pathnames.length === 0 || pathnames[0] === 'dashboard' 
    ? breadcrumbs.slice(0, 1)
    : breadcrumbs;

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 2,
      }}
      spacing={2}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextRoundedIcon fontSize="small" />}
      >
        {filteredBreadcrumbs.map((item, index) => (
          <Typography
            key={item.path}
            variant="body1"
            sx={{
              color: index === filteredBreadcrumbs.length - 1 ? 'text.primary' : 'text.secondary',
              fontWeight: index === filteredBreadcrumbs.length - 1 ? 600 : 400,
            }}
          >
            {item.label}
          </Typography>
        ))}
      </Breadcrumbs>

      {/* Right side tools */}
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search stocks..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                fontSize: '0.875rem',
              }
            }
          }}
          sx={{
            width: 200,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
            },
          }}
        />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton size="small" color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton size="small" color="inherit" onClick={toggleMode}>
            {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
