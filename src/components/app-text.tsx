import { StyleSheet, Text, type TextProps } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'
import { theme } from '@/theme'

export type AppTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link'
}

export function AppText({ style, lightColor, darkColor, type = 'default', ...rest }: AppTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text') as string

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: theme.typography.fontFamily.regular,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: theme.typography.fontFamily.medium,
  },
  title: {
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.bold,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.medium,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: theme.typography.fontFamily.medium,
  },
})
