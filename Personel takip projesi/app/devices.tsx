import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getDevices, updateDevice, deleteDevice, addDevice } from '../services/database';

interface Device {
  id?: string; // Firebase'den gelen ID için
  baslik: string;
  departman: string;
  department_id: number;
  ip_port: string;
  model: string;
  yenilenme: string;
}

const Devices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]); // Başlangıçta boş dizi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = () => {
      getDevices((data: any) => { // Firebase'den gelen veri tipi
        try {
          if (!data) {
            setDevices([]);
            setError('No devices found');
            return;
          }

          // Firebase'den gelen object formatını array'e çevir
          const devicesArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })).filter(device => device !== null);

          setDevices(devicesArray);
        } catch (err) {
          console.error("Error processing devices:", err);
          setError('Failed to load devices');
          setDevices([]);
        } finally {
          setLoading(false);
        }
      });
    };

    fetchDevices();
  }, []);

//  const handleAddDevice = async (newDevice: Omit<Device, 'id'>) => {
  //  try {
    //  await addDevice(newDevice);
      // Listeyi yenile
      //getDevices((data: any) => {
        //const updatedDevices = data ? Object.values(data) : [];
        //setDevices(updatedDevices);
     // });
   // } catch (error) {
     // console.error('Error adding device:', error);
     // setError('Failed to add device');
   // }
 // };

  const handleUpdateDevice = async (id: string, updatedDevice: Device) => {
    try {
      await updateDevice(id, updatedDevice);
      setDevices(prev => prev.map(device => 
        device.id === id ? updatedDevice : device
      ));
    } catch (error) {
      console.error('Error updating device:', error);
      setError('Failed to update device');
    }
  };

  const handleDeleteDevice = async (id: string) => {
    try {
      await deleteDevice(id);
      setDevices(prev => prev.filter(device => device.id !== id));
    } catch (error) {
      console.error('Error deleting device:', error);
      setError('Failed to delete device');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Cihazlar Listesi</Text>
      
      <TouchableOpacity 
        style={styles.addButton}
       // onPress={() => handleAddDevice({
         // baslik: 'New Device',
         // departman: '',
         // department_id: 0,
         // ip_port: '',
          //model: '',
        //  yenilenme: new Date().toISOString()
      //</ScrollView>  })}
      >
        <Text style={styles.buttonText}>Yeni Cihaz ekle</Text>
      </TouchableOpacity>

      {devices.length === 0 ? (
        <Text style={styles.emptyText}>Cihazlar Bulunamadı</Text>
      ) : (
        devices.map((device) => (
          <View key={device.id} style={styles.deviceContainer}>
            <Text>Title: {device.baslik}</Text>
            <Text>Department: {device.departman || '-'}</Text>
            <Text>Department ID: {device.department_id}</Text>
            <Text>IP:Port: {device.ip_port}</Text>
            <Text>Model: {device.model}</Text>
            <Text>Last Update: {device.yenilenme}</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => handleUpdateDevice(device.id!, {
                  ...device,
                  baslik: `${device.baslik} (Updated)`
                })}
              >
                <Text style={styles.buttonText}>Düzenle</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDeleteDevice(device.id!)}
              >
                <Text style={styles.buttonText}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1D3D47',
  },
  deviceContainer: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    padding: 10,
    backgroundColor: '#1D3D47',
    borderRadius: 4,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  addButton: {
    padding: 12,
    backgroundColor: '#28a745',
    borderRadius: 4,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Devices;