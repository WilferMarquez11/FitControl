// src/components/common/ProfileAvatarHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

/**
 * Cabecera de perfil con avatar interactivo para subir el logo, email y rol debajo.
 * @param {string} imageUrl - URL de la imagen de perfil o logo
 * @param {string} name - Nombre para extraer la letra inicial en caso de no haber imagen
 * @param {string} role - El rol del usuario (ej: PROPIETARIO)
 * @param {string} email - Correo del usuario para mostrarlo centrado bajo la foto
 * @param {boolean} uploading - Estado de carga al subir la imagen
 * @param {function} onImagePress - Función que se ejecuta al presionar el avatar
 */
export default function ProfileAvatarHeader({ 
  imageUrl, 
  name, 
  role,
  email,
  uploading = false, 
  onImagePress 
}) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();
  const primeraLetra = name ? name.charAt(0).toUpperCase() : 'G';

  return (
    <View style={[
      styles.avatarCard, 
      { backgroundColor: tema.cardBackground, borderColor: tema.borderColor }
    ]}>
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={onImagePress}
        disabled={uploading}
        style={styles.avatarButton}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={[styles.avatarImage, { backgroundColor: tema.borderColor }]} />
        ) : (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{primeraLetra}</Text>
          </View>
        )}
        
        {uploading ? (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="small" color={palette.white} />
          </View>
        ) : (
          <View style={[styles.editPhotoIcon, { borderColor: tema.cardBackground }]}>
            <MaterialCommunityIcons name="camera" size={16} color={palette.white} />
          </View>
        )}
      </TouchableOpacity>

      {/* Correo Electrónico del Usuario */}
      {email ? (
        <Text style={[styles.profileEmail, { color: tema.textColor }]} numberOfLines={1} adjustsFontSizeToFit>
          {email.toLowerCase()}
        </Text>
      ) : null}

      {/* Rol justo debajo */}
      <Text style={[styles.profileRole, { color: tema.subTextColor }]}>{role?.toUpperCase() || 'PROPIETARIO'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarCard: {
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16, // Añadido para dar margen lateral al email largo
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    elevation: 2,
    shadowColor: palette.backgroundColor, // Color de sombra para Android
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatarButton: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: palette.darkYellow, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: palette.white,
    fontSize: 36,
    fontWeight: 'bold',
  },
  editPhotoIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: palette.darkYellow, 
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 45,
    backgroundColor: palette.backgroundColor, 
    opacity: 0.7,                     
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  profileRole: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});