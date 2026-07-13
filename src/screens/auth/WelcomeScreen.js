import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, Animated, ActivityIndicator } from 'react-native';
import { palette } from "../../theme/colors";

export default function WelcomeScreen({ navigation }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.Image
          source={require('../../../assets/1LogoPrincipal.png')}
          style={[styles.logoImage, { opacity, transform: [{ scale }] }]}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color={palette.darkYellow} style={styles.spinner} />
        <Text style={styles.loadingText}>Cargando tu experiencia...</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.byText}>By</Text>
        <Text style={styles.companyText}>WO Devs</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.white,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 450,
    height: 450,
  },
  spinner: {
    marginTop: 30,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 14,
    color: palette.darkBlue,
  },
  footer: {
    marginBottom: 100,
    alignItems: 'center',
  },
  byText: {
    fontSize: 16,
    color: palette.darkBlue,
  },
  companyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.darkYellow,
  },
});