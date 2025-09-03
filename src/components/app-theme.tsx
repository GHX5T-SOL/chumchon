import { PropsWithChildren } from 'react'
import { theme as CyberTheme } from '@/theme'

export function useAppTheme() {
  const colorScheme = 'dark'
  const isDark = true
  const theme = CyberTheme as any
  return {
    colorScheme,
    isDark,
    theme,
  }
}
