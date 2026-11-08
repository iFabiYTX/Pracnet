import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MuroScreen from './src/screens/MuroScreen';
import SeguimientoScreen from './src/screens/SeguimientoScreen';
import ValidacionScreen from './src/screens/ValidacionScreen';
import PerfilScreen from './src/screens/PerfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Barra de Navegación Inferior (Bottom Tabs) - Exacta del Mockup Móvil 9.1:
// [Muro] [Postulaciones] [Documentación] [Perfil]
function StudentTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0'
        },
        tabBarActiveTintColor: '#0284C7',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600'
        }
      }}
    >
      <Tab.Screen
        name="Muro"
        component={MuroScreen}
        options={{
          tabBarLabel: 'Muro',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabDot, focused && styles.tabDotActive]} />
          )
        }}
      />
      <Tab.Screen
        name="Postulaciones"
        component={SeguimientoScreen}
        options={{
          tabBarLabel: 'Postulaciones',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabDot, focused && styles.tabDotActive]} />
          )
        }}
      />
      <Tab.Screen
        name="Documentacion"
        component={ValidacionScreen}
        options={{
          tabBarLabel: 'Documentación',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabDot, focused && styles.tabDotActive]} />
          )
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabDot, focused && styles.tabDotActive]} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

function NavigationRoot() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationRoot />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabDot: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#E2E8F0'
  },
  tabDotActive: {
    backgroundColor: '#0284C7'
  }
});
