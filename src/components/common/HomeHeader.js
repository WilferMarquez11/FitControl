// src/components/common/HomeHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors'; 

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

export default function HomeHeader({
  nombreUsuario = 'Usuario',
  logoUrl = null,
  onNotificationPress,
  onPressProfile, // 👈 Recibimos la función desde el PanelOwnerScreen
}) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  const nombreLimpio = nombreUsuario && nombreUsuario.trim() ? nombreUsuario.toUpperCase() : 'USUARIO';
  const primeraLetra = nombreLimpio.charAt(0).toUpperCase();
  const tieneLogoValido = logoUrl && typeof logoUrl === 'string' && logoUrl.trim() !== '';

  return (
    <View style={styles.outerContainer}>
      {/* Tarjeta contenedora adaptativa */}
      <View style={[
        styles.headerContainer, 
        { backgroundColor: tema.cardBackground, borderColor: tema.borderColor }
      ]}>
        
        {/* TOQUE EN EL PERFIL (IZQUIERDA) */}
        <TouchableOpacity 
          style={styles.headerLeft} 
          activeOpacity={0.7}
          onPress={onPressProfile} // 👈 Al tocar el nombre o avatar ejecuta la navegación
        >
          {tieneLogoValido ? (
            <Image 
              source={{ uri: logoUrl }} 
              style={[styles.logoImage, { backgroundColor: tema.borderColor }]} 
              resizeMode="cover"
              fadeDuration={0}
              onError={(e) => console.log("❌ Error cargando imagen en el Header:", e.nativeEvent.error)}
            />
          ) : (
            // Círculo de avatar consistente con el color de tu marca (verde)
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>{primeraLetra}</Text>
            </View>
          )}
          <View style={styles.textContainer}>
            <Text style={[styles.welcomeText, { color: tema.subTextColor }]}>¡Bienvenido!</Text>
            <Text style={[styles.nombreText, { color: tema.textColor }]} numberOfLines={1}>
              {nombreLimpio}
            </Text>
          </View>
        </TouchableOpacity>

        {/* SECCIÓN DERECHA: NOTIFICACIONES */}
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onNotificationPress}
            activeOpacity={0.6}
          >
            {/* Icono de campana en color amarillo para que resalte */}
            <MaterialCommunityIcons name="bell-outline" size={24} color={palette.darkYellow} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 50, 
    paddingBottom: 10,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20, 
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.white, // Ajustado a verde como el ProfileAvatarHeader
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: palette.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  textContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    flex: 1,
  },
  welcomeText: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  nombreText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});