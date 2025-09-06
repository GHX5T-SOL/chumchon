import React from 'react'
import { View, Text } from 'react-native'
import { theme } from '@/theme'

type Props = { selectedCluster?: { name: string; endpoint?: string } }

export default function ClusterUiVersion({ selectedCluster }: Props) {
  const name = selectedCluster?.name ?? 'Unknown'
  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={{ color: theme.colors.text }}>Cluster: {name}</Text>
    </View>
  )
}