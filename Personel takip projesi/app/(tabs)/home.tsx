import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { logoutUser } from '../../services/database';

type AppRoute = '/employees' | '/bonus' | '/devices' | '/time-records';

export default function HomePage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const menuItems = [
    { title: 'Çalışanlar', icon: 'people' as const, route: '/employees' as AppRoute },
    { title: 'Bonuslar', icon: 'cash' as const, route: '/bonus' as AppRoute },
    { title: 'Cihazlar', icon: 'phone-portrait' as const, route: '/devices' as AppRoute },
    { title: 'Zaman Kayıtları', icon: 'time' as const, route: '/time-records' as AppRoute },
  ];

  const handlePress = (route: AppRoute) => {
    router.push(route);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
      router.replace('/');
    } catch {
      Alert.alert('Çıkış yapılamadı', 'Oturum kapatılırken bir hata oluştu. Tekrar deneyin.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personel Takip Sistemi</Text>
      <View style={styles.grid}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.button}
            onPress={() => handlePress(item.route)}
            accessibilityRole="button"
          >
            <Ionicons name={item.icon} size={32} color="#1D3D47" />
            <Text style={styles.buttonText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={loggingOut}
        accessibilityRole="button"
      >
        {loggingOut ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>Güvenli Çıkış</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#1D3D47',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1D3D47',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 32,
    minWidth: 180,
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#9B2C2C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutButtonDisabled: {
    opacity: 0.65,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
