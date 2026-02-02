/**
 * MUI 字体配置
 * 参考 MUI 官方 Dashboard 模板
 */

import type { ThemeOptions } from '@mui/material/styles';

type TypographyOptions = NonNullable<ThemeOptions['typography']>;

export const typography: TypographyOptions = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    // 中文字体
    '"PingFang SC"',
    '"Microsoft YaHei"',
    '"Hiragino Sans GB"',
  ].join(','),

  h1: {
    fontSize: '3rem',       // 48px
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: '2.25rem',    // 36px
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: '1.875rem',   // 30px
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h4: {
    fontSize: '1.5rem',     // 24px
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: '1.25rem',    // 20px
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1.125rem',   // 18px
    fontWeight: 600,
    lineHeight: 1.5,
  },
  subtitle1: {
    fontSize: '1.125rem',   // 18px
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '0.875rem',   // 14px
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '0.875rem',   // 14px
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',   // 14px
    fontWeight: 400,
    lineHeight: 1.6,
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.875rem',
  },
  caption: {
    fontSize: '0.75rem',    // 12px
    fontWeight: 400,
    lineHeight: 1.5,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
};
