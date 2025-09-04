import { useThemeColor } from '@/hooks/use-theme-color'
import { AppConfig } from '@/constants/app-config';

export function useWalletUiTheme() {
  const getColor = useThemeColor()
  const backgroundColor = getColor('background')
  const listBackgroundColor = getColor('background')
  const borderColor = getColor('border')
  const textColor = getColor('text')
  return {
    backgroundColor,
    listBackgroundColor,
    borderColor,
    textColor,
  }
}
