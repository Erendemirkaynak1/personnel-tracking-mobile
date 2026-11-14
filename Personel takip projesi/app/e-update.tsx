import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { updateEmployee, fetchDepartments, getEmployee } from '../services/database';

type Department = {
  id: number;
  name: string;
};

type EmployeeFormData = {
  first_name: string;
  last_name: string;
  birth_date: string;
  email_address: string;
  contact_number: string;
  salary: string;
  department_id: number;
};

const EUpdate = () => {
  const router = useRouter();
  const { employeeId } = useLocalSearchParams() as { employeeId?: string };

  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState<EmployeeFormData>({
    first_name: '',
    last_name: '',
    birth_date: '',
    email_address: '',
    contact_number: '',
    salary: '',
    department_id: 0,
  });
  const [loading, setLoading] = useState(false);
  const [loadingEmployee, setLoadingEmployee] = useState(true);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const depts = await fetchDepartments();
        const formattedDepts = Object.entries(depts || {}).map(([id, dept]) => ({
          id: Number(id),
          name: dept.department_name
        }));
        setDepartments(formattedDepts);
      } catch (error) {
        Alert.alert('Hata', 'Departmanlar yüklenemedi');
      }
    };

    const loadEmployee = async () => {
      if (!employeeId) {
        Alert.alert('Hata', 'Çalışan ID bulunamadı');
        router.back();
        return;
      }
      try {
        const employee = await getEmployee(employeeId);
        if (employee) {
          setFormData({
            first_name: employee.first_name || '',
            last_name: employee.last_name || '',
            birth_date: employee.birth_date || '',
            email_address: employee.email_address || '',
            contact_number: employee.contact_number || '',
            salary: employee.salary ? String(employee.salary) : '',
            department_id: employee.department_id || 0,
          });
        } else {
          Alert.alert('Hata', 'Çalışan bulunamadı');
          router.back();
        }
      } catch (error) {
        Alert.alert('Hata', 'Çalışan verisi yüklenirken hata oluştu');
        router.back();
      } finally {
        setLoadingEmployee(false);
      }
    };

    loadDepartments();
    loadEmployee();
  }, [employeeId]);

  const handleInputChange = (name: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.first_name || !formData.last_name) {
      Alert.alert('Hata', 'Ad ve soyad zorunludur');
      return;
    }

    if (formData.department_id === 0) {
      Alert.alert('Hata', 'Lütfen bir departman seçin');
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        salary: Number(formData.salary),
        department_id: Number(formData.department_id),
        updated_at: new Date().toISOString(),
      };

      await updateEmployee(employeeId!, updatedData);

      Alert.alert('Başarılı', 'Çalışan başarıyla güncellendi', [
        {
          text: 'Tamam',
          onPress: () => {
            // Employees sayfasına yönlendir ve yenileme parametresi ekle
            router.push({
              pathname: '/employees',
              params: { refresh: new Date().getTime() }
            });
          }
        }
      ]);
    } catch (error) {
      console.error('Error updating employee: ', error);
      Alert.alert('Hata', 'Çalışan güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loadingEmployee) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1D3D47" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Çalışan Güncelle</Text>

      <TextInput
        style={styles.input}
        placeholder="Ad"
        value={formData.first_name}
        onChangeText={text => handleInputChange('first_name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Soyad"
        value={formData.last_name}
        onChangeText={text => handleInputChange('last_name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Doğum Tarihi (YYYY-MM-DD)"
        value={formData.birth_date}
        onChangeText={text => handleInputChange('birth_date', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email_address}
        onChangeText={text => handleInputChange('email_address', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefon"
        keyboardType="phone-pad"
        value={formData.contact_number}
        onChangeText={text => handleInputChange('contact_number', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Maaş"
        keyboardType="numeric"
        value={formData.salary}
        onChangeText={text => handleInputChange('salary', text)}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.department_id}
          onValueChange={itemValue =>
            setFormData(prev => ({ ...prev, department_id: itemValue }))
          }
          style={styles.picker}
          dropdownIconColor="#1D3D47"
        >
          <Picker.Item label="Departman Seçiniz" value={0} />
          {departments.map(department => (
            <Picker.Item 
              key={department.id} 
              label={department.name} 
              value={department.id} 
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Güncelle</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    color: '#1D3D47',
  },
  button: {
    backgroundColor: '#1D3D47',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EUpdate;