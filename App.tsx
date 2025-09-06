import 'react-native-reanimated';
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
// Defer wallet standard registration to after mount to avoid top-level side effects blocking splash

export default function App() {
  const { theme } = useAppTheme();
  const [appReady, setAppReady] = useState(false);
  const [splashSafety, setSplashSafety] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Safety timeout to ensure we never hang indefinitely on splash
        const safety = setTimeout(() => setSplashSafety(true), 4000);

        // Load fonts
        await Font.loadAsync({
          Orbitron: Orbitron_400Regular,
          'Orbitron-Medium': Orbitron_500Medium,
          'Orbitron-Bold': Orbitron_700Bold,
        });
        
        // Add a small delay to ensure smooth transition
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn('Font load failed', e);
      } finally {
        // Tell the application to render
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appReady || splashSafety) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady, splashSafety]);

  // Defer wallet registration until after first render
  useEffect(() => {
    (async () => {
      try {
        const { registerWalletStandard } = await import('@solana-mobile/wallet-standard-mobile');
        registerWalletStandard();
      } catch (e) {
        console.warn('Wallet standard registration failed', e);
      }
    })();
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <NavigationContainer theme={theme}>
      <AppProviders>
        <AppNavigator />
      </AppProviders>
    </NavigationContainer>
  );
}