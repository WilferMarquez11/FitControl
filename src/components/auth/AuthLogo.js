import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

export default function AuthLogo({ width = '100%', height = 150, marginBottom = 10 }) {
  const { tema } = useTheme();

  // COMPROBACIÓN DEFINITIVA: Si el fondo no es blanco, activamos modo oscuro
  const esModoOscuro = tema.backgroundColor !== palette.white;

  // Seleccionamos la imagen correcta para cada modo
  const logoSource = esModoOscuro 
    ? require('../../../assets/LogoIcon2.png') 
    : require('../../../assets/LogoIcon.png');

  return (
    <Image
      source={logoSource}
      style={[styles.logo, { width, height, marginBottom }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    // Las dimensiones se aplican dinámicamente desde las props
  },
});