import React from 'react'
import { View, Text } from 'react-native'
import { theme } from '@/theme'

type Props = { selectedCluster?: { name: string } }

export default function ClusterUiGenesisHash({ selectedCluster }: Props) {
  // Placeholder for demo UI
  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={{ color: theme.colors.textSecondary }}>Genesis: demo-hash</Text>
    </View>
  )
}