import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getIdTokenResult, onIdTokenChanged, signOut } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { auth as firebaseAuth } from '../firebaseConfig';

const auth: Auth = firebaseAuth;

// Protect the entire route tree. Root-level pages such as /employees and
// /time-records are siblings of the (tabs) group and must be guarded here.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const isLoginRoute = pathname === '/' || pathname === '/index';

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    let active = true;

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        if (active) setIsAdmin(false);
        return;
      }

      try {
        // The token-change listener already fires after token refresh; forcing
        // another refresh here could create a refresh/listener loop.
        const token = await getIdTokenResult(user);
        const authorized = token.claims.admin === true;

        if (!authorized) {
          await signOut(auth);
        }

        if (active) setIsAdmin(authorized);
      } catch {
        try {
          await signOut(auth);
        } catch {
          // Fail closed locally; the database rules independently deny access.
        }
        if (active) setIsAdmin(false);
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

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isAdmin === null ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1D3D47" />
        </View>
      ) : !isLoginRoute && !isAdmin ? null : (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});
