// src/components/common/HomeHeader.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';

export default function HomeHeader({
  nombreUsuario = 'Usuario',
  logoUrl = null,
  onLogout,
  onNotificationPress,
}) {
  const [cachedLogoUrl, setCachedLogoUrl] = useState(logoUrl);

  useEffect(() => {
    // Si la URL cambia en las props, actualizamos el estado local
    setCachedLogoUrl(logoUrl);
  }, [logoUrl]);

  const nombreLimpio = nombreUsuario && nombreUsuario.trim() ? nombreUsuario.toUpperCase() : 'USUARIO';
  const primeraLetra = nombreLimpio.charAt(0).toUpperCase();

  // Comprobación estricta de que tengamos una URL válida
  const tieneLogoValido = cachedLogoUrl && typeof cachedLogoUrl === 'string' && cachedLogoUrl.trim() !== '';

  // Limpiamos cualquier query string anterior que pudiera venir en la URL para evitar el error 400
  const cleanLogoUrl = tieneLogoValido ? cachedLogoUrl.split('?')[0] : null;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerContainer}>

        {/* ── SECCIÓN IZQUIERDA: AVATAR/LOGO Y TEXTO ── */}
        <View style={styles.headerLeft}>
          {tieneLogoValido ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                // Forzar recarga de la imagen sumando un hash limpio si falla
                if (cleanLogoUrl) {
                  setCachedLogoUrl(`${cleanLogoUrl}?v=${Date.now()}`);
                }
              }}
            >
              <Image
                source={{
                  uri: cleanLogoUrl,
                  headers: {
                    'Accept': 'image/png,image/*;q=0.8,*/*;q=0.5',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36'
                  }
                }}
                style={styles.logoImage}
                resizeMode="cover"
                fadeDuration={0}
                onError={(e) => {
                  console.log("❌ Error cargando imagen en el Header:", e.nativeEvent.error);
                  console.log("🔗 URL fallida:", cleanLogoUrl);
                }}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>{primeraLetra}</Text>
            </View>
          )}
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>¡Bienvenido!</Text>
            <Text style={styles.nombreText} numberOfLines={1}>
              {nombreLimpio}
            </Text>
          </View>
        </View>

        {/* ── SECCIÓN DERECHA: BOTONES DE ACCIÓN ── */}
        <View style={styles.headerIcons}>
          {/* Campana de Notificaciones */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNotificationPress}
            activeOpacity={0.6}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color={palette.darkGreen} />
          </TouchableOpacity>

          {/* Botón Salir */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onLogout}
            activeOpacity={0.6}
          >
            <MaterialCommunityIcons name="logout" size={24} color={palette.red} />
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
    backgroundColor: palette.white,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: palette.lightGrayInput,
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
    backgroundColor: palette.darkGreen,
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
    backgroundColor: palette.lightGrayInput,
    overflow: 'hidden',
  },
  textContainer: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 11,
    color: palette.mediumGray,
    fontWeight: '500',
    marginBottom: 2,
  },
  nombreText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: palette.darkGreen,
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