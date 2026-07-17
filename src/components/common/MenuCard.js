// src/components/common/MenuCard.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

export default function MenuCard({ 
  title, 
  subtitle, 
  iconName, 
  iconColor, 
  iconBgColor, 
  accentColor, 
  onPress 
}) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  // Si no pasan un accentColor, usamos un color inteligente según el tema activo
  const finalAccentColor = accentColor || (tema.dark ? palette.darkYellow : palette.darkBlue);

  // Determinamos el color del subtítulo: blanco en modo oscuro, y el textColor principal en modo claro
  const subtitleColor = tema.dark ? palette.white : tema.textColor;

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          backgroundColor: tema.cardBackground, 
          borderColor: tema.borderColor,
          borderBottomColor: finalAccentColor 
        }
      ]} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
        <MaterialCommunityIcons name={iconName} size={28} color={iconColor} />
      </View>
      
      {/* Título adaptable */}
      <Text style={[styles.cardTitle, { color: tema.subTextColor }]}>{title}</Text>
      
      {/* Subtítulo adaptable: Blanco en modo oscuro, y color principal de texto en modo claro */}
      <Text style={[styles.cardSubtitle, { color: subtitleColor }]}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderBottomWidth: 5,
    
    // Sombras premium
    elevation: 3,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  iconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
});