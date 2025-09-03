import React, { PropsWithChildren } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppView } from './app-view'
import type { ViewProps } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { theme } from '@/theme'
import { BackgroundSparklesLottie } from './animations/Lottie'

export function AppPage({ children, ...props }: PropsWithChildren<ViewProps>) {
  return (
    <AppView style={{ flex: 1 }} {...props}>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientMiddle, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: -100, left: -100, right: -100, bottom: -100, opacity: 0.25 }}
      />
      <BlurView intensity={30} tint="dark" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <BackgroundSparklesLottie />
      <SafeAreaView style={{ flex: 1, gap: 16, paddingHorizontal: 16 }}>{children}</SafeAreaView>
    </AppView>
  )
}
