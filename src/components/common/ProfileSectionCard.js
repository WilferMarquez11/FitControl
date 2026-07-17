// src/components/common/ProfileSectionCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';

// 🌟 Importamos el hook del tema
import { useTheme } from '../../theme/ThemeContext';

/**
 * Tarjeta de sección de perfil reutilizable.
 * @param {string} title - Título de la sección (ej: "Información Personal")
 * @param {function} onEditPress - Acción al presionar el lápiz de edición (si no se envía, no se muestra el botón)
 * @param {Array<{label: string, value: string}>} fields - Campos a renderizar en la tarjeta
 */
export default function ProfileSectionCard({ title, onEditPress, fields = [] }) {
  // 🌟 Consumimos el tema activo
  const { tema } = useTheme();

  return (
    <View style={styles.sectionContainer}>
      {/* CABECERA DE LA SECCIÓN */}
      <View style={styles.sectionHeaderRow}>
        {/* Usamos el color de texto principal para el título de la sección */}
        <Text style={[styles.sectionTitle, { color: tema.textColor }]}>{title}</Text>
        {onEditPress && (
          <TouchableOpacity 
            onPress={onEditPress}
            activeOpacity={0.6}
            style={styles.editButton}
          >
            <MaterialCommunityIcons name="pencil-outline" size={20} color={palette.darkYellow} />
          </TouchableOpacity>
        )}
      </View>

      {/* TARJETA CON LA INFORMACIÓN */}
      {/* El fondo de la tarjeta y el borde se adaptan al tema */}
      <View style={[
        styles.infoCard, 
        { backgroundColor: tema.cardBackground, borderColor: tema.borderColor }
      ]}>
        {fields.map((field, index) => {
          const isLast = index === fields.length - 1;
          return (
            <View key={field.label || index}>
              <View style={styles.infoRow}>
                {/* La etiqueta usa el texto principal o secundario según prefieras */}
                <Text style={[styles.infoLabel, { color: tema.textColor }]}>{field.label}</Text>
                {/* El valor usa el color de texto secundario (gris claro en oscuro, gris medio en claro) */}
                <Text style={[styles.infoValue, { color: tema.subTextColor }]} numberOfLines={2}>
                  {field.value}
                </Text>
              </View>
              {/* El divisor cambia de color según el tema */}
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  editButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Mantiene alineados verticalmente los textos
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 16,       // Espacio de seguridad para que no choque con el valor
    flexShrink: 0,         // Evita que la etiqueta se encoja o se rompa 
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,               // Toma todo el espacio disponible en la fila
    textAlign: 'right',    // Alinea el texto a la derecha
  },
  divider: {
    height: 1,
  },
});