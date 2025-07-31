import { Buffer } from 'buffer';
global.Buffer = Buffer;

import structuredClone from '@ungap/structured-clone';
global.structuredClone = structuredClone;

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "@/navigation/AppNavigator";
import { AppProviders } from "@/components/app-providers";
import { useAppTheme } from "@/components/app-theme";

// Register wallet standard for mobile wallet adapter
import { registerWalletStandard } from '@solana-mobile/wallet-standard-mobile';
registerWalletStandard();

export default function App() {
  const { theme } = useAppTheme();
  return (
    <NavigationContainer theme={theme}>
      <AppProviders>
        <AppNavigator />
      </AppProviders>
    </NavigationContainer>
  );
}