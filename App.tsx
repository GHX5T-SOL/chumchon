import React from "react";
import { AuthProvider } from "./src/contexts/AuthProvider";
import { SolanaProvider } from "./src/contexts/SolanaProvider";
import AppNavigator from "./src/navigation/AppNavigator";
// import theme from "./src/theme"; // Uncomment if you use a ThemeProvider
// import { ThemeProvider } from "styled-components/native";

export default function App() {
  return (
    <AuthProvider>
      <SolanaProvider>
        {/* Uncomment below if you use a ThemeProvider */}
        {/* <ThemeProvider theme={theme}> */}
          <AppNavigator />
        {/* </ThemeProvider> */}
      </SolanaProvider>
    </AuthProvider>
  );
}