import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ── ESTAS SON LAS RUTAS EXACTAS PARA EL PANEL OWNER ──
import { palette } from '../../../theme/colors';
import HomeHeader from '../../../components/common/HomeHeader';

import { userService } from '../../../services/userService';
import { gymService } from '../../../services/gymService';
import { authService } from '../../../services/authService';

export default function PanelOwnerScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [nombreUsuario, setNombreUsuario] = useState('Propietario');
  const [gymName, setGymName] = useState('Mi Gimnasio');
  const [logoUrl, setLogoUrl] = useState(null);

  // Carga de datos al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Carga segura de los datos del usuario y de su gimnasio asociado
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Obtener ID de la sesión activa de Supabase
      const userId = await userService.getCurrentUserId();
      console.log("=== [PANEL] USER ID ACTIVO ===", userId);

      // 2. Obtener perfil del usuario (Nombre de la persona)
      let profile = await userService.getUserProfile(userId);
      console.log("=== [PANEL] PERFIL RECIBIDO ===", profile);

      // Reintento preventivo si la base de datos tarda en responder
      if (!profile || !profile.full_name) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        profile = await userService.getUserProfile(userId);
      }

      if (profile) {
        setNombreUsuario(profile.full_name || 'Propietario');
      }

      // 3. Obtener el gimnasio vinculado usando la relación 'gym_id'
      let gym = await gymService.getGymByOwner(userId);
      console.log("=== [PANEL] GIMNASIO RECIBIDO ===", gym);

      // Reintento preventivo para el gimnasio
      if (!gym) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        gym = await gymService.getGymByOwner(userId);
      }

      if (gym) {
        setGymName(gym.gym_name || 'Mi Gimnasio');
        setLogoUrl(gym.logo_url || null);
      } else {
        console.warn('⚠️ No se encontró ningún gimnasio enlazado para este propietario.');
      }

    } catch (error) {
      console.error('❌ Error en loadDashboardData:', error.message);
      Alert.alert(
        '⚠️ Error de Carga',
        'No logramos sincronizar tu información. Por favor, intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierre de sesión del usuario
   */
  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, Salir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.darkGreen} />
        <Text style={styles.loadingText}>Cargando panel de control...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabecera dinámica con el logo de tu gimnasio o inicial */}
      <HomeHeader
        nombreUsuario={nombreUsuario}
        logoUrl={logoUrl}
        onLogout={handleLogout}
        onNotificationPress={() => Alert.alert('Notificaciones', 'No tienes alertas pendientes.')}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner con el Nombre de tu Gimnasio */}
        <View style={styles.gymBanner}>
          <MaterialCommunityIcons name="dumbbell" size={20} color={palette.darkGreen} />
          <Text style={styles.gymBannerText}>{gymName.toUpperCase()}</Text>
        </View>

        {/* Sección de Accesos Rápidos */}
        <Text style={styles.sectionTitle}>⚡ Acceso Rápido</Text>
        
        <View style={styles.grid}>
          {/* Botón: Clientes */}
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="account-plus" size={28} color={palette.darkGreen} />
            </View>
            <Text style={styles.cardTitle}>Registrar</Text>
            <Text style={styles.cardSubtitle}>Clientes</Text>
          </TouchableOpacity>

          {/* Botón: Membresías */}
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: '#EDE7F6' }]}>
              <MaterialCommunityIcons name="card-bulleted-outline" size={28} color="#5E35B1" />
            </View>
            <Text style={styles.cardTitle}>Registrar</Text>
            <Text style={styles.cardSubtitle}>Membresías</Text>
          </TouchableOpacity>

          {/* Botón: Pagos */}
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E3F2FD' }]}>
              <MaterialCommunityIcons name="currency-usd" size={28} color="#1E88E5" />
            </View>
            <Text style={styles.cardTitle}>Registrar</Text>
            <Text style={styles.cardSubtitle}>Pagos</Text>
          </TouchableOpacity>

          {/* Botón: Asistencias */}
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="calendar-check" size={28} color="#FB8C00" />
            </View>
            <Text style={styles.cardTitle}>Control de</Text>
            <Text style={styles.cardSubtitle}>Asistencias</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.white,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: palette.mediumGray,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  gymBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.lightGrayInput,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 15,
  },
  gymBannerText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
    color: palette.darkGreen,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.darkGreen,
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: palette.white,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: palette.lightGrayInput,
    // Sombras nativas
    elevation: 3,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  iconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.mediumGray,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.darkGreen,
    marginTop: 2,
    textAlign: 'center',
  },
});