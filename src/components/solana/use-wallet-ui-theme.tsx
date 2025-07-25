import { useThemeColor } from '@/hooks/use-theme-color'
import { AppConfig } from '@/constants/app-config';

export function useWalletUiTheme() {
  const backgroundColor = useThemeColor({}, 'background')
  const listBackgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({}, 'border')
  const textColor = useThemeColor({}, 'text')
  return {
    backgroundColor,
    listBackgroundColor,
    borderColor,
    textColor,
  }
}
