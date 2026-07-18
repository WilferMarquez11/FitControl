// src/components/forms/FormImagePicker.js
// Selector de imagen para formularios (ej. logo_url del gym, foto de perfil,
// evidencia de pago). Muestra un placeholder o la vista previa de la imagen
// seleccionada, y abre la galería del dispositivo al presionar.
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

export default function FormImagePicker({
  label,
  required = false,
  optional = false,
  value,
  onChange,
  size = 120,
}) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  // COMPROBACIÓN DEFINITIVA: Si el fondo no es blanco, activamos modo oscuro
  const esModoOscuro = tema.backgroundColor !== palette.white;

  // Configuración dinámica de colores basados en el tema
  const labelColor = tema.textColor || palette.darkBlue;
  const placeholderColor = esModoOscuro ? tema.subTextColor : palette.mediumGray;
  
  const containerBgColor = esModoOscuro 
    ? (tema.inputBackground || tema.cardBackground) 
    : palette.lightGrayInput;
    
  const containerBorderColor = tema.borderColor || palette.lightGray;
  const iconColor = esModoOscuro ? palette.darkYellow : palette.mediumGray;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      console.log('Permiso de galería denegado');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={[styles.label, { color: labelColor }]}>
        {label}
        {required && <Text style={styles.requerido}> *</Text>}
        {optional && <Text style={[styles.opcional, { color: placeholderColor }]}> (opcional)</Text>}
      </Text>

      <TouchableOpacity
        style={[
          styles.container, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            backgroundColor: containerBgColor,
            borderColor: containerBorderColor,
          }
        ]}
        onPress={pickImage}
        activeOpacity={0.7}
      >
        {value ? (
          <Image source={{ uri: value }} style={[styles.image, { borderRadius: size / 2 }]} />
        ) : (
          <View style={styles.placeholder}>
            <MaterialIcons name="add-a-photo" size={28} color={iconColor} />
            <Text style={[styles.placeholderText, { color: placeholderColor }]}>Agregar</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
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
  container: {
    alignSelf: 'center',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});