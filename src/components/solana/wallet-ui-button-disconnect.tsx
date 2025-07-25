import { useWalletUi } from './use-wallet-ui'
import { BaseButton } from './base-button'
import React from 'react'
import { AppConfig } from '@/constants/app-config';

export function WalletUiButtonDisconnect({ label = 'Disconnect' }: { label?: string }) {
  const { disconnect } = useWalletUi()

  return <BaseButton label={label} onPress={() => disconnect()} />
}
