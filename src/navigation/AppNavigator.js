import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RecoverScreen from '../screens/auth/RecoverScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import GymSetupScreen from '../screens/users/owner/GymSetupScreen';
import PanelOwnerScreen from '../screens/users/owner/PanelOwnerScreen';
import ProfileOwnerScreen from '../screens/users/owner/ProfileOwnerScreen';

import ClientsScreen from '../screens/users/owner/managements/ClientsScreen';
import MembershipsScreen from '../screens/users/owner/managements/MembershipsScreen';
import PaymentsScreen from '../screens/users/owner/managements/PaymentsScreen';
import AttendancesScreen from '../screens/users/owner/managements/AttendancesScreen';
import MoreServicesScreen from '../screens/users/owner/managements/MoreServicesScreen';

import RegisterClientScreen from '../screens/users/owner/registers/RegisterClientScreen';
import RegisterMembershipScreen from '../screens/users/owner/registers/RegisterMembershipScreen';
import RegisterPaymentScreen from '../screens/users/owner/registers/RegisterPaymentScreen';
import RegisterAttendanceScreen from '../screens/users/owner/registers/RegisterAttendanceScreen';

import PanelTrainerScreen from '../screens/users/trainer/PanelTrainerScreen';


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Bienvenido"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Bienvenido" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Recover" component={RecoverScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="GymSetup" component={GymSetupScreen} />
        <Stack.Screen name="PanelOwner" component={PanelOwnerScreen} />
        <Stack.Screen name="ProfileOwner" component={ProfileOwnerScreen} />
        <Stack.Screen name="Clients" component={ClientsScreen} />
        <Stack.Screen name="Memberships" component={MembershipsScreen} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
        <Stack.Screen name="Attendances" component={AttendancesScreen} />
        <Stack.Screen name="MoreServices" component={MoreServicesScreen} />
        <Stack.Screen name="PanelTrainer" component={PanelTrainerScreen} />
        <Stack.Screen name="RegisterClient" component={RegisterClientScreen} />
        <Stack.Screen name="RegisterMembership" component={RegisterMembershipScreen} />
        <Stack.Screen name="RegisterPayment" component={RegisterPaymentScreen} />
        <Stack.Screen name="RegisterAttendance" component={RegisterAttendanceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}