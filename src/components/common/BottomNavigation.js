// src/components/common/BottomNavigation.js
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
// 🚨 Usamos Expo Vector Icons para mantener consistencia con el resto de la app
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import { palette } from "../../theme/colors"; // Ajusta la ruta a tu paleta de colores

// 🌟 Importamos el hook del tema
import { useTheme } from "../../theme/ThemeContext";

export default function BottomNavigation({ navigation, tabActiva }) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  // 🏋️‍♂️ Íconos y rutas totalmente adaptados para la gestión de un Gimnasio
  const navItems = [
    {
      icon: "home",
      screen: "PanelOwner", // 1. Inicio (Panel principal)
    },
    {
      icon: "account-group",
      screen: "Clients", // 2. Gestión de Clientes
    },
    {
      icon: "card-account-details-star",
      screen: "Memberships", // 3. Gestión de Membresías
    },
    {
      icon: "currency-usd", 
      screen: "Payments", // 4. Pagos (Registros y abonos)
    },
    {
      icon: "calendar-check", 
      screen: "Attendances", // 5. Asistencias (Asistencias diarias)
    },
    {
      icon: "apps", 
      screen: "MoreServices", // 6. Más Servicios (Cuadritos)
    },
  ];

  return (
    <View style={[
      styles.bottomNav, 
      { 
        backgroundColor: tema.cardBackground, 
        borderColor: tema.borderColor,
        borderWidth: tema.borderColor ? 1 : 0 // Añade borde sutil para que resalte flotando en oscuro
      }
    ]}>
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
              // 🚨 Activo usa darkYellow, inactivo usa el color de texto secundario del tema actual
              color={isActiva ? palette.darkYellow : tema.subTextColor}
            />
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
    paddingVertical: 12, // Subimos ligeramente el padding para que respire mejor sin el punto
    borderRadius: 18,
    position: "absolute",
    bottom: 75, // 👈 Ajustado a 75 para que no quede ni muy pegado abajo ni muy arriba
    alignSelf: "center",
    width: "90%",
    elevation: 8,
    // Sombras premium adaptadas para tu tema oscuro/azul
    shadowColor: palette.black,
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
    height: 45,
  }
});