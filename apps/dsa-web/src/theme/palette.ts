/**
 * MUI 调色板配置
 * 参考 MUI 官方 Dashboard 模板的配色方案
 */

import { alpha, type PaletteOptions } from '@mui/material/styles';

// ============ 颜色定义 (参考 MUI 官方 themePrimitives) ============

/** 品牌色 - 蓝色系 */
export const brand = {
  50: 'hsl(210, 100%, 95%)',
  100: 'hsl(210, 100%, 92%)',
  200: 'hsl(210, 100%, 80%)',
  300: 'hsl(210, 100%, 65%)',
  400: 'hsl(210, 98%, 48%)',
  500: 'hsl(210, 98%, 42%)',
  600: 'hsl(210, 98%, 55%)',
  700: 'hsl(210, 100%, 35%)',
  800: 'hsl(210, 100%, 16%)',
  900: 'hsl(210, 100%, 21%)',
};

/** 灰色系 */
export const gray = {
  50: 'hsl(220, 35%, 97%)',
  100: 'hsl(220, 30%, 94%)',
  200: 'hsl(220, 20%, 88%)',
  300: 'hsl(220, 20%, 80%)',
  400: 'hsl(220, 20%, 65%)',
  500: 'hsl(220, 20%, 42%)',
  600: 'hsl(220, 20%, 35%)',
  700: 'hsl(220, 20%, 25%)',
  800: 'hsl(220, 30%, 6%)',
  900: 'hsl(220, 35%, 3%)',
};

/** 绿色系 - 用于成功/买入信号 */
export const green = {
  50: 'hsl(120, 80%, 98%)',
  100: 'hsl(120, 75%, 94%)',
  200: 'hsl(120, 75%, 87%)',
  300: 'hsl(120, 61%, 77%)',
  400: 'hsl(120, 44%, 53%)',
  500: 'hsl(120, 59%, 30%)',
  600: 'hsl(120, 70%, 25%)',
  700: 'hsl(120, 75%, 16%)',
  800: 'hsl(120, 84%, 10%)',
  900: 'hsl(120, 87%, 6%)',
};

/** 橙色系 - 用于警告/持有信号 */
export const orange = {
  50: 'hsl(45, 100%, 97%)',
  100: 'hsl(45, 92%, 90%)',
  200: 'hsl(45, 94%, 80%)',
  300: 'hsl(45, 90%, 65%)',
  400: 'hsl(45, 90%, 40%)',
  500: 'hsl(45, 90%, 35%)',
  600: 'hsl(45, 91%, 25%)',
  700: 'hsl(45, 94%, 20%)',
  800: 'hsl(45, 95%, 16%)',
  900: 'hsl(45, 93%, 12%)',
};

/** 红色系 - 用于错误/卖出信号 */
export const red = {
  50: 'hsl(0, 100%, 97%)',
  100: 'hsl(0, 92%, 90%)',
  200: 'hsl(0, 94%, 80%)',
  300: 'hsl(0, 90%, 65%)',
  400: 'hsl(0, 90%, 40%)',
  500: 'hsl(0, 90%, 30%)',
  600: 'hsl(0, 91%, 25%)',
  700: 'hsl(0, 94%, 18%)',
  800: 'hsl(0, 95%, 12%)',
  900: 'hsl(0, 93%, 6%)',
};

// ============ 主题调色板 ============

/** 亮色主题调色板 */
export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    light: brand[200],
    main: brand[400],
    dark: brand[700],
    contrastText: brand[50],
  },
  secondary: {
    light: gray[200],
    main: gray[500],
    dark: gray[700],
    contrastText: '#fff',
  },
  info: {
    light: brand[100],
    main: brand[300],
    dark: brand[600],
    contrastText: gray[50],
  },
  warning: {
    light: orange[300],
    main: orange[400],
    dark: orange[800],
    contrastText: gray[800],
  },
  error: {
    light: red[300],
    main: red[400],
    dark: red[800],
    contrastText: '#fff',
  },
  success: {
    light: green[300],
    main: green[400],
    dark: green[800],
    contrastText: '#fff',
  },
  grey: gray,
  divider: alpha(gray[300], 0.4),
  background: {
    default: 'hsl(0, 0%, 99%)',
    paper: 'hsl(220, 35%, 97%)',
  },
  text: {
    primary: gray[800],
    secondary: gray[600],
    disabled: gray[400],
  },
  action: {
    hover: alpha(gray[200], 0.2),
    selected: alpha(gray[200], 0.3),
    disabled: alpha(gray[400], 0.5),
    disabledBackground: alpha(gray[200], 0.4),
  },
};

/** 暗色主题调色板 */
export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    light: brand[300],
    main: brand[400],
    dark: brand[700],
    contrastText: brand[50],
  },
  secondary: {
    light: gray[400],
    main: gray[500],
    dark: gray[700],
    contrastText: gray[50],
  },
  info: {
    light: brand[500],
    main: brand[700],
    dark: brand[900],
    contrastText: brand[300],
  },
  warning: {
    light: orange[400],
    main: orange[500],
    dark: orange[700],
    contrastText: gray[800],
  },
  error: {
    light: red[400],
    main: red[500],
    dark: red[700],
    contrastText: gray[50],
  },
  success: {
    light: green[400],
    main: green[500],
    dark: green[700],
    contrastText: gray[50],
  },
  grey: gray,
  divider: alpha(gray[700], 0.6),
  background: {
    default: gray[900],
    paper: 'hsl(220, 30%, 7%)',
  },
  text: {
    primary: 'hsl(0, 0%, 100%)',
    secondary: gray[400],
    disabled: gray[600],
  },
  action: {
    hover: alpha(gray[600], 0.2),
    selected: alpha(gray[600], 0.3),
    disabled: alpha(gray[600], 0.5),
    disabledBackground: alpha(gray[700], 0.4),
  },
};

// ============ 信号颜色映射 ============

/** 信号颜色 - 用于决策类型显示 */
export const signalColors = {
  buy: 'success' as const,
  hold: 'warning' as const,
  sell: 'error' as const,
  watch: 'default' as const,
};

/** 信号 Emoji */
export const signalEmojis = {
  buy: '🟢',
  hold: '🟡',
  sell: '🔴',
  watch: '⚪',
};

/** 获取信号对应的颜色值 */
export const getSignalColor = (signal: keyof typeof signalColors, mode: 'light' | 'dark') => {
  const colors = {
    buy: mode === 'dark' ? green[400] : green[400],
    hold: mode === 'dark' ? orange[400] : orange[400],
    sell: mode === 'dark' ? red[400] : red[400],
    watch: mode === 'dark' ? gray[400] : gray[500],
  };
  return colors[signal];
};
