// src/components/common/LoadingScreen.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

export default function LoadingScreen({ mensaje = '' }) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: tema.backgroundColor }]}>
      {/* El spinner usa el amarillo de tu marca para mantener la identidad visual en ambos modos */}
      <ActivityIndicator size="large" color={palette.darkYellow} />
      
      {mensaje && mensaje.trim() !== '' ? (
        /* El texto cambia al subTextColor del tema actual para que tenga buen contraste */
        <Text style={[styles.loadingText, { color: tema.subTextColor }]}>{mensaje}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});