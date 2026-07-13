// CurrencyInput
// Input numérico con prefijo "$" fijo, para campos de dinero (ej. routine_price
// del gym, precios de membresías, montos de pago). Soporta estado "disabled"
// con estilos propios para cuando el valor no se puede editar.
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';

export default function CurrencyInput({
  label,
  required = false,
  value,
  onChangeText,
  placeholder = '0',
  editable = true,
  styleContainer = null,
}) {
  return (
    <>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.requerido}> *</Text>}
      </Text>

      <View style={[styles.inputPrefix, styleContainer, !editable && styles.inputDisabled]}>
        <Text style={styles.prefix}>$</Text>

        <TextInput
          style={[styles.inputWithPrefix, !editable && styles.textDisabled]}
          placeholder={placeholder}
          placeholderTextColor={palette.mediumGray}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          editable={editable}
        />
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
  inputPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.lightGray,
    elevation: 1,
    height: 50,
  },
  inputDisabled: {
    backgroundColor: palette.lightGrayInput,
  },
  prefix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.darkBlue,
    paddingHorizontal: 15,
  },
  inputWithPrefix: {
    flex: 1,
    fontSize: 15,
    color: palette.black,
    height: '100%',
  },
  textDisabled: {
    color: palette.darkBlue,
    fontWeight: '600',
  },
});