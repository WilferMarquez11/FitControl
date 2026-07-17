import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  marginTop = 12,
  marginBottom = 16,
}) {
  const { tema } = useTheme();
  
  const isPrimary = variant === 'primary';
  
  // COMPROBACIÓN DEFINITIVA: Basada en el cambio real del fondo
  const esModoOscuro = tema.backgroundColor !== palette.white;

  const primaryBgColor = esModoOscuro ? palette.darkYellow : palette.darkBlue;
  const secondaryBorderColor = esModoOscuro ? palette.darkYellow : palette.darkBlue;

  const primaryTextColor = esModoOscuro ? palette.black : palette.white;
  // 🌟 CAMBIO: El texto del botón secundario en modo oscuro ahora es blanco
  const secondaryTextColor = esModoOscuro ? palette.white : palette.darkBlue;

  const spinnerColor = isPrimary ? primaryTextColor : secondaryTextColor;

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isPrimary 
          ? [styles.btnPrimary, { backgroundColor: primaryBgColor }] 
          : [styles.btnSecondary, { borderColor: secondaryBorderColor }],
        loading && styles.btnDisabled,
        { 
          marginTop, 
          marginBottom,
          shadowColor: esModoOscuro ? 'transparent' : palette.black,
          elevation: esModoOscuro ? 0 : isPrimary ? 2 : 0,
        }
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={isPrimary ? 0.8 : 0.7}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <Text 
          style={[
            styles.text, 
            isPrimary ? { color: primaryTextColor } : { color: secondaryTextColor }
          ]}
        >
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});