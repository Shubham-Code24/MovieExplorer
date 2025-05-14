



import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthProvider, useAuth } from '../context/AuthContext'

import HomeScreen from '../screens/HomeScreen'
import ExploreScreen from '../screens/ExploreScreen'
import SearchScreen from '../screens/SearchScreen'
import PlansScreen from '../screens/PlansScreen'
import ProfileScreen from '../screens/ProfileScreen'
import NotificationScreen from '../screens/NotificationScreen'
import MovieListScreen from '../screens/MovieListScreen'
import MovieDetailScreen from '../screens/MovieDetailScreen'
import AddMovieScreen from '../screens/AddMovieScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import TabBar from '../components/TabBar'

export type RootStackParamList = {
  Main: undefined
  MovieList: { filter: string; title: string }
  MovieDetail: { id: number }
  Notifications: undefined
  Profile: undefined
  Plans: undefined
  AddMovie: undefined
  Login: undefined
  Register: undefined
}

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator<RootStackParamList>()

function MainTabs() {
  const { user } = useAuth()
  const isSupervisor = user?.role === 'supervisor'

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      {isSupervisor && (
        <Tab.Screen
          name="AddMovie"
          component={AddMovieScreen}
          options={{ title: '' /* label hidden in TabBar */ }}
        />
      )}
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Plans" component={PlansScreen} />
    </Tab.Navigator>
  )
}

function RootNavigator() {
  const { user, loading } = useAuth()
  if (loading) return null

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0D0D0D' },
        headerTintColor: '#FFFFFF',
      }}
    >
      {user ? (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
          <Stack.Screen
            name="MovieList"
            component={MovieListScreen}
            options={({ route }) => ({ title: route.params.title })}
          />
          <Stack.Screen
            name="MovieDetail"
            component={MovieDetailScreen}
            options={{ title: 'Movie Details' }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationScreen}
          />
          <Stack.Screen
            name="AddMovie"
            component={AddMovieScreen}
            options={{ title: 'Add Movie' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  )
}
