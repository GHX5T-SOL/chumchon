import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { PublicKey } from '@solana/web3.js'
import Snackbar from 'react-native-snackbar'
import { ActivityIndicator, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Buffer } from 'buffer'
import { Button } from '@react-navigation/elements'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useMutation } from '@tanstack/react-query'
import { useWalletUi } from '@/components/solana/use-wallet-ui'

function useSignMessage({ address }: { address: PublicKey }) {
  const { signMessage } = useWalletUi()
  return useMutation({
    mutationFn: async (input: { message: string }) => {
      return signMessage(Buffer.from(input.message, 'utf8')).then((signature) => signature.toString())
    },
  })
}

export function DemoFeatureSignMessage({ address }: { address: PublicKey }) {
  const signMessage = useSignMessage({ address })
  const [message, setMessage] = useState('Hello world')
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#333333' }, 'background') as string
  const textColor = useThemeColor({ light: '#CCCCCC', dark: '#ffffff' }, 'text') as string

  return (
    <AppView>
      <AppText type="subtitle">Sign message with connected wallet.</AppText>

      <View style={{ gap: 16 }}>
        <AppText>Message</AppText>
        <TextInput
          style={{
            backgroundColor,
            color: textColor,
            borderWidth: 1,
            borderRadius: 25,
            paddingHorizontal: 16,
          }}
          value={message}
          onChangeText={setMessage}
        />
        {signMessage.isPending ? (
          <ActivityIndicator />
        ) : (
          <Button
            disabled={signMessage.isPending || message?.trim() === ''}
            onPress={() => {
              signMessage
                .mutateAsync({ message })
                .then(() => {
                  console.log(`Signed message: ${message} with ${address.toString()}`)
                  Snackbar.show({
                    text: `Signed message with ${address.toString().slice(0, 4) + '...' + address.toString().slice(-4)}`,
                    duration: Snackbar.LENGTH_SHORT,
                  })
                })
                .catch((err) => console.log(`Error signing message: ${err}`, err))
            }}
            variant="filled"
          >
            Sign Message
          </Button>
        )}
      </View>
      {signMessage.isError ? (
        <AppText style={{ color: 'red', fontSize: 12 }}>{`${signMessage.error.message}`}</AppText>
      ) : null}
    </AppView>
  )
}
