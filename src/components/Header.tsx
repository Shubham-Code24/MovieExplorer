


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../navigation/AppNavigator';

const Header: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie Explorer+</Text>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => {/* Later: navigate to Notifications */}} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  icons: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
});

export default Header;
