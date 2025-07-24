import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AppProviders } from "./components/app-providers";

export default function App() {
  return (
    <NavigationContainer>
      <AppProviders>
        <AppNavigator />
      </AppProviders>
    </NavigationContainer>
  );
}