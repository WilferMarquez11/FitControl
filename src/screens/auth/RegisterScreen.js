import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'; // 👈 Añadimos Alert
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { palette } from '../../theme/colors';
import CustomAuthInput from '../../components/auth/CustomAuthInput';
import CustomButton from '../../components/auth/CustomButton';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import AuthLogo from '../../components/auth/AuthLogo';
import { authService } from '../../services/authService'; // 👈 Importamos tu servicio de Supabase

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Validaciones básicas iniciales
    if (!nombre || !email || !password || !confirmPassword) {
      Alert.alert('⚠️ Campos incompletos', 'Por favor llena todos los campos requeridos para crear tu cuenta.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('🔒 Contraseñas no coinciden', 'La contraseña y la confirmación deben ser exactamente iguales.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('🛡️ Contraseña débil', 'Por seguridad, la contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // 2. Conexión con Supabase Auth
    setLoading(true);
    try {
      // 🚨 CAMBIO CLAVE: Cambia registerOwnerAuthOnly por registerOwner
      const data = await authService.registerOwner(email, password, nombre);

      setLoading(false);

      if (data && data.user) {
        navigation.navigate('GymSetup', {
          userId: data.user.id,
          email: data.user.email,
          fullName: nombre
        });
      } else {
        throw new Error('No se pudo recuperar la información del usuario creado.');
      }

    } catch (error) {

      setLoading(false);
      
      // Traducimos el error común de usuario existente si Supabase lo arroja
      let mensajeAmigable = error.message;
      let tituloAlerta = '❌ Error al registrar';

      if (error.message.includes('User already registered')) {
        tituloAlerta = '📧 Correo registrado';
        mensajeAmigable = 'Este correo electrónico ya está asociado a otra cuenta. Intenta iniciar sesión.';
      }

      Alert.alert(tituloAlerta, mensajeAmigable);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <AuthLogo />

      <Text style={styles.subtitle}>¡Crea tu cuenta ahora mismo!</Text>

      {/* Nombre Completo */}
      <Text style={styles.label}>Nombre Completo</Text>
      <CustomAuthInput
        icon="person"
        placeholder="Ejemplo: JUAN PEREZ"
        value={nombre}
        onChangeText={(text) => setNombre(text.toUpperCase())}
        autoCapitalize="characters"
      />

      {/* Correo Electrónico */}
      <Text style={styles.label}>Correo Electrónico</Text>
      <CustomAuthInput
        icon="email"
        placeholder="Ejemplo: nombre@gmail.com"
        value={email}
        onChangeText={(text) => setEmail(text.trim().toLowerCase())}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Contraseña */}
      <Text style={styles.label}>Contraseña</Text>
      <CustomAuthInput
        icon="lock"
        placeholder="Mínimo 6 caracteres (sin espacios)"
        value={password}
        isPassword={true}
        onChangeText={(text) => setPassword(text.replace(/\s/g, ''))}
      />

      {/* Confirmar Contraseña */}
      <Text style={styles.label}>Confirmar Contraseña</Text>
      <CustomAuthInput
        icon="lock-outline"
        placeholder="Repite tu contraseña"
        value={confirmPassword}
        isPassword={true}
        onChangeText={(text) => setConfirmPassword(text.replace(/\s/g, ''))}
      />

      {/* Botón Crear Cuenta */}
      <CustomButton
        title="Crear Cuenta"
        onPress={handleRegister}
        variant="primary"
        loading={loading}
        marginTop={12}
        marginBottom={16}
      />

      {/* Volver al Login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.6}>
        <Text style={styles.linkLogin}>Volver al Inicio de Sesión</Text>
      </TouchableOpacity>

      {/* Overlay de carga */}
      <LoadingOverlay visible={loading} message="Creando tu cuenta, por favor espera..." />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: palette.white,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: palette.darkBlue,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.black,
    alignSelf: 'flex-start',
    marginBottom: 6,
    marginLeft: 2,
  },
  linkLogin: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: palette.darkYellow,
    marginBottom: 20,
    fontWeight: '600',
  },
});