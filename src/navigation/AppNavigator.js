import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RecoverScreen from '../screens/auth/RecoverScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PanelOwnerScreen from '../screens/users/owner/PanelOwnerScreen';
import PanelTrainerScreen from '../screens/users/trainer/PanelTrainerScreen';
import GymSetupScreen from '../screens/users/owner/GymSetupScreen';

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
        <Stack.Screen name="PanelOwner" component={PanelOwnerScreen} />
        <Stack.Screen name="PanelTrainer" component={PanelTrainerScreen} />
        <Stack.Screen name="GymSetup" component={GymSetupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}