import { useColorScheme } from 'react-native'

type Palette = Record<string, string>

const palette: { light: Palette; dark: Palette } = {
  light: {
    text: '#0A0A0A',
    background: '#FFFFFF',
    tint: '#00E5FF',
    card: 'rgba(255,255,255,0.8)',
    border: 'rgba(10,10,10,0.1)',
  },
  dark: {
    text: '#E6F7FF',
    background: '#05060A',
    tint: '#00E5FF',
    card: 'rgba(10,12,20,0.75)',
    border: 'rgba(230,247,255,0.12)',
  },
}

// Backwards-compatible signature with Expo template: useThemeColor(props, colorName)
// Also supports calling without args to get a color getter function: useThemeColor()('background')
export function useThemeColor(
  props?: { light?: string; dark?: string },
  colorName?: keyof Palette,
): string | ((key: keyof Palette) => string) {
  const scheme = useColorScheme() ?? 'dark'
  const colors = scheme === 'dark' ? palette.dark : palette.light

  if (props || colorName) {
    const override = props?.[scheme]
    const fallbackKey = (colorName as string) || 'text'
    return override ?? colors[fallbackKey] ?? '#FFFFFF'
  }

  return (key: keyof Palette) => colors[key] ?? '#FFFFFF'
}


