


import React, { useLayoutEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import Colors from '../constants/Colors'
import { useAuth } from '../context/AuthContext'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import Ionicons from 'react-native-vector-icons/Ionicons'

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>

const dummyAvatar = require('../assets/images/profileImage.jpg')

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logoutUser } = useAuth()

  // Remove headerRight since Tab setup hides it; we'll add in-UI logout button instead
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: undefined,
    })
  }, [navigation])

  if (!user) return null

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image source={dummyAvatar} style={styles.avatar} />
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>Hi, {user.first_name}!</Text>

      {/* Account Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member Since</Text>
          <Text style={styles.infoValue}>
            {new Date(user.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Subscription Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Subscription</Text>

        <View style={styles.subHeader}>
          <View style={[styles.planBadge, styles[`plan_${user.active_plan}`]]}>
            <Text style={styles.planBadgeText}>
              {user.active_plan.charAt(0).toUpperCase() + user.active_plan.slice(1)} Plan
            </Text>
          </View>
          <Text style={styles.status}>Active</Text>
        </View>

        {/* Features list */}
        <View style={styles.features}>
          {user.active_plan === 'basic' && (
            <>
              <Text style={styles.featureItem}>
                • Access to curated free movie collection
              </Text>
              <Text style={styles.featureItem}>• New content updates monthly</Text>
            </>
          )}
          {user.active_plan === 'gold' && (
            <>
              <Text style={styles.featureItem}>• Everything in Basic</Text>
              <Text style={styles.featureItem}>• Ad-free browsing experience</Text>
              <Text style={styles.featureItem}>
                • Priority access to new releases
              </Text>
            </>
          )}
          {user.active_plan === 'platinum' && (
            <>
              <Text style={styles.featureItem}>• Everything in Gold</Text>
              <Text style={styles.featureItem}>
                • Exclusive platinum-only collections
              </Text>
              <Text style={styles.featureItem}>
                • Early access to premium releases
              </Text>
            </>
          )}
        </View>

        {/* Upgrade button */}
        <TouchableOpacity
          style={[styles.upgradeButton, styles[`btn_${user.active_plan}`]]}
          onPress={() => navigation.navigate('Plans')}
        >
          <Text style={styles.upgradeText}>
            {user.active_plan === 'basic' ? 'Upgrade Plan' : 'Change Plan'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button (in-UI fallback) */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await logoutUser()
          // AuthContext will redirect to Login/Register
        }}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { alignItems: 'center', padding: 16 },

  avatarWrapper: {
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
    padding: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  greeting: {
    fontSize: 24,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  planBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  plan_basic: { backgroundColor: Colors.primary },
  plan_gold: { backgroundColor: '#D69E2E' },
  plan_platinum: { backgroundColor: '#805AD5' },
  status: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  features: {
    marginBottom: 16,
  },
  featureItem: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 6,
  },
  upgradeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btn_basic: { backgroundColor: Colors.primary },
  btn_gold: { backgroundColor: '#D69E2E' },
  btn_platinum: { backgroundColor: '#805AD5' },
  upgradeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF2D55',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 32,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
