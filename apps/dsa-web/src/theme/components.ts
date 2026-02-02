/**
 * MUI 组件样式覆盖
 * 参考 MUI 官方 Dashboard 模板风格
 */

import { alpha, type Components, type Theme } from '@mui/material/styles';
import { gray, brand } from './palette';

export const getComponentOverrides = (mode: 'light' | 'dark'): Components<Theme> => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: mode === 'dark' ? gray[900] : gray[50],
        },
        '&::-webkit-scrollbar-thumb': {
          background: mode === 'dark' ? gray[700] : gray[300],
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: mode === 'dark' ? gray[600] : gray[400],
        },
      },
    },
  },

  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      outlined: {
        borderColor: mode === 'dark' ? alpha(gray[700], 0.8) : alpha(gray[300], 0.8),
        '&:hover': {
          borderColor: mode === 'dark' ? gray[600] : gray[400],
          backgroundColor: mode === 'dark' ? alpha(gray[700], 0.2) : alpha(gray[200], 0.3),
        },
      },
    },
  },

  MuiCard: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: `1px solid ${mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4)}`,
        backgroundImage: 'none',
        backgroundColor: mode === 'dark' ? 'hsl(220, 30%, 7%)' : 'hsl(220, 35%, 97%)',
      },
    },
  },

  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        backgroundColor: mode === 'dark' ? 'hsl(220, 30%, 7%)' : 'hsl(220, 35%, 97%)',
      },
      outlined: {
        borderColor: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      },
      rounded: {
        borderRadius: 12,
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
      },
      outlined: {
        borderColor: mode === 'dark' ? alpha(gray[600], 0.6) : alpha(gray[300], 0.8),
      },
    },
  },

  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: mode === 'dark' ? alpha(gray[800], 0.4) : '#fff',
          '& fieldset': {
            borderColor: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.6),
          },
          '&:hover fieldset': {
            borderColor: mode === 'dark' ? gray[600] : gray[400],
          },
          '&.Mui-focused fieldset': {
            borderColor: brand[400],
          },
        },
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.6),
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: mode === 'dark' ? gray[600] : gray[400],
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: brand[400],
        },
      },
    },
  },

  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: 6,
        fontSize: '0.75rem',
        backgroundColor: mode === 'dark' ? gray[700] : gray[800],
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: `1px solid ${mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4)}`,
        backgroundColor: mode === 'dark' ? 'hsl(220, 30%, 7%)' : 'hsl(220, 35%, 97%)',
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: mode === 'dark' ? 'hsl(220, 30%, 7%)' : 'hsl(220, 35%, 97%)',
        color: mode === 'dark' ? 'hsl(0, 0%, 100%)' : gray[800],
        boxShadow: 'none',
        borderBottom: `1px solid ${mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4)}`,
      },
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        marginBottom: 4,
        '&.Mui-selected': {
          backgroundColor: mode === 'dark' ? alpha(brand[400], 0.2) : alpha(brand[400], 0.12),
          '&:hover': {
            backgroundColor: mode === 'dark' ? alpha(brand[400], 0.3) : alpha(brand[400], 0.18),
          },
        },
        '&:hover': {
          backgroundColor: mode === 'dark' ? alpha(gray[600], 0.2) : alpha(gray[200], 0.5),
        },
      },
    },
  },

  MuiListItemIcon: {
    styleOverrides: {
      root: {
        color: mode === 'dark' ? gray[400] : gray[500],
        minWidth: 36,
      },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      },
    },
  },

  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        backgroundColor: mode === 'dark' ? gray[800] : '#fff',
      },
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        height: 6,
        backgroundColor: mode === 'dark' ? alpha(gray[700], 0.4) : alpha(gray[200], 0.6),
      },
    },
  },

  MuiSkeleton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        backgroundColor: mode === 'dark' ? alpha(gray[700], 0.3) : alpha(gray[200], 0.5),
      },
    },
  },

  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-root': {
          backgroundColor: mode === 'dark' ? alpha(gray[800], 0.6) : alpha(gray[100], 0.8),
          fontWeight: 600,
          color: mode === 'dark' ? gray[300] : gray[700],
        },
      },
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: {
        borderColor: mode === 'dark' ? alpha(gray[700], 0.4) : alpha(gray[200], 0.6),
      },
    },
  },

  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: mode === 'dark' ? alpha(gray[700], 0.15) : alpha(gray[100], 0.5),
        },
      },
    },
  },

  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        borderColor: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.6),
        '&.Mui-selected': {
          backgroundColor: mode === 'dark' ? alpha(brand[400], 0.2) : alpha(brand[400], 0.12),
          borderColor: brand[400],
          '&:hover': {
            backgroundColor: mode === 'dark' ? alpha(brand[400], 0.3) : alpha(brand[400], 0.18),
          },
        },
      },
    },
  },

  MuiToggleButtonGroup: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        '& .MuiToggleButton-root': {
          '&:first-of-type': {
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          },
          '&:last-of-type': {
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
          },
        },
      },
    },
  },

  MuiBadge: {
    styleOverrides: {
      badge: {
        fontSize: '0.65rem',
        minWidth: 16,
        height: 16,
      },
    },
  },

  MuiAvatar: {
    styleOverrides: {
      root: {
        backgroundColor: mode === 'dark' ? brand[700] : brand[400],
        color: brand[50],
      },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: {
        color: mode === 'dark' ? gray[400] : gray[600],
        '&:hover': {
          backgroundColor: mode === 'dark' ? alpha(gray[600], 0.2) : alpha(gray[200], 0.5),
        },
      },
    },
  },

  MuiBreadcrumbs: {
    styleOverrides: {
      separator: {
        color: mode === 'dark' ? gray[600] : gray[400],
      },
    },
  },

  MuiSwitch: {
    styleOverrides: {
      root: {
        '& .MuiSwitch-switchBase': {
          '&.Mui-checked': {
            color: brand[400],
            '& + .MuiSwitch-track': {
              backgroundColor: brand[400],
              opacity: 0.5,
            },
          },
        },
        '& .MuiSwitch-track': {
          backgroundColor: mode === 'dark' ? gray[600] : gray[400],
        },
      },
    },
  },
});
