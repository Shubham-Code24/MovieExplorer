


import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Colors from '../constants/Colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useAuth } from '../context/AuthContext'

// icon map for each route
const ICONS: Record<string, string> = {
  Home:       'home-outline',
  Explore:    'compass-outline',
  Search:     'search-outline',
  Plans:      'card-outline',
  AddMovie:   'add-outline',
}

const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { user } = useAuth()
  const isSupervisor = user?.role === 'supervisor'

  // build an ordered array of tabs we actually want to render
  const tabs = isSupervisor
    ? ['Home', 'Explore', 'AddMovie', 'Search', 'Plans']
    : ['Home', 'Explore', 'Search', 'Plans']

  return (
    <View style={styles.container}>
      {tabs.map((routeName, idx) => {
        const isFocused = state.index === state.routes.findIndex(r => r.name === routeName)

        // plus button special styling
        if (routeName === 'AddMovie') {
          return (
            <TouchableOpacity
              key="add-movie"
              onPress={() => navigation.navigate('AddMovie')}
              style={styles.addButtonWrapper}
            >
              <View style={styles.addCircle}>
                <Ionicons name={ICONS[routeName]} size={28} color="#fff" />
              </View>
            </TouchableOpacity>
          )
        }

        // normal tab
        return (
          <TouchableOpacity
            key={routeName}
            onPress={() => navigation.navigate(routeName as any)}
            style={styles.tab}
          >
            <Ionicons
              name={ICONS[routeName] || 'ellipse-outline'}
              size={24}
              color={isFocused ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[
              styles.label,
              { color: isFocused ? Colors.primary : Colors.textSecondary }
            ]}>
              {routeName}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
  addButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: -20,
  },
  addCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default TabBar;
