// navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import MainStackNavigator from './MainStackNavigator'; 
import ProfileScreen from '../src/screens/ProfileScreen';
import ProgressScreen from '../src/screens/ProgressScreen';

const { width, height } = Dimensions.get('window');

// Función para determinar si el tabBar debe ocultarse
function getTabBarVisibility(route: any) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeMain';
  
  // Ocultar el tabBar en las pantallas de lecciones y videos (como Duolingo)
  const hiddenScreens = ['Cnne', 'LuzHogar', 'PreciosFactura', 'Obligaciones', 'Alumbrado', 'AdminMetrics', 'Electricidad', 'VideoGallery'];
  
  if (hiddenScreens.includes(routeName)) {
    return 'none'; // Ocultar
  }
  
  return 'flex'; // Mostrar
}

export type TabParamList = {
  Home: undefined;
  Progress: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  
  // Calcular altura del tab bar considerando el área segura del dispositivo
  const tabBarHeight = Platform.OS === 'ios' 
    ? height * 0.075 + insets.bottom 
    : height * 0.07 + (insets.bottom > 0 ? insets.bottom : 8);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          backgroundColor: '#1e1b4b',
          borderTopWidth: 0,
          paddingTop: height * 0.008,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          paddingHorizontal: width * 0.05,
          ...Platform.select({
            ios: {
              shadowColor: '#8b5cf6',
              shadowOffset: { width: 0, height: -6 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
            },
            android: {
              elevation: 20,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: width * 0.026,
          fontWeight: '700',
          marginTop: 3,
          marginBottom: 0,
          fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
          letterSpacing: 0.3,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string = '';

          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Progress') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return (
            <View style={{
              backgroundColor: focused ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
              borderRadius: 10,
              padding: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name={iconName as any} size={22} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#e879f9',
        tabBarInactiveTintColor: '#ffffff',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={MainStackNavigator}
        options={({ route }) => ({
          tabBarLabel: 'HOME',
          tabBarStyle: {
            display: getTabBarVisibility(route),
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: tabBarHeight,
            backgroundColor: '#1e1b4b',
            borderTopWidth: 0,
            paddingTop: height * 0.01,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            paddingHorizontal: width * 0.05,
            ...Platform.select({
              ios: {
                shadowColor: '#8b5cf6',
                shadowOffset: { width: 0, height: -6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
              },
              android: {
                elevation: 20,
              },
            }),
          }
        })}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{
          tabBarLabel: 'PROGRESO'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'PERFIL'
        }}
      />
    </Tab.Navigator>
  );
}
