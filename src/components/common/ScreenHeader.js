// src/components/common/ScreenHeader.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { palette } from "../../theme/colors"; // 👈 Importamos tu paleta real

// 🌟 Importamos el hook del tema
import { useTheme } from "../../theme/ThemeContext";

export default function ScreenHeader({ title }) {
  const navigation = useNavigation();
  // 🌟 Consumimos el tema activo y el indicador de modo oscuro
  const { tema, modoOscuro } = useTheme();

  return (
    <View style={[
      styles.header, 
      { 
        backgroundColor: tema.headerBackground || tema.backgroundColor, 
        borderBottomWidth: 0 // 👈 Ponlo en 0 para eliminar la puta línea gris en ambos modos
      }
    ]}>
      {/* Botón de retroceso */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
        activeOpacity={0.6}
      >
        <Icon
          name="arrow-left"
          size={24}
          color={tema.textColor}
        />
      </TouchableOpacity>

      {/* Título centrado */}
      <Text style={[styles.headerTitle, { color: tema.textColor }]} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
});