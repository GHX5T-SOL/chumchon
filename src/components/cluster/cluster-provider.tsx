import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { AppConfig } from '@/constants/app-config';
import { Cluster } from '@/components/cluster/cluster';
import { ClusterNetwork } from '@/components/cluster/cluster-network';

interface ClusterProviderState {
  selectedCluster: Cluster;
  setSelectedCluster: (cluster: Cluster) => void;
  clusters: Cluster[];
}

const ClusterContext = createContext<ClusterProviderState | undefined>(undefined);

export function ClusterProvider({ children }: { children: ReactNode }) {
  const [selectedCluster, setSelectedCluster] = useState<Cluster>(AppConfig.clusters[0]);
  const clusters = AppConfig.clusters;

  const value = useMemo(
    () => ({ selectedCluster, setSelectedCluster, clusters }),
    [selectedCluster, clusters]
  );

  return <ClusterContext.Provider value={value}>{children}</ClusterContext.Provider>;
}

export function useCluster(): ClusterProviderState {
  const context = useContext(ClusterContext);
  if (!context) {
    throw new Error('useCluster must be used within a ClusterProvider');
  }
  return context;
} 