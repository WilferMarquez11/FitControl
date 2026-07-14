import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { palette } from '../../theme/colors';
import CustomAuthInput from '../../components/auth/CustomAuthInput';
import CustomButton from '../../components/auth/CustomButton';
import Separator from '../../components/common/Separator';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import AuthLogo from '../../components/auth/AuthLogo';
import { authService } from '../../services/authService';
import { getUserProfile } from '../../services/userService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  const handleLogin = async () => {
    // 1. Validaciones básicas antes de enviar datos a Supabase
    if (!email.trim() || !password) {
      Alert.alert('⚠️ Campos incompletos', 'Por favor ingresa tu correo y contraseña para continuar.');
      return;
    }

    setLoadingLogin(true);
    try {
      // 2. Intentamos iniciar sesión en Supabase Auth
      const data = await authService.login(email.trim().toLowerCase(), password);

      if (data && data.user) {
        // 3. Si el login es exitoso, buscamos el perfil del usuario
        const profile = await userService.getUserProfile(data.user.id);

        if (!profile) {
          throw new Error('No se encontró el perfil de usuario en el sistema.');
        }

        // 4. Redirección inteligente según el rol
        if (profile.role === 'Propietario') {
          if (!profile.gym_id) {
            navigation.replace('GymSetup', { userId: data.user.id });
          } else {
            navigation.replace('PanelOwner');
          }
        } else if (profile.role === 'Entrenador') {
          navigation.replace('PanelTrainer');
        } else {
          Alert.alert('🚫 Rol no autorizado', 'Tu cuenta no tiene los permisos necesarios para acceder a esta aplicación.');
        }
      }
    } catch (error) {
      // Traducimos el error común de credenciales de Supabase
      let mensajeAmigable = error.message;
      let tituloAlerta = '❌ Error al iniciar sesión';

      if (error.message.includes('Invalid login credentials')) {
        tituloAlerta = '🔑 Datos incorrectos';
        mensajeAmigable = 'El correo o la contraseña no coinciden. Por favor, verifica e intenta de nuevo.';
      }

      Alert.alert(tituloAlerta, mensajeAmigable);
    } finally {
      setLoadingLogin(false);
    }
  };

  // 👇 Solo para PROBAR el LoadingOverlay mientras Register no esté listo
  const handleGoToRegister = () => {
    setLoadingRegister(true);
    setTimeout(() => {
      setLoadingRegister(false);
      navigation.navigate('Register');
    }, 2000); // simula 2 segundos de "carga"
  };

  const isLoading = loadingLogin || loadingRegister;

  return (
    <KeyboardAwareScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      extraScrollHeight={21}
    >
      {/* Logo es un componente */}
      <AuthLogo />

      <Text style={styles.subtitle}>¡Ingresa ahora mismo!</Text>

      {/* Separador es un componente */}
      <Separator icon="account-key" />

      {/* Input Correo es un componente */}
      <CustomAuthInput
        icon="email"
        placeholder="Ingrese su correo"
        value={email}
        onChangeText={(text) => setEmail(text.trim().toLowerCase())}
        autoCapitalize="none"
        keyboardType="email-address"
        marginBottom={4}
      />
      <Text style={styles.hint}>Ejemplo: nombre@gmail.com</Text>

      {/* Input Contraseña es un componente */}
      <CustomAuthInput
        icon="lock"
        placeholder="Ingrese contraseña"
        value={password}
        isPassword={true}
        onChangeText={(text) => setPassword(text.replace(/\s/g, ''))}
        marginBottom={4}
      />
      <Text style={styles.hint}>Debe tener al menos 6 caracteres</Text>

      {/* Botón Iniciar Sesión es un componente */}
      <CustomButton
        title="Iniciar Sesión"
        onPress={handleLogin}
        variant="primary"
        loading={loadingLogin}
        marginTop={12}
        marginBottom={14}
      />

      {/* Botón Crear Cuenta es un componente */}
      <CustomButton
        title="Crear Cuenta"
        onPress={handleGoToRegister}
        variant="secondary"
        loading={loadingRegister}
        marginTop={0}
        marginBottom={20}
      />

      {/* Olvidé contraseña */}
      <TouchableOpacity onPress={() => navigation.navigate('Recover')} activeOpacity={0.6}>
        <Text style={styles.forgotPassword}>Olvidé mi contraseña</Text>
      </TouchableOpacity>

      {/* Overlay de carga */}
      <LoadingOverlay visible={isLoading} message="Un momento, por favor espera..." />
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
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: palette.darkBlue,
    marginBottom: 20,
  },
  hint: {
    fontSize: 12,
    color: palette.mediumGray,
    alignSelf: 'flex-start',
    marginBottom: 14,
    marginLeft: 4,
  },
  forgotPassword: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: palette.darkYellow,
    marginBottom: 20,
    fontWeight: '600',
  },
});