import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeHeader from '../../../../components/common/HomeHeader';
import BottomNavigation from '../../../../components/common/BottomNavigation';
import { palette } from '../../../../theme/colors';

export default function AttendancesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Attendance Management 🕒</Text>
        <Text style={styles.subtitle}>Manage your gym attendance here</Text>
      </View>

      <BottomNavigation navigation={navigation} tabActiva="Attendances" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.white },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: palette.darkBlue, marginBottom: 8 },
  subtitle: { fontSize: 14, color: palette.mediumGray, textAlign: 'center' }
});