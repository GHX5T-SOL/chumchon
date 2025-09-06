// Replaced expo-router Link with a minimal external link handler for React Navigation apps
import { Platform, Pressable, Text } from 'react-native'
import { openBrowserAsync } from 'expo-web-browser'
import type { ComponentProps } from 'react'

export type AppExternalLinkProps = { href: string; children?: React.ReactNode }

export function AppExternalLink({ href, ...rest }: AppExternalLinkProps) {
  return (
    // For native, open in in-app browser; for web, fall back to regular anchor
    Platform.OS === 'web' ? (
      // @ts-ignore - allow spreading unknown props in web anchor
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {rest.children ?? href}
      </a>
    ) : (
      <Pressable onPress={() => openBrowserAsync(href)} accessibilityRole="link">
        {typeof rest.children === 'string' ? (
          <Text>{rest.children}</Text>
        ) : (
          rest.children
        )}
      </Pressable>
    )
  )
}
