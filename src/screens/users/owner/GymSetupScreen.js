// src/screens/users/owner/GymSetupScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { palette } from '../../../theme/colors';

// Importación de servicios y del JSON dinámico en assets
import { gymService } from '../../../services/gymService';
import { authService } from '../../../services/authService';
import colombiaData from '../../../../assets/data/colombia.json';

import { formatToMiles, parseToRawNumber } from '../../../utils/currencyFormatter';

import FormInput from '../../../components/forms/FormInput';
import FormPicker from '../../../components/forms/FormPicker.js';
import FormButtons from '../../../components/forms/FormButtons';
import CurrencyInput from '../../../components/forms/CurrencyInput';
import FormImagePicker from '../../../components/forms/FormImagePicker';
import LoadingOverlay from '../../../components/common/LoadingOverlay';
import ScreenHeader from '../../../components/common/ScreenHeader'; // 🌟 Tu nuevo header común

// 🌟 Importamos el hook del tema
import { useTheme } from '../../../theme/ThemeContext';

export default function GymSetupScreen({ navigation, route }) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  // Extraemos el ID del usuario enviado desde la pantalla de Register
  const { userId } = route.params || {};

  // 🚨 Añade este log temporal para depurar en tu terminal de Expo:
  console.log("=== USER ID RECIBIDO EN GYM SETUP ===", userId);

  // Estados locales nombrados exactamente igual que las columnas de tu base de datos
  const [gym_name, setGymName] = useState('');
  const [country, setCountry] = useState('Colombia');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [routine_price, setRoutinePrice] = useState('');
  const [address, setAddress] = useState('');
  const [logo_uri, setLogoUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // Controladores de listas dinámicas para Colombia
  const [departmentsList, setDepartmentsList] = useState([]);
  const [citiesList, setCitiesList] = useState([]); 

  // Variables dinámicas para el control de re-renderizado por tema
  const esModoOscuro = tema.backgroundColor !== palette.white;
  const themeKey = esModoOscuro ? 'dark' : 'light';

  // Carga inicial de departamentos al abrir la pantalla
  useEffect(() => {
    const mappedDepartments = colombiaData.map((dept) => ({
      label: dept.departamento,
      value: dept.departamento,
    }));
    mappedDepartments.sort((a, b) => a.label.localeCompare(b.label));
    setDepartmentsList(mappedDepartments);
  }, []);

  // Filtrado automático de ciudades al cambiar de departamento
  useEffect(() => {
    if (!state) {
      setCitiesList([]);
      setCity('');
      return;
    }

    const foundDept = colombiaData.find((dept) => dept.departamento === state);

    if (foundDept && foundDept.ciudades) {
      const mappedCities = foundDept.ciudades.map((ciudad) => ({
        label: ciudad,
        value: ciudad,
      }));
      mappedCities.sort((a, b) => a.label.localeCompare(b.label));
      setCitiesList(mappedCities);
    } else {
      setCitiesList([]);
    }
    setCity('');
  }, [state]);

  /**
   * PROCESO DE GUARDADO Y REDIRECCIÓN
   */
  const handleCreateGym = async () => {
    // 💡 Limpiamos espacios antes de validar
    const cleanedGymName = gym_name ? gym_name.trim() : '';
    const cleanedState = state ? state.trim() : '';
    const cleanedCity = city ? city.trim() : '';

    // 🚨 Convertimos el string formateado "20.000" a número limpio para la BD: 20000
    const rawPrice = parseToRawNumber(routine_price);

    // 🔍 LOG TEMPORAL: Revisa tu terminal de Expo para ver cuál de estos llega vacío o en 0
    console.log("=== AUDITORÍA DE DATOS ANTES DE VALIDAR ===");
    console.log("Nombre gimnasio:", `"${cleanedGymName}"`);
    console.log("País:", `"${country}"`);
    console.log("Departamento (state):", `"${cleanedState}"`);
    console.log("Ciudad (city):", `"${cleanedCity}"`);
    console.log("Precio formateado:", `"${routine_price}"`);
    console.log("Precio limpio (rawPrice):", rawPrice, typeof rawPrice);
    console.log("===========================================");

    // Validamos los campos obligatorios usando las variables ya limpias
    if (!cleanedGymName || !country || !cleanedState || !cleanedCity || isNaN(rawPrice) || rawPrice <= 0) {
      Alert.alert('⚠️ Campos incompletos', 'Por favor completa todos los campos requeridos (*) y define un precio de rutina válido.');
      return;
    }

    setLoading(true);
    try {
      await gymService.createGymAndLinkUser({
        userId,
        gym_name: cleanedGymName,
        country,
        state: cleanedState,
        city: cleanedCity,
        routine_price: rawPrice, 
        address: address ? address.trim() : null,
        logo_uri, 
      });

      setLoading(false);
      Alert.alert('🎉 ¡Gimnasio creado!', 'Tu gimnasio se ha registrado exitosamente.');
      navigation.replace('PanelOwner');

    } catch (error) {
      setLoading(false);
      Alert.alert('❌ Error', error.message || 'Ocurrió un error inesperado al registrar el gimnasio.');
    }
  };
  /**
   * CANCELAR ACCIÓN
   */
  const handleSignOut = async () => {
    try {
      await authService.logout();
      // Redirigimos al usuario a la pantalla de Login tras cerrar sesión
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('❌ Error', 'Ocurrió un fallo al intentar cerrar la sesión.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: tema.backgroundColor }]}>
      {/* ── 🌟 HEADER REUTILIZABLE (Sin flecha de retroceso para evitar volver al registro) ── */}
      <ScreenHeader title="Configura tu gimnasio" showBackButton={false} />

      {/* ── FORMULARIO ── */}
      <KeyboardAwareScrollView
        key={`gym-setup-${themeKey}`}
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <FormImagePicker
          label="Logo del gimnasio"
          optional
          value={logo_uri}
          onChange={setLogoUri}
        />

        <FormInput
          label="Nombre del gimnasio"
          required
          placeholder="Ejemplo: FITCONTROL GYM"
          value={gym_name}
          onChangeText={(text) => setGymName(text.toUpperCase())} // Fuerza el estado de React a mayúsculas
          autoCapitalize="characters" // 🚨 ¡Fuerza el TECLADO del celular en mayúsculas fijas!
        />

        <FormPicker
          label="País"
          required
          value={country}
          onChange={setCountry}
          placeholder="Seleccionar país..."
          items={[{ label: 'Colombia', value: 'Colombia' }]}
          disabled={true}
        />

        <FormPicker
          label="Departamento"
          required
          value={state}
          onChange={setState}
          placeholder="Seleccionar departamento..."
          items={departmentsList}
        />

        <FormPicker
          label="Ciudad"
          required
          value={city}
          onChange={setCity}
          placeholder={state ? "Seleccionar ciudad..." : "Primero selecciona un departamento"}
          items={citiesList}
          disabled={citiesList.length === 0}
        />

        {/* 🚨 Usamos el CurrencyInput con el formateador de miles en tiempo real */}
        <CurrencyInput
          label="Precio de la rutina diaria"
          required
          placeholder="0"
          value={routine_price}
          onChangeText={(text) => setRoutinePrice(formatToMiles(text))}
        />

        <FormInput
          label="Dirección"
          optional
          placeholder="Ejemplo: Cra 45 #23-10 (Opcional)"
          value={address}
          onChangeText={setAddress}
        />

        <FormButtons
          onSave={handleCreateGym}
          onCancel={handleSignOut}
          saveText="Crear gimnasio"
          cancelText="Salir"
        />

        <View style={{ height: 120 }} />
      </KeyboardAwareScrollView>

      <LoadingOverlay visible={loading} message="Creando tu gimnasio, por favor espera..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingTop: 10,
  },
});