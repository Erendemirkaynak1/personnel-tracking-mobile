import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { get,ref} from 'firebase/database';
import { database } from '../firebaseConfig';
import { fetchDepartments } from '../services/database';

interface BonusRecord {
  id: string;
  department_id: number;
  month: number;
  bonus: number;
}

interface Department {
  id: number;
  name: string;
}

export default function BonusScreen() {
  const [bonuses, setBonuses] = useState<BonusRecord[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch bonus records
        const snap = await get(ref(database, 'bonus'));
        const data = snap.val() || {};
        const bonusArray: BonusRecord[] = Object.entries(data).map(
          ([id, val]: [string, any]) => ({
            id,
            department_id: Number(val.department_id),
            month: Number(val.month),
            bonus: Number(val.bonus)
          })
        );

        // Fetch departments
        const deptData = await fetchDepartments();

        setBonuses(bonusArray);
        setDepartments(deptData);
      } catch (error) {
        console.error('Error loading bonus data:', error);
        Alert.alert('Hata', 'Bonus verileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const renderItem = ({ item }: { item: BonusRecord }) => {
    const dept = departments.find(d => d.id === item.department_id);
    return (
      <View style={styles.card}>
        <Text style={styles.department}>
          Departman: {dept ? dept.name : `ID ${item.department_id}`}
        </Text>
        <Text>Ay: {monthNames[item.month - 1] || item.month}</Text>
        <Text style={styles.bonus}>İkramiye: {item.bonus.toLocaleString()} TL</Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bonuslar</Text>
      <FlatList
        data={bonuses}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Henüz bonus kaydı yok.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D3D47',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  department: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D3D47',
    marginBottom: 4,
  },
  bonus: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});
