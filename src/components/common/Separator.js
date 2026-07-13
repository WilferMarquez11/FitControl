// Separator
// Línea divisoria reutilizable con un texto o ícono en el centro (ej. "O" entre
// "Continuar con Google" y los inputs de correo/contraseña en Login).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';

export default function Separator({ text, icon }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />

      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={palette.darkYellow}
          style={styles.content}
        />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}

      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: palette.lightGray,
  },
  content: {
    marginHorizontal: 10,
  },
  text: {
    marginHorizontal: 10,
    fontSize: 14,
    color: palette.mediumGray,
  },
});