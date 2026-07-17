// src/screens/auth/WelcomeScreen.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, ActivityIndicator } from 'react-native';
import { palette } from "../../theme/colors";

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

export default function WelcomeScreen({ navigation }) {
  const { tema } = useTheme();
  
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  // Comprobación definitiva basada en el fondo real
  const esModoOscuro = tema.backgroundColor !== palette.white;
  const themeKey = esModoOscuro ? 'dark' : 'light';

  // Selección del logo según el modo
  const logoSource = esModoOscuro
    ? require('../../../assets/2LogoPrincipal.png') // 👈 Logo para modo oscuro
    : require('../../../assets/1LogoPrincipal.png'); // 👈 Logo para modo claro

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 4000); // 4 segundos antes de navegar a la pantalla de Login
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View key={`welcome-${themeKey}`} style={[styles.container, { backgroundColor: tema.backgroundColor }]}>
      <View style={styles.logoContainer}>
        <Animated.Image
          source={logoSource}
          style={[styles.logoImage, { opacity, transform: [{ scale }] }]}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color={palette.darkYellow} style={styles.spinner} />
        
        {/* 🌟 Color de texto adaptable */}
        <Text style={[styles.loadingText, { color: tema.textColor }]}>
          Cargando tu experiencia...
        </Text>
      </View>
      
      <View style={styles.footer}>
        {/* 🌟 Color de texto adaptable */}
        <Text style={[styles.byText, { color: tema.subTextColor }]}>By</Text>
        <Text style={styles.companyText}>WO Devs</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 450,
    height: 450,
  },
  spinner: {
    marginTop: 30,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 14,
  },
  footer: {
    marginBottom: 100,
    alignItems: 'center',
  },
  byText: {
    fontSize: 16,
  },
  companyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.darkYellow,
  },
});