

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const NotificationScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.text}>No notifications yet.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});

export default NotificationScreen;
