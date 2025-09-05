import React, { forwardRef } from 'react'
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native'

type LottieProps = {
  source: any
  autoplay?: boolean
  loop?: boolean
  style?: StyleProp<ViewStyle>
}

export const Lottie = forwardRef<any, LottieProps>(function LottieBase({ style }, ref) {
  return (
    <View ref={ref as any} style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      <ActivityIndicator size="large" />
    </View>
  )
})

export function LoaderLottie({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <Lottie style={[{ width: 140, height: 140 }, style]} />
  )
}

export function SuccessLottie({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <Lottie style={[{ width: 120, height: 120 }, style]} />
  )
}

export function WalletSuccessLottie({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <Lottie style={[{ width: 160, height: 160 }, style]} />
  )
}

export function BackgroundSparklesLottie({ style, opacity = 0.18 }: { style?: StyleProp<ViewStyle>; opacity?: number }) {
  return (
    <Lottie style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity }, style]} />
  )
}


