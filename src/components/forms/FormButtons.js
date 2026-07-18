// src/components/forms/FormButtons.js
// Par de botones (Guardar/Cancelar) para el pie de formularios, ej. GymSetupScreen
// y cualquier otro formulario con acción de guardar + acción de cancelar/volver.
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

export default function FormButtons({
  onSave,
  onCancel,
  saveText = 'Registrar',
  cancelText = 'Cancelar',
}) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  // COMPROBACIÓN DEFINITIVA: Si el fondo no es blanco, activamos modo oscuro
  const esModoOscuro = tema.backgroundColor !== palette.white;

  // Colores dinámicos del botón de guardar según el modo
  const saveBgColor = esModoOscuro ? palette.darkYellow : palette.darkBlue;
  const saveTextColor = esModoOscuro ? palette.black : palette.white;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.btnSave, { backgroundColor: saveBgColor }]} 
        onPress={onSave}
        activeOpacity={0.8}
      >
        <Text style={[styles.btnText, { color: saveTextColor }]}>{saveText}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.btnCancel} 
        onPress={onCancel}
        activeOpacity={0.8}
      >
        <Text style={[styles.btnText, { color: palette.white }]}>{cancelText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  btnSave: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  btnCancel: {
    backgroundColor: palette.red,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});