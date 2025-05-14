



import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';

const bgImage = require('../assets/images/coverImageRegister.jpg');
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const mobileRegex = /^[0-9]{10,15}$/;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      return Alert.alert('Error', 'Please enter both first and last name');
    }
    if (!emailRegex.test(email)) {
      return Alert.alert('Error', 'Please enter a valid email address');
    }
    if (!mobileRegex.test(mobile)) {
      return Alert.alert('Error', 'Please enter a valid mobile number');
    }
    if (password.length < 6) {
      return Alert.alert('Error', 'Password must be at least 6 characters');
    }
    if (password !== confirm) {
      return Alert.alert('Error', 'Passwords do not match');
    }
    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        mobile_number: mobile,
        password,
      });

    } catch (e: any) {
      Alert.alert('Registration Failed', e.response?.data?.error || e.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
        <View style={styles.overlay} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.formWrapper}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.underline} />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="First Name"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Last Name"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.7)"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="rgba(255,255,255,0.7)"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInText}>
                Already have an account? <Text style={styles.signInLink}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
     flex: 1, 
     width: '100%',
      height: '100%'
     },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  formWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  formContainer: {
    backgroundColor: 'rgba(83, 81, 81, 0.8)',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
 underline: {
    height: 4,
    width: 60,
    backgroundColor: '#FF2D55',
    marginVertical: 12,
    marginLeft : 48,
    borderRadius: 2,
  },
  row: { 
    flexDirection: 'row',
     justifyContent: 'space-between' 
    },

  halfInput: { 
    width: '48%' 
  },
  
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    color: '#fff',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#FF2D55',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
     color: '#fff',
      fontSize: 16,
       fontWeight: '600'
       },
  signInText: {
     color: 'rgba(255,255,255,0.7)',
      textAlign: 'center', marginTop: 16 },

  signInLink: { 
    color: '#fff', 
    textDecorationLine: 'underline'
   },


});
