import React from 'react'
// Use expo-barcode-scanner QR component to avoid missing react-qr-code types in native
import { Text } from 'react-native'
import { AppView } from './app-view'
import { ViewProps } from 'react-native'

export function AppQrCode({ value, style = {}, ...props }: ViewProps & { value: string }) {
  return (
    <AppView style={{ backgroundColor: 'white', marginHorizontal: 'auto', padding: 16 }} {...props}>
      {/* Placeholder: expo-barcode-scanner is primarily for scanning; to render a QR, fallback to text */}
      <Text selectable accessibilityLabel="QR Value">{value}</Text>
    </AppView>
  )
}
