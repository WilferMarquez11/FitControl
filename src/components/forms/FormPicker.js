// src/components/forms/FormPicker.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

export default function FormPicker({
  label,
  required = false,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  items = [],
  disabled = false,
}) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  // COMPROBACIÓN DEFINITIVA: Si el fondo no es blanco, activamos modo oscuro
  const esModoOscuro = tema.backgroundColor !== palette.white;

  // Configuración de colores dinámica
  const labelColor = tema.textColor || palette.darkBlue;
  
  // 🌟 FIX: Si está deshabilitado en modo oscuro, usamos el fondo de tus tarjetas para que no se vea el parche gris de Android
  const inputBgColor = disabled
    ? (esModoOscuro ? (tema.inputBackground || tema.cardBackground) : palette.lightGrayInput)
    : (tema.inputBackground || tema.cardBackground || palette.white);
    
  const inputBorderColor = tema.borderColor || palette.lightGray;
  const iconColor = esModoOscuro ? palette.darkYellow : palette.darkBlue;
  
  // Color del texto dinámico
  const textColor = disabled
    ? (esModoOscuro ? palette.mediumGray : palette.mediumGray) // Un gris suave que contraste bien en ambos modos
    : (value ? (tema.textColor || palette.black) : (tema.placeholderColor || palette.mediumGray));

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: labelColor }]}>
        {label}
        {required && <Text style={styles.requerido}> *</Text>}
      </Text>

      {/* Contenedor principal estilizado */}
      <View 
        style={[
          styles.pickerContainer, 
          { 
            backgroundColor: inputBgColor, 
            borderColor: inputBorderColor,
            elevation: esModoOscuro ? 0 : 1,
            opacity: disabled && !esModoOscuro ? 0.7 : 1, // Leve opacidad solo en modo claro si está deshabilitado
          }
        ]}
      >
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          dropdownIconColor={disabled ? (esModoOscuro ? tema.subTextColor : palette.mediumGray) : iconColor}
          enabled={!disabled}
          style={{
            color: textColor,
            backgroundColor: 'transparent', // 🌟 Forzamos transparente aquí para que use el fondo de nuestro View contenedor sin parches grises
          }}
          dropdownIconRippleColor={esModoOscuro ? palette.darkGray : palette.lightGray}
          mode="dropdown"
        >
          <Picker.Item 
            label={placeholder} 
            value="" 
            color={esModoOscuro ? tema.subTextColor : palette.mediumGray} 
            style={{ backgroundColor: inputBgColor }}
          />

          {items.map((item) => (
            <Picker.Item 
              key={item.value} 
              label={item.label} 
              value={item.value} 
              color={tema.textColor || palette.black}
              style={{ backgroundColor: inputBgColor }}
            />
          ))}
        </Picker>
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
  pickerContainer: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden', // Asegura que las esquinas redondeadas recorten cualquier residuo nativo
  },
});