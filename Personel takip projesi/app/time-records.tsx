import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { getAllEmployees, addTimeRecord } from '../services/database';
import { get, ref, remove } from 'firebase/database';
import { database } from '../firebaseConfig';

interface TimeRecord {
  id: string;
  employeeId: string;
  entryTime: string;
  exitTime: string;
  createdAt: string;
}

export default function TimeRecords() {
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Zaman kayıtlarını çek
        const snap = await get(ref(database, 'timeRecords'));
        const recObj = snap.val() || {};
        const recArray: TimeRecord[] = Object.entries(recObj).map(
          ([id, val]: [string, any]) => ({
            id,
            employeeId: val.employeeId,
            entryTime: val.entryTime,
            exitTime: val.exitTime,
            createdAt: val.createdAt,
          })
        );
        setTimeRecords(recArray);

        // Çalışanları çek
        const empObj = await getAllEmployees();
        const empArr = Object.entries(empObj || {}).map(
          ([id, emp]: [string, any]) => ({
            id,
            ...emp
          })
        );
        setEmployees(empArr);
      } catch (e) {
        console.error(e);
        Alert.alert('Hata', 'Veriler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if (!employeeId) return Alert.alert('Hata','Çalışan seçmelisiniz');
    if (!entryTime||!exitTime) return Alert.alert('Hata','Zamanları doldurun');

    try {
      await addTimeRecord({ employeeId, entryTime, exitTime });
      Alert.alert('Başarılı','Kayıt eklendi');
      resetForm();
      reloadRecords();
    } catch {
      Alert.alert('Hata','Eklerken sorun oluştu');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Sil','Silmek istediğinize emin misiniz?',[
      {text:'İptal',style:'cancel'},
      {text:'Sil',style:'destructive',onPress:async()=>{
        await remove(ref(database, `timeRecords/${id}`));
        reloadRecords();
      }}
    ]);
  };

  const handleEdit = (record: TimeRecord) => {
    setEditingId(record.id);
    setEmployeeId(record.employeeId);
    setEntryTime(record.entryTime);
    setExitTime(record.exitTime);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEntryTime('');
    setExitTime('');
    setEmployeeId('');
    setEditingId(null);
  };

  const reloadRecords = async () => {
    const snap = await get(ref(database, 'timeRecords'));
    const recObj = snap.val() || {};
    setTimeRecords(Object.entries(recObj).map(
      ([id, val]: [string, any]) => ({
        id, employeeId: val.employeeId,
        entryTime: val.entryTime, exitTime: val.exitTime,
        createdAt: val.createdAt
      })
    ));
  };

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;

  const renderItem = ({ item }: { item: TimeRecord }) => {
    const emp = employees.find(e => e.id === item.employeeId);
    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>
            {emp ? `${emp.first_name} ${emp.last_name}` : 'Bilinmeyen Çalışan'}
          </Text>
          <Text>Giriş: {item.entryTime} | Çıkış: {item.exitTime}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Ionicons name="create-outline" size={24} color="#1D3D47" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 12 }}>
            <Ionicons name="trash-outline" size={24} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Button
        title={showAddForm ? 'İptal' : editingId ? 'Düzenle' : 'Zaman Kaydı Ekle'}
        onPress={() => {
          if (showAddForm) resetForm();
          else setShowAddForm(true);
        }}
      />

      {showAddForm && (
        <View style={styles.form}>
          <Text style={styles.label}>Çalışan</Text>
          <Picker
            selectedValue={employeeId}
            onValueChange={setEmployeeId}
            style={styles.picker}
          >
            <Picker.Item label="Seçiniz" value="" />
            {employees.map(e => (
              <Picker.Item
                key={e.id}
                label={`${e.first_name} ${e.last_name}`}
                value={e.id}
              />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Giriş (09:00)"
            value={entryTime}
            onChangeText={setEntryTime}
          />
          <TextInput
            style={styles.input}
            placeholder="Çıkış (18:00)"
            value={exitTime}
            onChangeText={setExitTime}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveTxt}>{editingId ? 'Güncelle' : 'Kaydet'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={timeRecords}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#fff' },
  loader: { marginTop:50 },
  form: { marginVertical:16, padding:16, backgroundColor:'#f0f0f0', borderRadius:8 },
  label: { fontWeight:'bold', marginBottom:8 },
  picker: { height:50, marginBottom:12 },
  input: { height:40, borderColor:'#ccc', borderWidth:1, marginBottom:12, borderRadius:4, paddingHorizontal:8 },
  saveBtn: { backgroundColor:'#1D3D47', padding:12, borderRadius:4, alignItems:'center' },
  saveTxt: { color:'#fff', fontWeight:'bold' },
  card: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:12,
    backgroundColor:'#fafafa',
    borderRadius:6,
    marginBottom:10,
  },
  cardInfo: { flex:1 },
  name: { fontWeight:'bold', marginBottom:4 },
  actions: { flexDirection:'row' },
});
