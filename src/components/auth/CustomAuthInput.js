import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';

export default function CustomAuthInput({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  isPassword = false,
  marginBottom = 14,
  iconColor: customIconColor,
  color: customColor,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { tema } = useTheme();

  // COMPROBACIÓN DEFINITIVA: Si el fondo no es blanco o es el color oscuro, activamos modo oscuro
  const esModoOscuro = tema.backgroundColor !== palette.white;

  const inputBgColor = tema.cardBackground;
  const inputBorderColor = tema.borderColor;
  const textColor = tema.textColor;
  const placeholderColor = esModoOscuro ? tema.subTextColor : palette.mediumGray;
  
  // Forzamos el amarillo si detecta que el fondo cambió
  const finalIconColor = esModoOscuro ? palette.darkYellow : palette.darkBlue;

  return (
    <View 
      style={[
        styles.inputContainer, 
        { 
          backgroundColor: inputBgColor, 
          borderColor: inputBorderColor,
          marginBottom,
          shadowColor: tema.backgroundColor,
          elevation: esModoOscuro ? 0 : 1,
        }
      ]}
    >
      <MaterialIcons 
        name={icon} 
        size={22} 
        color={finalIconColor} 
        style={styles.icon} 
      />
      
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword ? !showPassword : secureTextEntry}
        keyboardAppearance={esModoOscuro ? 'dark' : 'light'}
        {...props}
      />

      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={22}
            color={finalIconColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    width: '100%',
    height: 50,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
});