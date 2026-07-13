// GoogleButton
// Botón específico para "Continuar con Google".
import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';

export default function GoogleButton({ onPress, title = 'Continuar con Google' }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      <Image source={require('../../../assets/google_Icono.png')} style={styles.icon} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.darkBlue,
    backgroundColor: palette.white,
    gap: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    fontWeight: 'bold',
    color: palette.darkBlue,
  },
});