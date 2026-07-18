// src/components/forms/CurrencyInput.js
// Input numérico con prefijo "$" fijo, para campos de dinero (ej. routine_price
// del gym, precios de membresías, montos de pago). Soporta estado "disabled"
// con estilos propios para cuando el valor no se puede editar.
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

export default function CurrencyInput({
  label,
  required = false,
  value,
  onChangeText,
  placeholder = '0',
  editable = true,
  styleContainer = null,
}) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  // COMPROBACIÓN DEFINITIVA: Si el fondo no es blanco, activamos modo oscuro
  const esModoOscuro = tema.backgroundColor !== palette.white;

  // Asignación de colores dinámicos basados en el tema
  const labelColor = tema.textColor || palette.darkBlue;
  const inputBgColor = editable 
    ? (tema.inputBackground || tema.cardBackground || palette.white)
    : (esModoOscuro ? palette.darkGray : palette.lightGrayInput); // Color de fondo si está deshabilitado
    
  const inputBorderColor = tema.borderColor || palette.lightGray;
  const textColor = editable 
    ? (tema.textColor || palette.black)
    : (esModoOscuro ? palette.lightGray : palette.darkBlue); // Color de texto si está deshabilitado

  const prefixColor = esModoOscuro ? palette.darkYellow : palette.darkBlue;
  const placeholderColor = esModoOscuro ? tema.subTextColor : palette.mediumGray;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: labelColor }]}>
        {label}
        {required && <Text style={styles.requerido}> *</Text>}
      </Text>

      {/* Contenedor que maneja bordes, fondos y estructura de fila */}
      <View 
        style={[
          styles.inputPrefix, 
          styleContainer, 
          { 
            backgroundColor: inputBgColor, 
            borderColor: inputBorderColor,
            elevation: esModoOscuro ? 0 : 1,
          }
        ]}
      >
        <Text style={[styles.prefix, { color: prefixColor }]}>$</Text>

        <TextInput
          style={[
            styles.inputWithPrefix, 
            { color: textColor },
            !editable && styles.textDisabled
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          editable={editable}
          keyboardAppearance={esModoOscuro ? 'dark' : 'light'} // Estilo del teclado nativo
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
  inputPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 50,
  },
  prefix: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  inputWithPrefix: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  textDisabled: {
    fontWeight: '600',
  },
});