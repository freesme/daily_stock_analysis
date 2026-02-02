import { Outlet } from 'react-router';
import { Box, Stack, alpha, useMediaQuery, useTheme } from '@mui/material';
import DockNav from './DockNav';
import AppNavbar from './AppNavbar';
import Header from './Header';

export default function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Dock Navigation (Floating) */}
      <DockNav />
      
      {/* Mobile Top Bar */}
      <AppNavbar />
      
      {/* Main content */}
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: alpha(theme.palette.background.default, 1),
          minHeight: '100vh',
          width: '100%',
          overflow: 'auto',
        })}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: { xs: 2, md: 4 },
            pb: 15, // Extra padding for DockNav
            mt: { xs: 10, md: 2 }, // Space for Top Bar on mobile
          }}
        >
          {/* Desktop Header */}
          {!isMobile && <Header />}
          
          {/* Page content */}
          <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Outlet />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
