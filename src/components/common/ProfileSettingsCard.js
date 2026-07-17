// src/components/common/ProfileSettingsCard.js
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

/**
 * Tarjeta de ajustes con interruptores (Switch) reutilizable.
 * @param {string} title - Título de la sección (ej: "Ajustes de la Aplicación")
 * @param {Array} settings - Lista de ajustes a renderizar
 */
export default function ProfileSettingsCard({ title, settings = [] }) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  return (
    <View style={styles.sectionContainer}>
      {/* Título de sección reactivo al tema */}
      <Text style={[styles.sectionTitle, { color: tema.textColor }]}>{title}</Text>
      
      {/* Tarjeta reactiva al tema (fondo y bordes) */}
      <View style={[
        styles.settingsCard, 
        { backgroundColor: tema.cardBackground, borderColor: tema.borderColor }
      ]}>
        {settings.map((item, index) => {
          const isLast = index === settings.length - 1;
          return (
            <View key={item.key || index}>
              <View style={styles.settingRow}>
                <View style={styles.rowLeft}>
                  {/* Icono del ajuste reactivo */}
                  <MaterialCommunityIcons 
                    name={item.icon} 
                    size={22} 
                    color={palette.darkYellow} 
                    style={styles.rowIcon} 
                  />
                  {/* Texto del ajuste reactivo */}
                  <Text style={[styles.settingText, { color: tema.textColor }]}>{item.label}</Text>
                </View>
                
                {/* Switch con colores de track adaptables */}
                <Switch
                  value={item.value}
                  onValueChange={item.onValueChange}
                  trackColor={{ false: tema.borderColor, true: palette.darkYellow }}
                  thumbColor={palette.white}
                />
              </View>
              {/* Divisor reactivo */}
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
  settingsCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  settingRow: {
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
  settingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
  },
});