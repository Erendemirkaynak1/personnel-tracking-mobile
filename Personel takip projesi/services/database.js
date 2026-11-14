import { auth, database } from '../firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, get, set, update, remove, push, onValue } from 'firebase/database';

// Cihaz (Device) İşlemleri
export const getDevices = (callback) => {
  const devicesRef = ref(database, 'devices');
  return onValue(devicesRef, (snapshot) => {
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

export const fetchTimeRecords = async () => {
  const snapshot = await get(ref(database, 'timeRecords'));
  return snapshot.val() || [];
};

export const addTimeRecord = saveTimeRecord;

// Authentication is handled by Firebase Authentication, never by reading a
// password from Realtime Database. Only users with a trusted admin custom claim
// may enter this management application or access the protected database rules.
export const loginUser = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const token = await credential.user.getIdTokenResult(true);

    if (token.claims.admin !== true) {
      await signOut(auth);
      return {
        success: false,
        error: 'Bu hesap için yönetici yetkisi tanımlanmamış.',
      };
    }

    return {
      success: true,
      email: credential.user.email,
    };
  } catch (error) {
    // Do not expose account-existence details or backend internals to the UI.
    return {
      success: false,
      error: 'Giriş başarısız. E-posta ve şifrenizi kontrol edin veya yöneticinize başvurun.',
    };
  }
};

export const logoutUser = async () => signOut(auth);
