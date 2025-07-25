import { useWalletUi } from '../solana/use-wallet-ui'
import { ellipsify } from '../../utils/ellipsify'
import { AppText } from '../app-text'
import { AppView } from '../app-view'
import { WalletUiButtonConnect } from '../solana/wallet-ui-button-connect'
import { WalletUiButtonDisconnect } from '../solana/wallet-ui-button-disconnect'
import { AppConfig } from '@/constants/app-config';

export function SettingsUiAccount() {
  const { account } = useWalletUi()
  return (
    <AppView>
      <AppText type="subtitle">Account</AppText>
      {account ? (
        <AppView style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
          <AppText>Connected to {ellipsify(account.publicKey.toString(), 8)}</AppText>
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
