import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppRoute } from '@/types/navigation';

type IoniconName = 'people' | 'phone-portrait' | 'time' | 'cash' | 'menu';

interface MenuItem {
  title: string;
  icon: IoniconName;
  route: AppRoute;
}

export const MenuButton = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const BASE_PATH = '/app';

  const menuItems: MenuItem[] = [
      { title: 'Çalışanlar', icon: 'people', route: `${BASE_PATH}/employees` as AppRoute },
      { title: 'Cihazlar', icon: 'phone-portrait', route: `${BASE_PATH}/devices` as AppRoute },
      { title: 'Zamanlar', icon: 'time', route: `${BASE_PATH}/time-records` as AppRoute },
      { title: 'Bonuslar', icon: 'cash', route: `${BASE_PATH}/bonus` as AppRoute },
  ];
  

  const handleNavigate = (route: AppRoute) => {
    router.navigate(route);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => setVisible(!visible)}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>

      {visible && (
        <View style={styles.menuDropdown}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={styles.menuItem}
              onPress={() => handleNavigate(item.route)}
            >
              <Ionicons name={item.icon} size={20} style={styles.icon} />
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Stil tanımları aynı kalacak
  container: {
    position: 'relative',
  },
  menuButton: {
    padding: 10,
  },
  menuDropdown: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 200,
    zIndex: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
  },
  icon: {
    width: 20,
    textAlign: 'center',
  },
});