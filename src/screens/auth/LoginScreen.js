// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { palette } from '../../theme/colors';
import CustomAuthInput from '../../components/auth/CustomAuthInput';
import CustomButton from '../../components/auth/CustomButton';
import Separator from '../../components/common/Separator';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import AuthLogo from '../../components/auth/AuthLogo';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

import { authService } from '../../services/authService';
import { userService } from '../../services/userService';

export default function LoginScreen({ navigation }) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('⚠️ Campos incompletos', 'Por favor ingresa tu correo y contraseña para continuar.');
      return;
    }

    setLoadingLogin(true);
    try {
      const data = await authService.login(email.trim().toLowerCase(), password);

      if (data && data.user) {
        const profile = await userService.getUserProfile(data.user.id);

        if (!profile) {
          throw new Error('No se encontró el perfil de usuario en el sistema.');
        }

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

  const handleGoToRegister = () => {
    setLoadingRegister(true);
    setTimeout(() => {
      setLoadingRegister(false);
      navigation.navigate('Register');
    }, 2000);
  };

  const isLoading = loadingLogin || loadingRegister;

  return (
    <KeyboardAwareScrollView
      // 🌟 El color de fondo de la pantalla se adapta dinámicamente aquí
      style={[styles.scroll, { backgroundColor: tema.backgroundColor }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      extraScrollHeight={21}
    >
      {/* El logo cambiará internamente entre LogoIcon o LogoIcon2 según el tema */}
      <AuthLogo />

      {/* 🌟 Color de texto adaptable */}
      <Text style={[styles.subtitle, { color: tema.textColor }]}>¡Ingresa ahora mismo!</Text>

      <Separator icon="account-key" />

      <CustomAuthInput
        icon="email"
        placeholder="Ingrese su correo"
        value={email}
        onChangeText={(text) => setEmail(text.trim().toLowerCase())}
        autoCapitalize="none"
        keyboardType="email-address"
        marginBottom={4}
      />
      {/* 🌟 Texto de sugerencia adaptable */}
      <Text style={[styles.hint, { color: tema.subTextColor }]}>Ejemplo: nombre@gmail.com</Text>

      <CustomAuthInput
        icon="lock"
        placeholder="Ingrese contraseña"
        value={password}
        isPassword={true}
        onChangeText={(text) => setPassword(text.replace(/\s/g, ''))}
        marginBottom={4}
      />
      {/* 🌟 Texto de sugerencia adaptable */}
      <Text style={[styles.hint, { color: tema.subTextColor }]}>Debe tener al menos 6 caracteres</Text>

      <CustomButton
        title="Iniciar Sesión"
        onPress={handleLogin}
        variant="primary"
        loading={loadingLogin}
        marginTop={12}
        marginBottom={14}
      />

      <CustomButton
        title="Crear Cuenta"
        onPress={handleGoToRegister}
        variant="secondary"
        loading={loadingRegister}
        marginTop={0}
        marginBottom={20}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Recover')} activeOpacity={0.6}>
        <Text style={styles.forgotPassword}>Olvidé mi contraseña</Text>
      </TouchableOpacity>

      <LoadingOverlay visible={isLoading} message="Un momento, por favor espera..." />
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
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  hint: {
    fontSize: 12,
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