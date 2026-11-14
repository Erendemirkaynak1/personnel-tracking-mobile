import { Stack } from 'expo-router';
//import { MenuButton } from '@/components/MenuButton';
import { View, StyleSheet, Platform } from 'react-native';
import { usePathname } from 'expo-router';
export default function RootLayout() {
  const pathname = usePathname();
  //index de layoutu gizler
  if (pathname === '/' || pathname === '/index') { // Android bazen '/index' kullanıyor
    return <Stack screenOptions={{ headerShown: false }} />
  }
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTitle: 'Personel Takip Sistemi',
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
         // headerShown: !isLoginPage,
        }}
      />
      <View style={styles.menuContainer}>
       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    height: Platform.select({ ios: 100, android: 60 }), // Platforma göre yükseklik
    backgroundColor: '#1D3D47', // Header arkaplan rengi
  },
  headerTitle: {
    color: 'white', // Başlık rengi
    fontWeight: 'bold',
  },
  menuContainer: {
    position: 'absolute',
    top: Platform.select({ ios: 60, android: 15 }), // Platforma göre konum
    right: 20,
    zIndex: 1000,
    //backgroundColor: 'rgba(255,255,255,0.3)', // Buton arkaplanı
    borderRadius: 20,
    padding: 8,
  },
});