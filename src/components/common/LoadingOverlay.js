// LoadingOverlay
// Modal de carga a pantalla completa con fondo semi-transparente, spinner centrado
// y un mensaje debajo (ej. "Creando tu cuenta, por favor espera..."). Se usa mientras
// se espera una respuesta async (Supabase, fetch, etc.) para bloquear la interacción del usuario.
import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';

export default function LoadingOverlay({ visible, message = 'Cargando, por favor espera...' }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color={palette.darkBlue} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: palette.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 12,
    paddingVertical: 28,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 220,
    elevation: 4,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  message: {
    marginTop: 14,
    fontSize: 14,
    color: palette.darkBlue,
    textAlign: 'center',
    fontWeight: '500',
  },
});