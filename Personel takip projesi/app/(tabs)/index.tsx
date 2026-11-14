import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import { loginUser } from '../../services/database';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = !!state.isConnected && state.isInternetReachable !== false;
      setIsConnected(connected);
      if (!connected) {
        Alert.alert('İnternet Bağlantısı Yok', 'Lütfen internet bağlantınızı kontrol edin.');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (isConnected !== true) {
      Alert.alert('Bağlantı gerekli', 'Giriş yapmak için internet bağlantınızı kontrol edin.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      Alert.alert('Eksik bilgi', 'Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(normalizedEmail, password);
      if (result.success) {
        Alert.alert('Giriş Başarılı', 'Yönetici oturumu açıldı.');
        router.replace('/home');
      } else {
        Alert.alert('Giriş Başarısız', result.error);
      }
    } finally {
      setPassword('');
      setLoading(false);
    }
  };

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
        placeholder="Yönetici e-posta adresi"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        editable={isConnected && !loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        textContentType="password"
        editable={isConnected && !loading}
      />
      <TouchableOpacity
        style={[styles.button, (!isConnected || loading) && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading || !isConnected}
        accessibilityRole="button"
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
