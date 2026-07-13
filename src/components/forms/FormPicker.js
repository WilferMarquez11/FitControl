// FormPicker
// Selector tipo dropdown para formularios (ej. país, departamento, ciudad,
// tipo de documento). Se usa en GymSetupScreen y cualquier otro formulario
// que necesite elegir de una lista fija de opciones.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { palette } from '../../theme/colors';

export default function FormPicker({
  label,
  required = false,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  items = [],
}) {
  return (
    <>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.requerido}> *</Text>}
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          dropdownIconColor={palette.darkBlue}
          style={{
            color: value ? palette.black : palette.mediumGray,
          }}
        >
          <Picker.Item label={placeholder} value="" />

          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.darkBlue,
    marginBottom: 6,
    marginTop: 10,
  },
  requerido: {
    color: palette.red,
  },
  pickerContainer: {
    backgroundColor: palette.white,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.lightGray,
    elevation: 1,
  },
});