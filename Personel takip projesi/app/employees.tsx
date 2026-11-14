import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchEmployees, fetchDepartments, deleteEmployee } from '../services/database'; // deleteEmployee eklendi
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  department_id: number;
}

interface Department {
  id: number;
  name: string;
}

export default function Employees() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null); // Silinen öğe için state

  useEffect(() => {
    const loadData = async () => {
      try {
        const [employeeData, departmentData] = await Promise.all([
          fetchEmployees(),
          fetchDepartments(),
        ]);

        const employeeArray = Object.entries(employeeData || {}).map(
          ([id, employee]: [string, any]) => ({
            id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            department_id: Number(employee.department_id)
          })
        );

        const departmentArray = Object.entries(departmentData || {}).map(
          ([id, department]) => ({
            id: Number(id),
            name: department.department_name,
          })
        );

        setEmployees(employeeArray);
        setDepartments(departmentArray);
      } catch (error) {
        console.error('Data loading error:', error);
        Alert.alert('Hata', 'Veriler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDeleteEmployee = async (employeeId: string) => {
    Alert.alert(
      'Çalışanı Sil',
      'Bu çalışanı silmek istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          onPress: async () => {
            try {
              setDeletingId(employeeId);
              await deleteEmployee(employeeId);
              setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
              Alert.alert('Başarılı', 'Çalışan başarıyla silindi');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Hata', 'Çalışan silinirken bir hata oluştu');
            } finally {
              setDeletingId(null);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const filteredEmployees = employees.filter(employee => {
    const nameMatch = `${employee.first_name} ${employee.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const departmentMatch = 
      selectedDepartment === 'all' || 
      employee.department_id === selectedDepartment;

    return nameMatch && departmentMatch;
  });

  const getDepartmentName = (id: number) => {
    const department = departments.find(d => d.id === id);
    return department ? department.name : 'Bilinmeyen Departman';
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Çalışan ara..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDepartment}
            onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
            style={styles.picker}
            dropdownIconColor="#1D3D47"
          >
            <Picker.Item label="Tüm Departmanlar" value="all" />
            {departments.map((department) => (
              <Picker.Item 
                key={department.id} 
                label={department.name} 
                value={department.id} 
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Add Employee Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/e-add' as never)}
      >
        <Ionicons name="add-circle" size={28} color="white" />
        <Text style={styles.addButtonText}>Yeni Çalışan</Text>
      </TouchableOpacity>

      {/* Employee List */}
      <FlatList
        data={filteredEmployees}
        keyExtractor={(employee) => employee.id}
        renderItem={({ item: employee }) => (
          <View style={styles.employeeCard}>
            <View>
              <Text style={styles.name}>
                {employee.first_name} {employee.last_name}
              </Text>
              <Text style={styles.department}>
                {getDepartmentName(employee.department_id)} (ID: {employee.department_id})
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: '/e-update', params: { employeeId: employee.id } } as never)
                }
              >
                <Ionicons name="create" size={24} color="#1D3D47" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleDeleteEmployee(employee.id)}
                disabled={deletingId === employee.id}
              >
                {deletingId === employee.id ? (
                  <ActivityIndicator size="small" color="#dc3545" />
                ) : (
                  <Ionicons name="trash" size={24} color="#dc3545" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery || selectedDepartment !== 'all'
              ? `Aramanızla eşleşen çalışan bulunamadı (Filtre: ${selectedDepartment === 'all' ? 'Tümü' : selectedDepartment})`
              : 'Hiç çalışan bulunamadı'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  loader: {
    marginTop: 50,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  picker: {
    height: 40,
    color: '#1D3D47',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#1D3D47',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  employeeCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D3D47',
  },
  department: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
    paddingHorizontal: 20,
  },
});