// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { palette } from '../../theme/colors';
import CustomAuthInput from '../../components/auth/CustomAuthInput';
import CustomButton from '../../components/auth/CustomButton';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import AuthLogo from '../../components/auth/AuthLogo';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';
import { authService } from '../../services/authService';

export default function RegisterScreen({ navigation }) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Comprobación definitiva del modo oscuro basada en el fondo
  const esModoOscuro = tema.backgroundColor !== palette.white;
  const themeKey = esModoOscuro ? 'dark' : 'light';

  const handleRegister = async () => {
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

    setLoading(true);
    try {
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
      // 🌟 Color de fondo adaptable
      style={[styles.scroll, { backgroundColor: tema.backgroundColor }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <AuthLogo key={`logo-${themeKey}`} />

      {/* 🌟 Título adaptable */}
      <Text style={[styles.subtitle, { color: tema.textColor }]}>
        ¡Crea tu cuenta ahora mismo!
      </Text>

      {/* Nombre Completo */}
      <Text style={[styles.label, { color: tema.textColor }]}>Nombre Completo</Text>
      <CustomAuthInput
        key={`reg-nombre-${themeKey}`}
        icon="person"
        placeholder="Ejemplo: JUAN PEREZ"
        value={nombre}
        onChangeText={(text) => setNombre(text.toUpperCase())}
        autoCapitalize="characters"
      />

      {/* Correo Electrónico */}
      <Text style={[styles.label, { color: tema.textColor }]}>Correo Electrónico</Text>
      <CustomAuthInput
        key={`reg-email-${themeKey}`}
        icon="email"
        placeholder="Ejemplo: nombre@gmail.com"
        value={email}
        onChangeText={(text) => setEmail(text.trim().toLowerCase())}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Contraseña */}
      <Text style={[styles.label, { color: tema.textColor }]}>Contraseña</Text>
      <CustomAuthInput
        key={`reg-pass-${themeKey}`}
        icon="lock"
        placeholder="Mínimo 6 caracteres (sin espacios)"
        value={password}
        isPassword={true}
        onChangeText={(text) => setPassword(text.replace(/\s/g, ''))}
      />

      {/* Confirmar Contraseña */}
      <Text style={[styles.label, { color: tema.textColor }]}>Confirmar Contraseña</Text>
      <CustomAuthInput
        key={`reg-confpass-${themeKey}`}
        icon="lock-outline"
        placeholder="Repite tu contraseña"
        value={confirmPassword}
        isPassword={true}
        onChangeText={(text) => setConfirmPassword(text.replace(/\s/g, ''))}
      />

      {/* Botón Crear Cuenta */}
      <CustomButton
        key={`reg-btn-${themeKey}`}
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
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
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