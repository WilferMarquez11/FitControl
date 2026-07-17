// src/screens/owner/PanelOwnerScreen.js (ajusta la ruta si varía)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// ── COMPONENTES COMUNES IMPORTADOS ──
import { palette } from '../../../theme/colors';
import HomeHeader from '../../../components/common/HomeHeader';
import LoadingScreen from '../../../components/common/LoadingScreen';
import BottomNavigation from '../../../components/common/BottomNavigation';
import MenuCard from '../../../components/common/MenuCard'; 
import Separator from '../../../components/common/Separator';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../../theme/ThemeContext';

// ── SERVICIOS ──
import { userService } from '../../../services/userService';
import { gymService } from '../../../services/gymService';

export default function PanelOwnerScreen({ navigation }) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  const [loading, setLoading] = useState(true);
  const [nombreUsuario, setNombreUsuario] = useState('Propietario');
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

      // 3. Obtener el logo del gimnasio vinculado usando la relación 'gym_id'
      let gym = await gymService.getGymByOwner(userId);
      console.log("=== [PANEL] GIMNASIO RECIBIDO ===", gym);

      if (!gym) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        gym = await gymService.getGymByOwner(userId);
      }

      if (gym) {
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

  if (loading) {
    return <LoadingScreen mensaje="Cargando panel de control..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: tema.backgroundColor }]}>
      {/* Cabecera dinámica sin botón de logout */}
      <HomeHeader
        nombreUsuario={nombreUsuario}
        logoUrl={logoUrl}
        onNotificationPress={() => Alert.alert('🔔 Notificaciones', 'No tienes alertas pendientes.')}
        onPressProfile={() => navigation.navigate('ProfileOwner')}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Separador adaptable */}
        <Separator icon="weight-lifter" />

        {/* Sección de Accesos Rápidos con color de texto dinámico */}
        <Text style={[styles.sectionTitle, { color: tema.textColor }]}>⚡ Acceso Rápido</Text>

        <View style={styles.grid}>
          {/* Tarjeta: Registrar Clientes */}
          <MenuCard
            title="Registrar"
            subtitle="Clientes"
            iconName="account-plus"
            iconColor={palette.blue}
            // Suavizamos el fondo del icono si está en modo oscuro para no quemar la vista
            iconBgColor={tema.dark ? 'rgba(33, 150, 243, 0.15)' : palette.lightBlue}
            accentColor={palette.blue}
            onPress={() => navigation.navigate('RegisterClient')}
          />

          {/* Tarjeta: Registrar Membresías */}
          <MenuCard
            title="Registrar"
            subtitle="Membresías"
            iconName="card-account-details-star"
            iconColor={palette.purple}
            iconBgColor={tema.dark ? 'rgba(156, 39, 176, 0.15)' : palette.lightPurple}
            accentColor={palette.purple}
            onPress={() => navigation.navigate('RegisterMembership')}
          />

          {/* Tarjeta: Registrar Pagos */}
          <MenuCard
            title="Registrar"
            subtitle="Pagos"
            iconName="currency-usd"
            iconColor={palette.darkGreen}
            iconBgColor={tema.dark ? 'rgba(76, 175, 80, 0.15)' : palette.lightGreen2}
            accentColor={palette.darkGreen}
            onPress={() => navigation.navigate('RegisterPayment')}
          />

          {/* Tarjeta: Control de Asistencias */}
          <MenuCard
            title="Control de"
            subtitle="Asistencias"
            iconName="calendar-check"
            iconColor={palette.darkOrange}
            iconBgColor={tema.dark ? 'rgba(255, 152, 0, 0.15)' : palette.lightOrange}
            accentColor={palette.darkOrange}
            onPress={() => navigation.navigate('RegisterAttendance')}
          />
        </View>

        {/* Espacio para que el menú flotante inferior no tape tus tarjetas */}
        <View style={{ height: 120 }} />
      </KeyboardAwareScrollView>

      {/* Menú de Navegación Flotante */}
      <BottomNavigation
        navigation={navigation}
        tabActiva="PanelOwner"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});