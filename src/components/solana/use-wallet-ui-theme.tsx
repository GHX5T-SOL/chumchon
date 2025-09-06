import { useThemeColor } from '@/hooks/use-theme-color'
import { AppConfig } from '@/constants/app-config';

export function useWalletUiTheme() {
  const backgroundColor = useThemeColor(undefined, 'background') as string
  const listBackgroundColor = useThemeColor(undefined, 'background') as string
  const borderColor = useThemeColor(undefined, 'border') as string
  const textColor = useThemeColor(undefined, 'text') as string
  return {
    backgroundColor,
    listBackgroundColor,
    borderColor,
    textColor,
  }
}
