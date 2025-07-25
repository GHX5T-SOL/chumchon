import { AppView } from '../app-view'
import { AppText } from '../app-text'
import { DemoFeatureSignMessage } from './demo-feature-sign-message'
import { useWalletUi } from '../solana/use-wallet-ui'
import { PublicKey } from '@solana/web3.js'
import * as React from 'react'

export function DemoFeature() {
  const { account } = useWalletUi()
  return (
    <AppView>
      <AppText type="subtitle">Demo page</AppText>
      <AppText>Start building your features here.</AppText>
      <DemoFeatureSignMessage address={account?.publicKey as PublicKey} />
    </AppView>
  )
}
