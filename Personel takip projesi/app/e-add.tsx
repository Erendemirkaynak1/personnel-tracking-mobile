import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { addEmployee, fetchDepartments } from '../services/database';

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

const EAdd = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState<EmployeeFormData>({
    first_name: '',
    last_name: '',
    birth_date: '',
    email_address: '',
    contact_number: '',
    salary: '',
    department_id: 0
  });
  const [loading, setLoading] = useState(false);

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
    
    loadDepartments();
  }, []);

  const handleInputChange = (name: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      Alert.alert('Hata', 'Ad ve soyad zorunludur');
      return;
    }

    if (formData.department_id === 0) {
      Alert.alert('Hata', 'Lütfen bir departman seçin');
      return;
    }

    setLoading(true);
    try {
      const employeeData = {
        ...formData,
        salary: Number(formData.salary),
        department_id: formData.department_id,
        created_at: new Date().toISOString()
      };

      await addEmployee(employeeData);
      
      Alert.alert('Başarılı', 'Çalışan başarıyla eklendi', [
        {
          text: 'Tamam',
          onPress: () => {
            router.replace('/employees');
          }
        }
      ]);
      
    } catch (error) {
      console.error("Çalışan ekleme hatası: ", error);
      Alert.alert('Hata', 'Çalışan eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yeni Çalışan Ekle</Text>

      <TextInput
        style={styles.input}
        placeholder="Ad"
        value={formData.first_name}
        onChangeText={(text) => handleInputChange('first_name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Soyad"
        value={formData.last_name}
        onChangeText={(text) => handleInputChange('last_name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Doğum Tarihi (YYYY-MM-DD)"
        value={formData.birth_date}
        onChangeText={(text) => handleInputChange('birth_date', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email_address}
        onChangeText={(text) => handleInputChange('email_address', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefon"
        keyboardType="phone-pad"
        value={formData.contact_number}
        onChangeText={(text) => handleInputChange('contact_number', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Maaş"
        keyboardType="numeric"
        value={formData.salary}
        onChangeText={(text) => handleInputChange('salary', text)}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.department_id}
          onValueChange={(itemValue: number) => 
            setFormData(prev => ({...prev, department_id: itemValue}))
          }
        >
          <Picker.Item label="Departman Seçiniz" value={0} />
          {departments.map((department) => (
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
          <Text style={styles.buttonText}>Kaydet</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default EAdd;