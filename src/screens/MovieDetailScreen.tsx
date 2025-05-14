








import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Colors from '../constants/Colors';
import axios from 'axios';

import { Movie } from '../services/movieService';

type RootStackParamList = {
  Main: undefined;
  MovieDetail: { id: number };
};

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

const BASE_URL = 'https://movie-explorer-rorakshaykat2003-movie.onrender.com/api/v1/movies';

const MovieDetailScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<Movie>(`${BASE_URL}/${id}`);
        console.log('[Detail] Fetch movie:', res.data);
        setMovie(res.data);
      } catch (e) {
        console.warn('[Detail] Error fetching movie:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load movie details.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movie.banner_url }} style={styles.banner} />
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.subtitle}>{movie.genre} | {movie.release_year}</Text>
        <Text style={styles.rating}>⭐ {movie.rating}</Text>
        <Text style={styles.sectionHeader}>Description</Text>
        <Text style={styles.description}>{movie.description}</Text>
        <Text style={styles.sectionHeader}>Director</Text>
        <Text style={styles.detailText}>{movie.director}</Text>
        <Text style={styles.sectionHeader}>Duration</Text>
        <Text style={styles.detailText}>{movie.duration} mins</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  banner: { width: '100%', height: 200 },
  content: { padding: 16 },
  title: { fontSize: 24, color: Colors.textPrimary, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 8 },
  rating: { fontSize: 16, color: Colors.primary, marginBottom: 16 },
  sectionHeader: { fontSize: 18, color: Colors.textPrimary, fontWeight: '600', marginTop: 12 },
  description: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, lineHeight: 20 },
  detailText: { fontSize: 14, color: Colors.textPrimary, marginTop: 2 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorText: { color: Colors.primary, fontSize: 16 },
});

export default MovieDetailScreen;
