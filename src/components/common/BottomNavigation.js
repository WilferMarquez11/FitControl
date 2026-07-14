// src/components/common/BottomNavigation.js
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
// 🚨 Usamos Expo Vector Icons para mantener consistencia con el resto de la app
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import { palette } from "../../theme/colors"; // Ajusta la ruta a tu paleta de colores

export default function BottomNavigation({ navigation, tabActiva }) {

  // 🏋️‍♂️ Íconos y rutas totalmente adaptados para la gestión de un Gimnasio
  const navItems = [
    {
      icon: "home",
      screen: "PanelOwner", // Pantalla principal (Métricas rápidas, dashboard)
    },
    {
      icon: "account-group",
      screen: "GestionClientes", // Gestión de Clientes (Inscripciones, asistencia)
    },
    {
      icon: "card-account-details-star",
      screen: "GestionMembresias", // Gestión de Planes y Membresías
    },
    {
      icon: "account-tie", 
      screen: "GestionEntrenadores", // Gestión de Entrenadores / Staff
    },
    {
      icon: "cog",
      screen: "ConfiguracionGym", // Ajustes del Gimnasio (Horarios, perfil, etc.)
    },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const isActiva = tabActiva === item.screen;
        return (
          <TouchableOpacity
            key={item.screen}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
            style={styles.navButton}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={26}
              // 🚨 Usamos tus colores de palette (darkBlue para activo, mediumGray para inactivo)
              color={isActiva ? palette.darkBlue : palette.mediumGray}
            />
            {/* Pequeño punto indicador debajo del ícono activo para dar un toque premium */}
            {isActiva && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: palette.white,
    borderRadius: 18,
    position: "absolute",
    bottom: 30, // 🚨 Bajado un poco a 30 para que no tape el contenido útil en pantallas medianas
    alignSelf: "center",
    width: "90%",
    elevation: 8,
    // Sombras premium adaptadas para tu tema oscuro/azul
    shadowColor: palette.darkBlue,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 40,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: palette.darkBlue,
    marginTop: 3,
  }
});