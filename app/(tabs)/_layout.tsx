import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
  screenOptions={{
   // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false,
  }}
>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="home" size={size} color={color} />
      ),
    }}
  />

  <Tabs.Screen
    name="add-entry"
    options={{
      title: 'Add',
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="plus-circle" size={size} color={color} />
      ),
    }}
  />

  <Tabs.Screen
    name="settings"
    options={{
      title: 'Settings',
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="cog" size={size} color={color} />
      ),
    }}
  />
</Tabs>
  );
}
