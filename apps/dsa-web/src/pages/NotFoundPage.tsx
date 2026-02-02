import { useNavigate } from 'react-router';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 6,
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'error.main',
            color: 'error.contrastText',
            mx: 'auto',
            mb: 3,
          }}
        >
          <ErrorOutlineRoundedIcon sx={{ fontSize: 50 }} />
        </Box>
        
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          404
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          The page you are looking for might have been removed or is temporarily unavailable.
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            startIcon={<HomeRoundedIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
