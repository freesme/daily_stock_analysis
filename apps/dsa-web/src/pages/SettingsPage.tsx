import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Switch,
  Divider,
  Select,
  MenuItem,
  FormControl,
  Button,
} from '@mui/material';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { useThemeStore } from '@/stores/themeStore';

export default function SettingsPage() {
  const { mode, toggleMode } = useThemeStore();

  return (
    <Box>
      {/* Page Title */}
      <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Settings
      </Typography>

      <Stack spacing={3} sx={{ maxWidth: 600 }}>
        {/* Appearance */}
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Appearance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customize how the app looks and feels
                </Typography>
              </Box>

              <Divider />

              {/* Dark Mode Toggle */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  {mode === 'dark' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Dark Mode
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use dark theme for better visibility at night
                    </Typography>
                  </Box>
                </Stack>
                <Switch checked={mode === 'dark'} onChange={toggleMode} />
              </Stack>

              {/* Language */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <LanguageRoundedIcon />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Language
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select your preferred language
                    </Typography>
                  </Box>
                </Stack>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select defaultValue="zh-CN">
                    <MenuItem value="zh-CN">简体中文</MenuItem>
                    <MenuItem value="zh-TW">繁體中文</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your notification preferences
                </Typography>
              </Box>

              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <NotificationsRoundedIcon />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Analysis Notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get notified when analysis is complete
                    </Typography>
                  </Box>
                </Stack>
                <Switch defaultChecked />
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <NotificationsRoundedIcon />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Signal Alerts
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive alerts for buy/sell signals
                    </Typography>
                  </Box>
                </Stack>
                <Switch defaultChecked />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveRoundedIcon />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Save Settings
        </Button>
      </Stack>
    </Box>
  );
}
