// FormButtons
// Par de botones (Guardar/Cancelar) para el pie de formularios, ej. GymSetupScreen
// y cualquier otro formulario con acción de guardar + acción de cancelar/volver.
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';

export default function FormButtons({
  onSave,
  onCancel,
  saveText = 'Registrar',
  cancelText = 'Cancelar',
}) {
  return (
    <View>
      <TouchableOpacity style={styles.btnSave} onPress={onSave}>
        <Text style={styles.btnText}>{saveText}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnCancel} onPress={onCancel}>
        <Text style={styles.btnText}>{cancelText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btnSave: {
    backgroundColor: palette.darkBlue,
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
    color: palette.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});