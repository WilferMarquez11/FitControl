// src/theme/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from './colors';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [loadingTheme, setLoadingTheme] = useState(true);

  useEffect(() => {
    const cargarTema = async () => {
      try {
        const guardado = await AsyncStorage.getItem('modoOscuro');
        if (guardado !== null) {
          setModoOscuro(JSON.parse(guardado));
        }
      } catch (e) {
        console.error('Error cargando tema:', e);
      } finally {
        setLoadingTheme(false);
      }
    };
    cargarTema();
  }, []);

  const toggleTema = async () => {
    try {
      const nuevo = !modoOscuro;
      setModoOscuro(nuevo);
      await AsyncStorage.setItem('modoOscuro', JSON.stringify(nuevo));
    } catch (e) {
      console.error('Error guardando tema:', e);
    }
  };

  const tema = modoOscuro ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ tema, modoOscuro, toggleTema, loadingTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Este es el hook mejorado que usarás en tus pantallas
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser utilizado dentro de un ThemeProvider');
  }
  return context;
}