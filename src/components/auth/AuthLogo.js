// AuthLogo
// Logo reutilizable para las pantallas de autenticación (Login, Register, Welcome, Recover).
// Centraliza la ruta de la imagen y el tamaño, para no repetir el mismo <Image> en cada pantalla.
import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function AuthLogo({ width = '100%', height = 150, marginBottom = 10 }) {
  return (
    <Image
      source={require('../../../assets/LogoIcon.png')}
      style={[styles.logo, { width, height, marginBottom }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    // el width/height/marginBottom se pasan por props para poder ajustarlos por pantalla
  },
});