// Componente reutilizable de input para pantallas de autenticación (Login, Register, Recover Password)
// TextInput + ícono + estilos en cada pantalla de auth
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';

export default function CustomAuthInput({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  isPassword = false,
  marginBottom = 14,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.inputContainer, { marginBottom }]}>
      <MaterialIcons name={icon} size={22} color={palette.darkBlue} style={styles.icon} />
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={palette.mediumGray}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword ? !showPassword : secureTextEntry}
        {...props}
      />

      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={22}
            color={palette.darkBlue}
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
    borderColor: palette.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    width: '100%',
    height: 50,
    backgroundColor: palette.white,
    elevation: 1,
    shadowColor: palette.darkBlue,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: palette.black,
    height: '100%',
  },
});