/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#2D3732',
    background: '#F7F5F0',
    backgroundElement: '#EBE7DC',
    backgroundSelected: '#DCD7C9',
    textSecondary: '#6B7F72',
    primary: '#7D9B84', // Salbeigrün (Sage green)
    secondary: '#A390B7', // Soft lavender
    accent: '#E6B800', // Heilkräuter gold
    danger: '#D98880', // Terracotta soft red
    card: '#FFFFFF',
    white: '#FFFFFF',
  },
  dark: {
    text: '#F0EDE6',
    background: '#181A18',
    backgroundElement: '#262825',
    backgroundSelected: '#333732',
    textSecondary: '#949F96',
    primary: '#8EA893', // Sage green
    secondary: '#BFAED3', // Soft lavender
    accent: '#FFD700', // Heilkräuter gold
    danger: '#EC9E95', // Terracotta soft red
    card: '#262825',
    white: '#FFFFFF',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
