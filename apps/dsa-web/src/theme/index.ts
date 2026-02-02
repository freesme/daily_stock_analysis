/**
 * MUI 主题配置入口
 * 参考 MUI 官方 Dashboard 模板
 */

import { createTheme, type Theme, type ThemeOptions, type Shadows } from '@mui/material/styles';
import { darkPalette, lightPalette } from './palette';
import { typography } from './typography';
import { getComponentOverrides } from './components';

export type ThemeMode = 'light' | 'dark';

// 自定义阴影
const getCustomShadows = (mode: ThemeMode): Shadows => {
  const baseShadow = mode === 'dark'
    ? 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
    : 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px';

  return [
    'none',
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
    baseShadow,
  ];
};

/**
 * 创建主题
 */
export function createAppTheme(mode: ThemeMode): Theme {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  const themeOptions: ThemeOptions = {
    palette,
    typography,
    components: getComponentOverrides(mode),
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    shadows: getCustomShadows(mode),
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  };

  return createTheme(themeOptions);
}

/** 预创建的暗色主题 */
export const darkTheme = createAppTheme('dark');

/** 预创建的亮色主题 */
export const lightTheme = createAppTheme('light');

// 导出其他模块
export * from './palette';
export * from './typography';
export * from './components';
