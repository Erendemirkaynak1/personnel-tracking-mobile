import { database } from '../firebaseConfig';
import { ref, get, set, update, remove, push, onValue } from 'firebase/database';

// Cihaz (Device) İşlemleri
export const getDevices = (callback) => {
  const devicesRef = ref(database, 'devices');
  onValue(devicesRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || []);
  });
};

export const updateDevice = async (index, deviceData) => {
  const deviceRef = ref(database, `devices/${index}`);
  await update(deviceRef, deviceData);
};

export const deleteDevice = async (index) => {
  const deviceRef = ref(database, `devices/${index}`);
  await remove(deviceRef);
};

export const addDevice = async (deviceData) => {
  const devicesRef = ref(database, 'devices');
  const newDeviceRef = push(devicesRef);
  await set(newDeviceRef, deviceData);
  return newDeviceRef.key;
};

// Çalışan (Employee) İşlemleri
export const getEmployee = async (employeeId) => {
  const snapshot = await get(ref(database, `employees/${employeeId}`));
  return snapshot.val();
};

export const addEmployee = async (employeeData) => {
  const newEmployeeRef = push(ref(database, 'employees'));
  await set(newEmployeeRef, employeeData);
  return newEmployeeRef.key;
};

export const updateEmployee = async (employeeId, updatedData) => {
  await update(ref(database, `employees/${employeeId}`), updatedData);
};

export const deleteEmployee = async (employeeId) => {
  await remove(ref(database, `employees/${employeeId}`));
};

export const getAllEmployees = async () => {
  const snapshot = await get(ref(database, 'employees'));
  return snapshot.val() || {};
};

export const fetchEmployees = getAllEmployees;

export const getEmployeesByDepartment = async (departmentId) => {
  const allEmployees = await getAllEmployees();
  return Object.entries(allEmployees)
    .filter(([_, employee]) => employee.department_id == departmentId)
    .reduce((acc, [id, employee]) => ({ ...acc, [id]: employee }), {});
};

// Departman İşlemleri
export const fetchDepartments = async () => {
  const snapshot = await get(ref(database, 'departments'));
  const departments = snapshot.val() || {};
  return Object.entries(departments).map(([id, data]) => ({
    id: Number(id),
    name: data.name,
    ...data
  }));
};

// Zaman Kayıtları
export const saveTimeRecord = async ({ employeeId, entryTime, exitTime }) => {
  const timeRecordRef = push(ref(database, 'timeRecords'));
  await set(timeRecordRef, {
    employeeId,
    entryTime,
    exitTime,
    createdAt: new Date().toISOString(),
  });
  return timeRecordRef.key;
};

// Zaman Kayıtları - Fetch
export const fetchTimeRecords = async () => {
  const snapshot = await get(ref(database, 'timeRecords'));
  return snapshot.val() || [];
};

// Aynı fonksiyonu farklı isimle de export et (alias)
export const addTimeRecord = saveTimeRecord;

// Kullanıcı Girişi
export const loginUser = async (username, password) => {
  try {
    const snapshot = await get(ref(database, 'login'));
    const loginData = snapshot.val();

    if (!loginData) {
      return { 
        success: false, 
        error: 'Sistemde kayıtlı kullanıcı bulunamadı' 
      };
    }

    if (loginData.username === username && loginData.pass === password) {
      return { 
        success: true, 
        username: loginData.username,
        userData: loginData 
      };
    }
    
    return { 
      success: false, 
      error: 'Geçersiz kullanıcı adı veya şifre' 
    };
  } catch (error) {
    console.error("Login hatası:", error);
    return { 
      success: false, 
      error: 'Sistem hatası. Lütfen daha sonra tekrar deneyin.' 
    };
  }
};
