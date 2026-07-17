import React from 'react';
import AppNavigator from './src/navigation/AppNavigator'; 

// 🌟 IMPORTA EL PROVIDER (Verifica que la ruta apunte bien a tu ThemeContext)
import { ThemeProvider } from './src/theme/ThemeContext'; 

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}