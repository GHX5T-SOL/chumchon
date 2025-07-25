import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { ClusterProvider } from './cluster/cluster-provider'
import { SolanaProvider } from './solana/solana-provider'
import { AuthProvider } from './auth/auth-provider'

const queryClient = new QueryClient()

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ClusterProvider>
        <SolanaProvider>
          <AuthProvider>{children}</AuthProvider>
        </SolanaProvider>
      </ClusterProvider>
    </QueryClientProvider>
  )
}
