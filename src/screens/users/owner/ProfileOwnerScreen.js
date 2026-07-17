// src/screens/users/owner/ProfileOwnerScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Servicios y Configuración
import { supabase } from '../../../lib/supabase/supabaseConfig';
import { gymService } from '../../../services/gymService';
import { authService } from '../../../services/authService';

// Implementación del Contexto Global del Tema 🌟
import { useTheme } from '../../../theme/ThemeContext';

// Componentes Comunes Reutilizables 🚀
import ScreenHeader from '../../../components/common/ScreenHeader';
import LoadingScreen from '../../../components/common/LoadingScreen';
import ProfileAvatarHeader from '../../../components/common/ProfileAvatarHeader';
import ProfileSectionCard from '../../../components/common/ProfileSectionCard';
import ProfileSettingsCard from '../../../components/common/ProfileSettingsCard';
import ProfileMenuCard from '../../../components/common/ProfileMenuCard';

// Utilidades de Formateo
import { formatToLocalDate } from '../../../utils/dateFormatter';
import { formatToMiles } from '../../../utils/currencyFormatter';

export default function ProfileOwnerScreen({ navigation }) {
    // 🌟 Consumimos el estado reactivo global del tema
    const { tema, modoOscuro, toggleTema, loadingTheme } = useTheme();
    
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [gymData, setGymData] = useState(null);
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        // ⚡ Refactorizamos la tarea pesada de fetching usando requestIdleCallback para optimizar la CPU
        const scheduleCallback = window.requestIdleCallback || function(cb) {
            return setTimeout(cb, 1);
        };
        const cancelCallback = window.cancelIdleCallback || clearTimeout;

        const handleIdle = scheduleCallback(() => {
            fetchProfileAndGym();
        });

        return () => cancelCallback(handleIdle);
    }, []);

    const fetchProfileAndGym = async () => {
        try {
            setLoading(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) throw new Error("No hay usuario autenticado");

            // Obtener el perfil completo del usuario
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;
            setUserData(profile);

            // Obtener los datos del gimnasio
            const gym = await gymService.getGymByOwner(user.id);
            setGymData(gym);

        } catch (error) {
            console.error("❌ Error al cargar perfil:", error.message);
            Alert.alert("Error", "No se pudieron cargar los datos de perfil.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Permite seleccionar una imagen del carrete de fotos y actualizar el logo del gimnasio
     */
    const handlePickAndUploadImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso Denegado', 'Se requiere acceso a la galería para cambiar el logo.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) return;

            const localUri = result.assets[0].uri;
            setUploading(true);

            const userId = userData.id;
            const gymId = gymData?.id;

            if (!gymId) {
                Alert.alert("Aviso", "Primero debes configurar y registrar tu gimnasio para asignarle un logo.");
                return;
            }

            const newLogoUrl = await gymService.updateGymLogo(gymId, userId, localUri);

            setGymData((prev) => ({ ...prev, logo_url: newLogoUrl }));
            Alert.alert('✅ ¡Éxito!', 'El logo de tu gimnasio ha sido actualizado correctamente.');

        } catch (error) {
            console.error('❌ Error al subir logo:', error.message);
            Alert.alert('❌ Error', 'No se pudo subir la imagen.');
        } finally {
            setUploading(false);
        }
    };

    /**
     * Cierre seguro de sesión con authService ⛔
     */
    const handleLogout = () => {
        Alert.alert(
            "⛔ Cerrar Sesión",
            "¿Estás seguro de que quieres salir?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sí, salir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await authService.logout();
                            setUserData(null);
                            setGymData(null);

                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });

                        } catch (error) {
                            setLoading(false);
                            console.error("❌ Error al cerrar sesión:", error.message);
                            Alert.alert('⚠️ Error', 'No se pudo cerrar la sesión de forma segura. Inténtalo de nuevo.');
                        }
                    }
                }
            ]
        );
    };

    // Evaluamos tanto la carga de datos como la sincronización inicial del almacenamiento del tema
    if (loading || loadingTheme) {
        return <LoadingScreen mensaje="Cargando perfil..." />;
    }

    return (
        <View style={[styles.container, { backgroundColor: tema.backgroundColor || tema.white }]}>
            <ScreenHeader title="Mi Perfil" />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                {/* CABECERA DE AVATAR (LOGO DEL GIMNASIO, EMAIL DEL PROPIETARIO Y ROL) */}
                <ProfileAvatarHeader
                    imageUrl={gymData?.logo_url}
                    name={gymData?.gym_name}
                    email={userData?.email}
                    role={userData?.role}
                    uploading={uploading}
                    onImagePress={handlePickAndUploadImage}
                />

                {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
                <ProfileSectionCard
                    title="Información Personal"
                    onEditPress={() => navigation.navigate('EditProfileOwner', { userData })}
                    fields={[
                        { label: 'Nombre Completo', value: userData?.full_name || 'Sin especificar' },
                        {
                            label: 'Identificación',
                            value: userData?.document_type && userData?.document_number
                                ? `${userData.document_type} - ${userData.document_number}`
                                : 'Sin registrar'
                        },
                        { label: 'Teléfono', value: userData?.phone || 'Sin registrar' },
                        {
                            label: 'Género',
                            value: userData?.gender === 'M' ? 'Masculino' : userData?.gender === 'F' ? 'Femenino' : 'Sin registrar'
                        },
                        { label: 'Miembro desde', value: formatToLocalDate(userData?.created_at) },
                        { label: 'Última actualización', value: formatToLocalDate(userData?.updated_at) }
                    ]}
                />

                {/* SECCIÓN 2: INFORMACIÓN DEL GIMNASIO */}
                <ProfileSectionCard
                    title="Información del Gimnasio"
                    onEditPress={() => navigation.navigate('GymSetup', { gymData })}
                    fields={[
                        { label: 'Nombre del Gimnasio', value: gymData?.gym_name || 'Sin registrar' },
                        {
                            label: 'Ubicación',
                            value: gymData?.city && gymData?.state ? `${gymData.city}, ${gymData.state}` : 'Sin registrar'
                        },
                        {
                            label: 'Dirección',
                            value: gymData?.address ? gymData.address.trim() : 'Sin registrar'
                        },
                        {
                            label: 'Precio de la Rutina',
                            value: gymData?.routine_price ? `$${formatToMiles(gymData.routine_price)}` : 'Sin definir'
                        }
                    ]}
                />

                {/* SECCIÓN 3: AJUSTES DE LA APLICACIÓN */}
                <ProfileSettingsCard
                    title="Ajustes de la Aplicación"
                    settings={[
                        {
                            label: 'Notificaciones push',
                            icon: 'bell-outline',
                            value: notifications,
                            onValueChange: setNotifications,
                        },
                        {
                            label: 'Modo Oscuro',
                            icon: 'weather-night',
                            value: modoOscuro,       // 🌟 Valor dinámico del contexto
                            onValueChange: toggleTema, // 🌟 Función del contexto para mutar el tema en toda la App
                        },
                    ]}
                />

                {/* SECCIÓN 4: CUENTA Y ACCIONES */}
                <ProfileMenuCard
                    title="Cuenta"
                    options={[
                        {
                            label: 'Seguridad y Contraseña',
                            icon: 'lock-outline',
                            onPress: () => navigation.navigate('ChangePasswordScreen'),
                        },
                        {
                            label: 'Cerrar Sesión',
                            icon: 'logout',
                            danger: true,
                            onPress: handleLogout,
                        },
                    ]}
                />

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 40,
    },
});