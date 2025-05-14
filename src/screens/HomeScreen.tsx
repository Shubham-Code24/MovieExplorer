











import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Colors from '../constants/Colors';
import Section from '../components/Section';
import { getTrending, getFanFavourite, getNewReleases } from '../services/movieService';
import { updatePreferences } from '../services/notificationService';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const handleAllow = async () => {
    setModalVisible(false);
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        await updatePreferences({ device_token: token, notifications_enabled: true });
        Alert.alert('Success', 'Notifications enabled successfully.');
      } else {
        Alert.alert('Permission Denied', 'Notifications permission declined by user.');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to enable notifications. Please try again.');
    }
  };

  const handleDisable = async () => {
    setModalVisible(false);
    try {
      await updatePreferences({ device_token: null, notifications_enabled: false });
      Alert.alert('Success', 'Notifications disabled successfully.');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to disable notifications. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <Header />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enable Notifications?</Text>
            <Text style={styles.modalText}>
              Stay updated with the latest movies and offers.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnDisable} onPress={handleDisable}>
                <Text style={styles.btnText}>Disable</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnAllow} onPress={handleAllow}>
                <Text style={styles.btnText}>Allow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Section title="Top Trending" fetchPage={getTrending} filterKey="trending" />
        <Section title="Fan Favourite" fetchPage={getFanFavourite} filterKey="fanfavourite" />
        <Section title="New Releases" fetchPage={getNewReleases} filterKey="newrelease" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingVertical: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnDisable: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.textSecondary,
    marginRight: 8,
    alignItems: 'center',
  },
  btnAllow: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    marginLeft: 8,
    alignItems: 'center',
  },
  btnText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;
