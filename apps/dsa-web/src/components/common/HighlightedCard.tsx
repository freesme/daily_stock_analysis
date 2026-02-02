import { Card, CardContent, Typography, Button, Stack } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

interface HighlightedCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function HighlightedCard({
  title = 'Explore Analysis',
  description = 'Uncover performance and insights with our AI-powered stock analysis.',
  buttonText = 'Get insights',
  onButtonClick,
}: HighlightedCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        flexGrow: 1,
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(25, 118, 210, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.02) 100%)',
        borderColor: 'primary.main',
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <AutoAwesomeRoundedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={onButtonClick}
            sx={{ alignSelf: 'flex-start' }}
          >
            {buttonText}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
