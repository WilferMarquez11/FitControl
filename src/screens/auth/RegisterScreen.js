import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { palette } from '../../theme/colors';
import CustomAuthInput from '../../components/auth/CustomAuthInput';
import CustomButton from '../../components/auth/CustomButton';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import AuthLogo from '../../components/auth/AuthLogo';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      // Aquí luego puedes mostrar un mensaje de error real (Alert, Toast, etc.)
      console.log('Las contraseñas no coinciden');
      return;
    }

     setLoading(true);
  setTimeout(() => {
    setLoading(false);
    navigation.navigate('GymSetup'); // 👈 solo para ver la pantalla
  }, 1500);
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
      {/* Logo es un componente */}
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

      {/* Botón Crear Cuenta (Primario usando tu componente personalizado) */}
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

      {/* Overlay de carga mientras se crea la cuenta */}
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
  logo: {
    width: '100%',
    height: 150,
    marginBottom: 10,
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