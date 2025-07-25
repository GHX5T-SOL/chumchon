import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "@/navigation/AppNavigator";
import { AppProviders } from "@/components/app-providers";
import { useAppTheme } from "@/components/app-theme";

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