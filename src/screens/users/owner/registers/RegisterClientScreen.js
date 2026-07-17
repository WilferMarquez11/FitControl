import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeHeader from '../../../../components/common/HomeHeader';
import { palette } from '../../../../theme/colors';

export default function RegisterClientScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Register Client 👥</Text>
        <Text style={styles.subtitle}>Register new clients here</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.white },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: palette.darkBlue, marginBottom: 8 },
  subtitle: { fontSize: 14, color: palette.mediumGray, textAlign: 'center' }
});