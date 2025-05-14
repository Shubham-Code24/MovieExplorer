


import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'https://movie-explorer-rorakshaykat2003-movie.onrender.com/api/v1',
});

export function setAuthToken(token: string): void {
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function clearAuthToken(): void {
  delete API.defaults.headers.common['Authorization'];
}

export async function signup(data: {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  password: string;
}): Promise<any> {
  const res = await API.post('/signup', data);
  return res.data;
}

export async function login(data: { email: string; password: string }): Promise<any> {
  const res = await API.post('/login', data);
  return res.data;
}

export async function logout(): Promise<void> {
  try {
    await API.post('/logout');
  } catch {
    // ignore errors
  }
}

export async function loadToken(): Promise<string | null> {
  const token = await AsyncStorage.getItem('token');
  if (token) setAuthToken(token);
  return token;
}

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem('token', token);
  setAuthToken(token);
}

export default API;

















