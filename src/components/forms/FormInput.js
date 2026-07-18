// src/components/forms/FormInput.js
// Input genérico para formularios (fuera del contexto de auth), con label,
// indicador de campo requerido (*) u opcional. Se usa en GymSetupScreen y
// cualquier otro formulario de la app (ej. crear entrenador, membresías, etc).
import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

export default function FormInput({
  label,
  required = false,
  optional = false,
  placeholder,
  value,
  onChangeText,
  ...props
}) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  // COMPROBACIÓN DEFINITIVA: Si el fondo no es blanco, activamos modo oscuro
  const esModoOscuro = tema.backgroundColor !== palette.white;

  const inputBgColor = tema.inputBackground || tema.cardBackground || palette.white;
  const inputBorderColor = tema.borderColor || palette.lightGray;
  const textColor = tema.textColor || palette.black;
  const placeholderColor = esModoOscuro ? tema.subTextColor : palette.mediumGray;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: tema.textColor || palette.darkBlue }]}>
        {label}{' '}
        {required && <Text style={styles.requerido}>*</Text>}
        {optional && <Text style={[styles.opcional, { color: placeholderColor }]}>(opcional)</Text>}
      </Text>

      {/* 🌟 Mismo truco: El contenedor maneja el fondo, borde y elevación */}
      <View 
        style={[
          styles.inputContainer, 
          { 
            backgroundColor: inputBgColor, 
            borderColor: inputBorderColor,
            elevation: esModoOscuro ? 0 : 1,
          }
        ]}
      >
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={value}
          onChangeText={onChangeText}
          keyboardAppearance={esModoOscuro ? 'dark' : 'light'}
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  requerido: {
    color: palette.red,
  },
  opcional: {
    fontSize: 12,
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    width: '100%',
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
});