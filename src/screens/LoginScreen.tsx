



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

const bgImage = require('../assets/images/coverImageLogin.jpeg');
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useAuth();

  const handleLogin = async () => {
    console.log('[LoginScreen] handleLogin', { email });
    if (!email.trim() || !emailRegex.test(email)) {
      return Alert.alert('Error', 'Please enter a valid email');
    }
    if (!password) {
      return Alert.alert('Error', 'Please enter your password');
    }
    try {
      await loginUser({ email, password });
  
    } catch (e: any) {
   
      Alert.alert('Login Failed', e.response?.data?.error || e.message);
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
            <Text style={styles.title}>Sign In</Text>
            <View style={styles.underline} />

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
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.secondaryText}>Don't have an account?</Text>
              <Text style={styles.secondaryLink}> CREATE AN ACCOUNT</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%' },
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
    width: 55,
    backgroundColor: '#FF2D55',
    marginVertical: 12,
    alignSelf: 'center',
    borderRadius: 2,
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
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  secondaryText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  secondaryLink: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
