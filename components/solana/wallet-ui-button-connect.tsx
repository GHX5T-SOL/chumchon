import { useWalletUi } from './use-wallet-ui'
import { BaseButton } from './base-button'
import React from 'react'

export function WalletUiButtonConnect({ label = 'Connect' }: { label?: string }) {
  const { connect } = useWalletUi()

  return <BaseButton label={label} onPress={() => connect()} />
}
