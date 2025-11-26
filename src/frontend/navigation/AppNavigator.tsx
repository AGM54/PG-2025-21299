import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';
import WelcomeScreen from '../screens/Welcome/WelcomeScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgontPassword/ForgotPasswordScreen';
import ElectricidadScreen from '../screens/Electricidad/ElectricidadScreen';
import ElectronLessonScreen from '../screens/Electricidad/ElectronLessonScreen';
import GeneracionScreen from '../screens/Electricidad/Generacion/generacion'; 
import VcrScreen from '../screens/vcr/vcr';
import ConductoresYaScreen from '../screens/conductoresya/conductoresya';
import CnneScreen from '../screens/cnne/CnneScreen'; 
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Electricidad" component={ElectricidadScreen} />
        <Stack.Screen name="ElectronLesson" component={ElectronLessonScreen} />
        <Stack.Screen name="Generacion" component={GeneracionScreen} /> 
        <Stack.Screen name="Vcr" component={VcrScreen} />
        <Stack.Screen name="ConductoresYa" component={ConductoresYaScreen} />
        <Stack.Screen name="Cnne" component={CnneScreen} /> 
        <Stack.Screen name="Tabs" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
