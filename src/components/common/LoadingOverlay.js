// src/components/common/LoadingOverlay.js
import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

export default function LoadingOverlay({ visible, message = 'Cargando, por favor espera...' }) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* La tarjeta de carga se adapta al tema actual */}
        <View style={[
          styles.card, 
          { backgroundColor: tema.cardBackground, borderColor: tema.borderColor }
        ]}>
          {/* El spinner ahora usa tu color amarillo característico para que resalte */}
          <ActivityIndicator size="large" color={palette.darkYellow} />
          
          {/* El mensaje cambia de color según el tema */}
          <Text style={[styles.message, { color: tema.textColor }]}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: palette.overlay, // Mantiene el fondo oscurecido para bloquear la pantalla
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    paddingVertical: 28,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 220,
    borderWidth: 1, // Añadido borde sutil para que se distinga bien en modo oscuro
    elevation: 4,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  message: {
    marginTop: 14,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});