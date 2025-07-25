import { AppText } from '../app-text'
import { useCluster } from '../cluster/cluster-provider'
import { ClusterUiVersion } from '../cluster/cluster-ui-version'
import { AppDropdown } from '../app-dropdown'
import { ClusterUiGenesisHash } from '../cluster/cluster-ui-genesis-hash'
import { AppView } from '../app-view'
import { AppConfig } from '@/constants/app-config';

export function SettingsUiCluster() {
  const { selectedCluster, clusters, setSelectedCluster } = useCluster()
  return (
    <AppView>
      <AppText type="subtitle">Cluster</AppText>
      <ClusterUiVersion selectedCluster={selectedCluster} />
      <ClusterUiGenesisHash selectedCluster={selectedCluster} />
      <AppDropdown
        items={clusters.map((c) => c.name)}
        selectedItem={selectedCluster.name}
        selectItem={(name) => setSelectedCluster(clusters.find((c) => c.name === name)!)}
      />
    </AppView>
  )
}
