import React, { useEffect, useState } from 'react';
import { Stack, usePathname, useRouter } from 'expo-router';
import { ActivityIndicator, View, StyleSheet, Platform } from 'react-native';
import { getIdTokenResult, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const isLoginRoute = pathname === '/' || pathname === '/index';

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (active) setIsAdmin(false);
        return;
      }

      try {
        const token = await getIdTokenResult(user, true);
        const authorized = token.claims.admin === true;
        if (!authorized) {
          await signOut(auth);
        }
        if (active) setIsAdmin(authorized);
      } catch {
        try {
          await signOut(auth);
        } finally {
          if (active) setIsAdmin(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAdmin === null) return;
    if (!isLoginRoute && !isAdmin) {
      router.replace('/');
    } else if (isLoginRoute && isAdmin) {
      router.replace('/home');
    }
  }, [isAdmin, isLoginRoute, router]);

  if (!isLoginRoute && isAdmin === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1D3D47" />
      </View>
    );
  }

  if (!isLoginRoute && !isAdmin) return null;

  if (isLoginRoute) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
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
