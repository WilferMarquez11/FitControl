// src/components/common/ProfileMenuCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

/**
 * Tarjeta de menú con botones de navegación o acción para la pantalla de perfil.
 * @param {string} title - Título que se muestra arriba de la tarjeta (ej: "Cuenta")
 * @param {Array} options - Lista de botones/opciones a renderizar
 * @param {string} options[].label - Texto que se mostrará en la opción
 * @param {string} options[].icon - Nombre del icono de MaterialCommunityIcons
 * @param {function} options[].onPress - Función que se ejecuta al presionar la opción
 * @param {boolean} [options[].danger] - Si es true, pinta la fila de color rojo (para acciones de riesgo o salida)
 */
export default function ProfileMenuCard({ title, options = [] }) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  return (
    <View style={styles.sectionContainer}>
      {/* Título de la sección reactivo */}
      <Text style={[styles.sectionTitle, { color: tema.textColor }]}>{title}</Text>
      
      {/* Tarjeta de menú reactiva */}
      <View style={[
        styles.menuCard, 
        { backgroundColor: tema.cardBackground, borderColor: tema.borderColor }
      ]}>
        {options.map((option, index) => {
          const isLast = index === options.length - 1;
          const isDanger = option.danger;
          
          // Colores inteligentes: si es de peligro usa rojo, si no, usa tus colores de tema/amarillo
          const iconColor = isDanger ? palette.red : palette.lightGreen;
          const textColor = isDanger ? palette.red : tema.textColor;
          const chevronColor = isDanger ? palette.red : tema.subTextColor;
          const textWeight = isDanger ? 'bold' : '500';

          return (
            <View key={option.label || index}>
              <TouchableOpacity 
                style={styles.menuRow} 
                onPress={option.onPress} 
                activeOpacity={0.7}
              >
                <View style={styles.rowLeft}>
                  {/* Icono de la izquierda */}
                  <MaterialCommunityIcons 
                    name={option.icon} 
                    size={22} 
                    color={iconColor} 
                    style={styles.rowIcon} 
                  />
                  {/* Texto de la opción */}
                  <Text style={[styles.menuText, { color: textColor, fontWeight: textWeight }]}>
                    {option.label}
                  </Text>
                </View>

                {/* Flecha indicadora de la derecha */}
                <MaterialCommunityIcons 
                  name="chevron-right" 
                  size={20} 
                  color={chevronColor} 
                />
              </TouchableOpacity>
              
              {/* Línea divisoria reactiva */}
              {!isLast && <View style={[styles.divider, { backgroundColor: tema.borderColor }]} />}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 14,
  },
  divider: {
    height: 1,
  },
});