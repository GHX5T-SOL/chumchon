import { useWalletUi } from '@/components/solana/use-wallet-ui'
import React from 'react';
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'
import { WalletUiButtonDisconnect } from '@/components/solana/wallet-ui-button-disconnect'
import { AppConfig } from '@/constants/app-config';

export function SettingsUiAccount() {
  const { account } = useWalletUi()
  return (
    <AppView>
      <AppText type="subtitle">Account</AppText>
      {account ? (
        <AppView style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
          <AppText>Connected to {account.publicKey.toString().slice(0, 4) + '...' + account.publicKey.toString().slice(-4)}</AppText>
          <WalletUiButtonDisconnect />
        </AppView>
      ) : (
        <AppView style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
          <AppText>Connect your wallet.</AppText>
          <WalletUiButtonConnect />
        </AppView>
      )}
    </AppView>
  )
}
