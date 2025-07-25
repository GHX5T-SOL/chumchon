import { PropsWithChildren } from 'react'
import { DarkTheme as AppThemeDark, DefaultTheme as AppThemeLight } from '@react-navigation/native'
import { useColorScheme } from 'react-native'

export function useAppTheme() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const theme = isDark ? AppThemeDark : AppThemeLight
  return {
    colorScheme,
    isDark,
    theme,
  }
}
