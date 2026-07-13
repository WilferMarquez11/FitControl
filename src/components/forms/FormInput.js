// FormInput
// Input genérico para formularios (fuera del contexto de auth), con label,
// indicador de campo requerido (*) u opcional. Se usa en GymSetupScreen y
// cualquier otro formulario de la app (ej. crear entrenador, membresías, etc).
import React from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';

export default function FormInput({
  label,
  required = false,
  optional = false,
  placeholder,
  value,
  onChangeText,
  ...props
}) {
  return (
    <>
      <Text style={styles.label}>
        {label}{' '}
        {required && <Text style={styles.requerido}>*</Text>}
        {optional && <Text style={styles.opcional}>(opcional)</Text>}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={palette.mediumGray}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
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
  opcional: {
    fontSize: 12,
    fontWeight: '400',
    color: palette.mediumGray,
  },
  input: {
    backgroundColor: palette.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
    borderWidth: 1,
    borderColor: palette.lightGray,
    color: palette.black,
    elevation: 1,
  },
});