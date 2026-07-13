import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { palette } from '../../theme/colors';
import CustomAuthInput from '../../components/auth/CustomAuthInput';
import CustomButton from '../../components/auth/CustomButton';
import GoogleButton from '../../components/auth/GoogleButton';
import Separator from '../../components/common/Separator';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import AuthLogo from '../../components/auth/AuthLogo';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    // Aquí luego: supabase.auth.signInWithPassword({ email, password })
    setLoading(true);
    console.log('Login con:', email, password);
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    // Aquí luego: supabase.auth.signInWithOAuth({ provider: 'google' })
    console.log('Login con Google');
  };

   // 👇 Solo para PROBAR el LoadingOverlay mientras Register no esté listo
  const handleGoToRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Register');
    }, 2000); // simula 2 segundos de "carga"
  };

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

      {/* Botón Google es un componente */}
      <GoogleButton onPress={handleGoogleLogin} />

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
        loading={loading}
        marginTop={12}
        marginBottom={14}
      />
   {/* 👇 Ahora usa handleGoToRegister para poder ver el loading */}
      <CustomButton
        title="Crear Cuenta"
        onPress={handleGoToRegister}
        variant="secondary"
         loading={loading}
        marginTop={0}
        marginBottom={20}
      />

      {/* Botón Crear Cuenta es un componente 
      <CustomButton
        title="Crear Cuenta"
        onPress={() => navigation.navigate('Registrar')}
        variant="secondary"
        marginTop={0}
        marginBottom={20}
      />
      */}

      {/* Olvidé contraseña */}
      <TouchableOpacity onPress={() => navigation.navigate('Recover')} activeOpacity={0.6}>
        <Text style={styles.forgotPassword}>Olvidé mi contraseña</Text>
      </TouchableOpacity>

      {/* Overlay de carga - se ve al presionar "Crear Cuenta" */}
      <LoadingOverlay visible={loading} message="Un momento, por favor espera..." />

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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: palette.lightGray,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: palette.mediumGray,
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