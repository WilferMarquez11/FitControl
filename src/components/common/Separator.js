// src/components/common/Separator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

export default function Separator({ text, icon }) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  return (
    <View style={styles.container}>
      {/* Línea izquierda adaptable */}
      <View style={[styles.line, { backgroundColor: palette.lightGray }]} />

      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={palette.darkYellow}
          style={styles.content}
        />
      ) : (
        /* Texto central adaptable */
        <Text style={[styles.text, { color: tema.subTextColor }]}>{text}</Text>
      )}

      {/* Línea derecha adaptable */}
      <View style={[styles.line, { backgroundColor: palette.lightGray }]} />
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
  },
  content: {
    marginHorizontal: 10,
  },
  text: {
    marginHorizontal: 10,
    fontSize: 14,
  },
});