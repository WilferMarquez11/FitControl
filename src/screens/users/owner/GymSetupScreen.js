import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../../../theme/colors';
import { supabase } from '../../../lib/supabase/supabaseConfig';

import FormInput from '../../../components/forms/FormInput';
import FormPicker from '../../../components/forms/FormPicker.js';
import FormButtons from '../../../components/forms/FormButtons';
import CurrencyInput from '../../../components/forms/CurrencyInput';
import FormImagePicker from '../../../components/forms/FormImagePicker';
import LoadingOverlay from '../../../components/common/LoadingOverlay';

export default function GymSetupScreen({ navigation, session }) {
  const [gymName, setGymName] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [routinePrice, setRoutinePrice] = useState('');
  const [address, setAddress] = useState('');
  const [logoUri, setLogoUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateGym = async () => {
    if (!gymName || !country || !state || !city || !routinePrice || !address) {
      Alert.alert('Faltan datos', 'Por favor completa todos los campos requeridos.');
      return;
    }

    setLoading(true);
    try {
      let logoUrl = null;

      // Si el usuario seleccionó un logo, se sube antes de crear el gym
      if (logoUri) {
        const fileExt = logoUri.split('.').pop();
        const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
        const response = await fetch(logoUri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('gym-logos')
          .upload(fileName, blob, { contentType: `image/${fileExt}` });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('gym-logos')
          .getPublicUrl(fileName);

        logoUrl = publicUrlData.publicUrl;
      }

      // 1. Crear el gimnasio
      const { data: gym, error: gymError } = await supabase
        .from('gyms')
        .insert({
          gym_name: gymName,
          country,
          state,
          city,
          routine_price: parseFloat(routinePrice),
          address,
          logo_url: logoUrl,
          created_by: session.user.id,
        })
        .select()
        .single();

      if (gymError) throw gymError;

      // 2. Vincular el gym al usuario (ya existe por el trigger de auth)
      const { error: userError } = await supabase
        .from('users')
        .update({ gym_id: gym.id })
        .eq('id', session.user.id);

      if (userError) throw userError;

      // La navegación al Home la maneja tu RootNavigator al detectar gym_id
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
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
        {/* Logo es un componente */}
        <FormImagePicker
          label="Logo del gimnasio"
          optional
          value={logoUri}
          onChange={setLogoUri}
        />

        {/* Nombre del gimnasio es un componente */}
        <FormInput
          label="Nombre del gimnasio"
          required
          placeholder="Ejemplo: FitControl Gym"
          value={gymName}
          onChangeText={setGymName}
        />

        {/* País es un componente */}
        <FormPicker
          label="País"
          required
          value={country}
          onChange={setCountry}
          placeholder="Seleccionar país..."
          items={[{ label: 'Colombia', value: 'Colombia' }]}
        />

        {/* Departamento es un componente */}
        <FormPicker
          label="Departamento"
          required
          value={state}
          onChange={setState}
          placeholder="Seleccionar departamento..."
          items={[
            { label: 'Antioquia', value: 'Antioquia' },
            { label: 'Cundinamarca', value: 'Cundinamarca' },
            { label: 'Valle del Cauca', value: 'Valle del Cauca' },
          ]}
        />

        {/* Ciudad es un componente */}
        <FormPicker
          label="Ciudad"
          required
          value={city}
          onChange={setCity}
          placeholder="Seleccionar ciudad..."
          items={[
            { label: 'Medellín', value: 'Medellín' },
            { label: 'Bogotá', value: 'Bogotá' },
            { label: 'Cali', value: 'Cali' },
          ]}
        />

        {/* Precio rutina diaria es un componente */}
        <CurrencyInput
          label="Precio de la rutina diaria"
          required
          placeholder="0"
          value={routinePrice}
          onChangeText={(text) => setRoutinePrice(text.replace(/[^0-9]/g, ''))}
        />

        {/* Dirección es un componente */}
        <FormInput
          label="Dirección"
          required
          placeholder="Ejemplo: Cra 45 #23-10"
          value={address}
          onChangeText={setAddress}
        />

        {/* Botones es un componente */}
        <FormButtons
          onSave={handleCreateGym}
          onCancel={() => supabase.auth.signOut()}
          saveText="Crear gimnasio"
          cancelText="Cerrar sesión"
        />

        <View style={{ height: 120 }} />
      </KeyboardAwareScrollView>

      {/* Overlay de carga mientras se crea el gym */}
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