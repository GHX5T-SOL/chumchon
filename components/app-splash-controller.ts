import { SplashScreen } from 'expo-router'
import { useAuth } from './auth/auth-provider'

export function AppSplashController() {
  const { isLoading } = useAuth()

  if (!isLoading) {
    SplashScreen.hideAsync()
  }

  return null
}
