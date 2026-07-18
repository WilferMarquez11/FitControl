// src/screens/auth/WelcomeScreen.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, ActivityIndicator } from 'react-native';
import { palette } from "../../theme/colors";
import { supabase } from '../../lib/supabase/supabaseConfig'; // 🌟 Conectamos con tu configuración nativa

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
    // Iniciamos las animaciones de entrada del Logo
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    // Función que evalúa la persistencia nativa de Supabase
    const evaluarSesionNativa = async () => {
      try {
        // 🌟 Leemos la sesión guardada automáticamente por tu cliente de Supabase
        const { data: { session } } = await supabase.auth.getSession();

        // Esperamos que se cumplan los 4 segundos requeridos de la animación visual
        setTimeout(() => {
          if (session?.user) {
            // 🌟 SI EL USUARIO NO CERRÓ SESIÓN: Salta directo al Panel
            console.log("➡️ Sesión persistente detectada del usuario:", session.user.id);
            navigation.replace('PanelOwner');
          } else {
            // 🌟 SI NO HAY SESIÓN / PRIMERA VEZ: Lo envía a loguearse
            console.log("➡️ No hay sesión previa. Redirigiendo a Login.");
            navigation.replace('Login');
          }
        }, 4000);

      } catch (error) {
        console.error('Error evaluando la sesión en el Welcome:', error);
        // Si algo raro ocurre en el dispositivo, por seguridad va a Login al expirar el tiempo
        setTimeout(() => {
          navigation.replace('Login');
        }, 4000);
      }
    };

    evaluarSesionNativa();
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