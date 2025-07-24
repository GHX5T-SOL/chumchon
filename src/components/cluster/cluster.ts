import { ClusterNetwork } from './cluster-network'

export interface Cluster {
  id: string
  name: string
  endpoint: string
  network: ClusterNetwork
} 