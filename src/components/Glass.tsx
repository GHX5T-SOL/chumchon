import React, { PropsWithChildren } from 'react'
import { View, Text, TouchableOpacity, ViewStyle, TextStyle, StyleSheet } from 'react-native'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { theme } from '@/theme'

export function GlassView({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return (
    <View style={[styles.glassContainer, style]}> 
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />
      {children}
    </View>
  )
}

export function NeonText({ children, style }: PropsWithChildren<{ style?: TextStyle }>) {
  return <Text style={[styles.neonText, style]}>{children}</Text>
}

export function HoloButton({ title, onPress, style }: { title: string; onPress?: () => void; style?: ViewStyle }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.holoButton, style]} activeOpacity={0.85}>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
      <Text style={styles.holoButtonText}>{title}</Text>
    </TouchableOpacity>
  )
}

export function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  glassContainer: {
    overflow: 'hidden',
    borderRadius: theme.roundness * 1.5,
    borderWidth: 1,
    borderColor: theme.colors.accent + '66',
  },
  neonText: {
    color: theme.colors.accent,
    textShadowColor: theme.colors.accent,
    textShadowRadius: 12,
  },
  holoButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.accent + '99',
  },
  holoButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
})


