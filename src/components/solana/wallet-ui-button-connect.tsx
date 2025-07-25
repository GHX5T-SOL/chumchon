import { useWalletUi } from './use-wallet-ui'
import { BaseButton } from './base-button'
import React from 'react'
import { AppConfig } from '@/constants/app-config';

export function WalletUiButtonConnect({ label = 'Connect' }: { label?: string }) {
  const { connect } = useWalletUi()

  return <BaseButton label={label} onPress={() => connect()} />
}
