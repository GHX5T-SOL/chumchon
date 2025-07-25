import React from 'react'
import { AppText } from '../app-text'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { UiIconSymbol } from '../ui/ui-icon-symbol'
import { useWalletUiTheme } from './use-wallet-ui-theme'
import { AppConfig } from '@/constants/app-config';

export function BaseButton({ label, onPress }: { label: string; onPress?: () => void }) {
  const { backgroundColor, borderColor, textColor } = useWalletUiTheme()
  return (
    <TouchableOpacity
      style={[styles.trigger, { backgroundColor, borderColor, flexDirection: 'row', alignItems: 'center', gap: 8 }]}
      onPress={onPress}
    >
      <UiIconSymbol name="wallet.pass.fill" color={textColor} />
      <AppText>{label}</AppText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
  },
})
