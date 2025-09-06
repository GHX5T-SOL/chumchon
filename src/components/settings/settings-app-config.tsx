import { AppConfig } from '@/constants/app-config'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { AppExternalLink, AppExternalLinkProps } from '@/components/app-external-link'

export function SettingsAppConfig() {
  return (
    <AppView>
      <AppText type="subtitle">App Config</AppText>
      <AppText type="default">
        Name <AppText type="defaultSemiBold">{AppConfig.appName}</AppText>
      </AppText>
      <AppText type="default">
        URL{' '}
        <AppText type="link">
          <AppExternalLink href={AppConfig.appUri as AppExternalLinkProps['href']}>{AppConfig.appUri}</AppExternalLink>
        </AppText>
      </AppText>
    </AppView>
  )
}
