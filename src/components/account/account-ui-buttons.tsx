import { View } from 'react-native'
import { Button } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'

export function AccountUiButtons() {
  const navigation = useNavigation<any>()
  return (
    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
      <Button onPressIn={() => navigation.navigate('Airdrop')}>Airdrop</Button>
      <Button onPressIn={() => navigation.navigate('Send')}>Send</Button>
      <Button onPressIn={() => navigation.navigate('Receive')}>Receive</Button>
    </View>
  )
}
