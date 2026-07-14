import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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



export default function GymSetupScreen({ navigation, route }) {
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
    const cleanedGymName = gym_name.trim();

    // 🚨 Convertimos el string formateado "20.000" a número limpio para la BD: 20000
    const rawPrice = parseToRawNumber(routine_price);

    // Validamos los campos obligatorios usando las variables ya limpias
    if (!cleanedGymName || !country || !state || !city || rawPrice <= 0) {
      Alert.alert('⚠️ Campos incompletos', 'Por favor completa todos los campos requeridos (*) y define un precio de rutina válido.');
      return;
    }

    setLoading(true);
    try {
      // Mandamos las variables directo al servicio (el servicio se encargará del ArrayBuffer y del Storage)
      await gymService.createGymAndLinkUser({
        userId,
        gym_name: cleanedGymName,
        country,
        state,
        city,
        routine_price: rawPrice, // 🚨 Pasamos el número limpio (Float/Int)
        // 🚨 Enviamos la dirección formateada de forma segura (si no hay, mandamos null)
        address: address ? address.trim() : null,
        logo_uri, // El URI de la imagen seleccionada temporalmente
      });

      setLoading(false);

      // Alerta de éxito con su respectivo emoji
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
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configura tu gimnasio</Text>
      </View>

      {/* ── ÍCONO ── */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="office-building" size={56} color={palette.darkBlue} />
      </View>

      {/* ── FORMULARIO ── */}
      <KeyboardAwareScrollView
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
    backgroundColor: palette.white,
  },
  header: {
    paddingTop: 55,
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.darkBlue,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  formContainer: {
    paddingHorizontal: 25,
  },
});