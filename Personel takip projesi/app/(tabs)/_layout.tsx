import React from 'react';
import { Stack } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

// Authentication is enforced in app/_layout.tsx for every route.
export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTitle: 'Personel Takip Sistemi',
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <View style={styles.menuContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: Platform.select({ ios: 100, android: 60 }),
    backgroundColor: '#1D3D47',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  menuContainer: {
    position: 'absolute',
    top: Platform.select({ ios: 60, android: 15 }),
    right: 20,
    zIndex: 1000,
    borderRadius: 20,
    padding: 8,
  },
});
