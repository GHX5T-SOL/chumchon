import { Buffer } from 'buffer';
global.Buffer = Buffer;

import structuredClone from '@ungap/structured-clone';
global.structuredClone = structuredClone;

import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "@/navigation/AppNavigator";
import { AppProviders } from "@/components/app-providers";
import { useAppTheme } from "@/components/app-theme";
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Orbitron_400Regular, Orbitron_500Medium, Orbitron_700Bold } from '@expo-google-fonts/orbitron';

// Register wallet standard for mobile wallet adapter
import { registerWalletStandard } from '@solana-mobile/wallet-standard-mobile';
registerWalletStandard();

export default function App() {
  const { theme } = useAppTheme();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    (async () => {
      try {
        await Font.loadAsync({
          Orbitron: Orbitron_400Regular,
          'Orbitron-Medium': Orbitron_500Medium,
          'Orbitron-Bold': Orbitron_700Bold,
        });
      } catch (e) {
        console.warn('Font load failed', e);
      } finally {
        setAppReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady]);

  if (!appReady) return null;

  return (
    <NavigationContainer theme={theme}>
      <AppProviders>
        <AppNavigator />
      </AppProviders>
    </NavigationContainer>
  );
}