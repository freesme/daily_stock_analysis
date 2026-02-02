import { useLocation, useNavigate } from 'react-router';
import {
  Box,
  Tooltip,
  IconButton,
  Zoom,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

// Navigation items
const mainListItems = [
  { text: 'Dashboard', icon: <HomeRoundedIcon />, path: '/dashboard' },
  { text: 'Analysis', icon: <AnalyticsRoundedIcon />, path: '/analysis' },
  { text: 'History', icon: <HistoryRoundedIcon />, path: '/history' },
  { text: 'Tasks', icon: <AssignmentRoundedIcon />, path: '/tasks' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
  { text: 'About', icon: <InfoRoundedIcon />, path: '/about' },
];

// Styled Components
const DockContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: 32,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: theme.zIndex.tooltip, // Higher than AppBar
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  borderRadius: '24px',
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  maxWidth: '90vw',
  overflowX: 'auto', // Scroll on very small screens
  
  // Hide scrollbar
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',

  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.85),
    transform: 'translateX(-50%) scale(1.02)',
    boxShadow: `0 12px 48px ${alpha(theme.palette.common.black, 0.3)}`,
  },
  
  [theme.breakpoints.down('sm')]: {
    bottom: 20,
    padding: '6px 12px',
    borderRadius: '20px',
  },
}));

const DockItem = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: 12,
  margin: '0 4px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '16px',
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  
  '&:hover': {
    backgroundColor: active 
      ? alpha(theme.palette.primary.main, 0.25) 
      : alpha(theme.palette.text.primary, 0.08),
    transform: 'translateY(-4px)',
    '& .MuiSvgIcon-root': {
      transform: 'scale(1.2)',
    },
  },
  
  '& .MuiSvgIcon-root': {
    fontSize: 28,
    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('sm')]: {
      fontSize: 24,
    },
  },

  [theme.breakpoints.down('sm')]: {
    padding: 8,
    margin: '0 2px',
    borderRadius: '12px',
  },
}));

const Separator = styled(Box)(({ theme }) => ({
  width: 1,
  height: 24,
  backgroundColor: theme.palette.divider,
  margin: '0 8px',
}));

export default function DockNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <DockContainer>
      {mainListItems.map((item) => (
        <Tooltip
          key={item.path}
          title={item.text}
          placement="top"
          TransitionComponent={Zoom}
          arrow
        >
          <DockItem
            active={isActive(item.path)}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
          </DockItem>
        </Tooltip>
      ))}
      
      <Separator />
      
      {secondaryListItems.map((item) => (
        <Tooltip
          key={item.path}
          title={item.text}
          placement="top"
          TransitionComponent={Zoom}
          arrow
        >
          <DockItem
            active={isActive(item.path)}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
          </DockItem>
        </Tooltip>
      ))}
    </DockContainer>
  );
}
