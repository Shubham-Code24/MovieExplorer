


import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native'
import Colors from '../constants/Colors'
import { createMovie, NewMoviePayload } from '../services/adminApi'
import { launchImageLibrary } from 'react-native-image-picker'

const AddMovieScreen: React.FC = () => {

    const mounted = useRef(true)
useEffect(() => {
  return () => { mounted.current = false }
}, [])


  const [form, setForm] = useState<Partial<NewMoviePayload>>({
    title: '',
    genre: '',
    release_year: NaN,
    rating: NaN,
    plan: 'basic',
  })
  const [poster, setPoster] = useState<any>(null)
  const [banner, setBanner] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const pickImage = async (type: 'poster' | 'banner') => {
    const res = await launchImageLibrary({ mediaType: 'photo' })
    if (res.assets?.[0]) {
      type === 'poster' ? setPoster(res.assets[0]) : setBanner(res.assets[0])
    }
  }

  const handleSubmit = async () => {
    // basic validation
    if (!form.title || !form.genre || !form.release_year || !form.rating || !poster || !banner) {
    if (mounted.current) {
  return Alert.alert('Error', 'Please fill all required fields')
}
    }
    setLoading(true)
    try {
      const payload: NewMoviePayload = {
        ...(form as any),
        poster,
        banner,
      }
      const movie = await createMovie(payload)
      Alert.alert('Success', `Movie "${movie.title}" created.`)
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {loading && <ActivityIndicator size="large" color={Colors.primary} />}
      <Text style={styles.title}>Add New Movie</Text>

      {/** title */}
      <TextInput
        style={styles.input}
        placeholder="Title*"
        placeholderTextColor={Colors.textSecondary}
        onChangeText={(t) => setForm((f) => ({ ...f, title: t }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre*"
        placeholderTextColor={Colors.textSecondary}
        onChangeText={(g) => setForm((f) => ({ ...f, genre: g }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Release Year*"
        placeholderTextColor={Colors.textSecondary}
        keyboardType="number-pad"
        onChangeText={(y) => setForm((f) => ({ ...f, release_year: parseInt(y, 10) }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Rating*"
        placeholderTextColor={Colors.textSecondary}
        keyboardType="decimal-pad"
        onChangeText={(r) => setForm((f) => ({ ...f, rating: parseFloat(r) }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Director"
        placeholderTextColor={Colors.textSecondary}
        onChangeText={(d) => setForm((f) => ({ ...f, director: d }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (mins)"
        placeholderTextColor={Colors.textSecondary}
        keyboardType="number-pad"
        onChangeText={(d) => setForm((f) => ({ ...f, duration: parseInt(d, 10) }))}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        placeholderTextColor={Colors.textSecondary}
        multiline
        onChangeText={(desc) => setForm((f) => ({ ...f, description: desc }))}
      />

      {/** plan selector */}
      <Text style={styles.label}>Plan*</Text>
      {(['basic', 'gold', 'platinum'] as const).map((p) => (
        <TouchableOpacity
          key={p}
          onPress={() => setForm((f) => ({ ...f, plan: p }))}
          style={[
            styles.planBtn,
            form.plan === p && { borderColor: Colors.primary },
          ]}
        >
          <Text
            style={{
              color: form.plan === p ? Colors.primary : Colors.textPrimary,
            }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}

      {/** image pickers */}
      <TouchableOpacity style={styles.fileBtn} onPress={() => pickImage('poster')}>
        <Text style={styles.fileBtnText}>
          {poster ? 'Change Poster' : 'Pick Poster*'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.fileBtn} onPress={() => pickImage('banner')}>
        <Text style={styles.fileBtnText}>
          {banner ? 'Change Banner' : 'Pick Banner*'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Create Movie</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default AddMovieScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  title: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    color: Colors.textPrimary,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 12,
  },
  label: { color: Colors.textSecondary, marginBottom: 4, fontWeight: '600' },
  planBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.cardBackground,
    borderRadius: 6,
    marginBottom: 8,
  },
  fileBtn: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  fileBtnText: {
     color: '#fff', 
     textAlign: 'center'
     },
  submitBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  submitText: { 
    color: '#fff',
     textAlign: 'center',
      fontWeight: '600'
     },
})
