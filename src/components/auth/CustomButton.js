// CustomButton
// Botón reutilizable para toda la app (Login, Registro, formularios, etc).
// variant "primary" = botón sólido (ej. "Iniciar Sesión"), variant "secondary" = outline (ej. "Crear Cuenta").
// Maneja su propio estado de loading mostrando un spinner en vez del texto.
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';

export default function CustomButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary'
  loading = false,
  marginTop = 12,
  marginBottom = 16,
}) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isPrimary ? styles.btnPrimary : styles.btnSecondary,
        loading && styles.btnDisabled,
        { marginTop, marginBottom }
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={isPrimary ? 0.8 : 0.7}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? palette.white : palette.darkBlue} />
      ) : (
        <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  btnPrimary: {
    backgroundColor: palette.darkBlue,
    elevation: 2,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: palette.darkBlue,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  textPrimary: {
    color: palette.white,
  },
  textSecondary: {
    color: palette.darkBlue,
  },
});