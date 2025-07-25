import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { AppPage } from '@/components/app-page'
import { AccountUiButtons } from './account-ui-buttons'
import { AccountUiBalance } from './account-ui-balance'
import { AccountUiTokenAccounts } from './account-ui-token-accounts'
import { RefreshControl, ScrollView } from 'react-native'
import { useCallback, useState } from 'react'
import { useGetBalanceInvalidate } from './use-get-balance'
import { PublicKey } from '@solana/web3.js'
import { useGetTokenAccountsInvalidate } from './use-get-token-accounts'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'

export function AccountFeature() {
  const { account } = useWalletUi()
  const [refreshing, setRefreshing] = useState(false)
  const invalidateBalance = useGetBalanceInvalidate({ address: account?.publicKey as PublicKey })
  const invalidateTokenAccounts = useGetTokenAccountsInvalidate({ address: account?.publicKey as PublicKey })
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([invalidateBalance(), invalidateTokenAccounts()])
    setRefreshing(false)
  }, [invalidateBalance, invalidateTokenAccounts])

  return (
    <AppPage>
      {account ? (
        <ScrollView
          contentContainerStyle={{}}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
        >
          <AppView style={{ alignItems: 'center', gap: 4 }}>
            <AccountUiBalance address={account.publicKey} />
            <AppText style={{ opacity: 0.7 }}>{account.publicKey.toString().slice(0, 4) + '...' + account.publicKey.toString().slice(-4)}</AppText>
          </AppView>
          <AppView style={{ marginTop: 16, alignItems: 'center' }}>
            <AccountUiButtons />
          </AppView>
          <AppView style={{ marginTop: 16, alignItems: 'center' }}>
            <AccountUiTokenAccounts address={account.publicKey} />
          </AppView>
        </ScrollView>
      ) : (
        <AppView style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
          <AppText>Connect your wallet.</AppText>
          <WalletUiButtonConnect />
        </AppView>
      )}
    </AppPage>
  )
}
