import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import { loginUser } from '../../services/database';
import { Ionicons } from '@expo/vector-icons';

type AppRoute = '/employees' | '/bonus' | '/devices' | '/time-records';
type IoniconsType = 'people' | 'cash' | 'phone-portrait' | 'time';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const router = useRouter();

  // Internet bağlantısı kontrolü
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = !!state.isConnected && !!state.isInternetReachable;
      setIsConnected(connected);
      if (!connected) {
        Alert.alert('İnternet Bağlantısı Yok', 'Lütfen internet bağlantınızı kontrol edin.');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (isConnected === false) {
      Alert.alert('İnternet Bağlantısı Yok', 'İnternet bağlantınızı kontrol ettikten sonra tekrar deneyin.');
      return;
    }
    if (!username || !password) {
      Alert.alert('Hata', 'Lütfen kullanıcı adı ve şifre alanlarını doldurun.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(username, password);
      if (result.success) {
        Alert.alert('Giriş Başarılı', `Hoş geldiniz, ${username}!`);
        router.push('/home');
      } else {
        Alert.alert('Hata', result.error || 'Giriş başarısız');
      }
    } catch (error) {
      let errorMessage = 'Bir hata oluştu';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Hata', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Bağlantı durumu belirsizken yükleme
  if (isConnected === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1D3D47" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personel Takip Programına Hoş Geldiniz</Text>
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
        editable={!!isConnected}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!!isConnected}
      />
      <TouchableOpacity
        style={[styles.button, !isConnected && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading || !isConnected}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    textAlign: 'center',
    color: '#1D3D47',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: 'white',
    color: '#333',
  },
  button: {
    backgroundColor: '#1D3D47',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
