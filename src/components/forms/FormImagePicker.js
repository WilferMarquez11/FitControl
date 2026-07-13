// FormImagePicker
// Selector de imagen para formularios (ej. logo_url del gym, foto de perfil,
// evidencia de pago). Muestra un placeholder o la vista previa de la imagen
// seleccionada, y abre la galería del dispositivo al presionar.
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';

export default function FormImagePicker({
  label,
  required = false,
  optional = false,
  value,
  onChange,
  size = 120,
}) {
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
    <>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.requerido}> *</Text>}
        {optional && <Text style={styles.opcional}> (opcional)</Text>}
      </Text>

      <TouchableOpacity
        style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}
        onPress={pickImage}
        activeOpacity={0.7}
      >
        {value ? (
          <Image source={{ uri: value }} style={[styles.image, { borderRadius: size / 2 }]} />
        ) : (
          <View style={styles.placeholder}>
            <MaterialIcons name="add-a-photo" size={28} color={palette.mediumGray} />
            <Text style={styles.placeholderText}>Agregar</Text>
          </View>
        )}
      </TouchableOpacity>
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
  container: {
    alignSelf: 'center',
    backgroundColor: palette.lightGrayInput,
    borderWidth: 1,
    borderColor: palette.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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
    color: palette.mediumGray,
    marginTop: 4,
  },
});