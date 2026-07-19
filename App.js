import React from 'react';
import { StatusBar } from 'expo-status-bar'; // 🌟 1. Importamos la barra de estado de Expo
import AppNavigator from './src/navigation/AppNavigator';
import * as NavigationBar from 'expo-navigation-bar';

// IMPORTA EL PROVIDER Y TU HOOK DE TEMA
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function AppContent() {
  // 🌟 Usamos las variables reales de tu Context: 'tema' (el objeto de colores) y 'modoOscuro' (true/false)
  const { tema, modoOscuro } = useTheme();

  useEffect(() => {
    // 🌟 Aplicamos el color de fondo usando directamente tu objeto 'tema'
    NavigationBar.setBackgroundColorAsync(tema.backgroundColor);

    // Configuramos los botones físicos de abajo según el booleano 'modoOscuro'
    NavigationBar.setButtonStyleAsync(modoOscuro ? 'light' : 'dark');
  }, [modoOscuro, tema]);

  return (
    <>
      {/* La barra superior de la batería también cambia según el booleano 'modoOscuro' */}
      <StatusBar style={modoOscuro ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}