





import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import MovieCard from './MovieCard';
import { Movie, MoviesResponse, getTrending, getFanFavourite, getNewReleases } from '../services/movieService';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  title: string;
  fetchPage: (p: number) => Promise<MoviesResponse>;
  filterKey: 'trending' | 'fanfavourite' | 'newrelease';
}

const Section: React.FC<Props> = ({ title, fetchPage, filterKey }) => {
  const navigation = useNavigation<NavProp>();
  const { width } = useWindowDimensions();
  const cardWidth = Math.round((width - 32 - 24) / 3);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async (p: number) => {
    if (p === 1) setLoading(true); else setLoadingMore(true);
    try {
      const res = await fetchPage(p);
      setMovies(prev => p === 1 ? res.movies : [...prev, ...res.movies]);
      setTotalPages(res.total_pages);
      setPage(res.current_page);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [fetchPage]);

  useEffect(() => { load(1); }, [load]);
  const onEnd = () => { if (!loadingMore && page < totalPages) load(page + 1); };

  if (loading) return <ActivityIndicator size="small" color={Colors.primary} style={{ margin: 16 }} />;

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MovieList', { filter: filterKey, title })}>
          <Text style={styles.more}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={movies}
        horizontal
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        onEndReached={onEnd}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={Colors.primary} /> : null}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        initialNumToRender={3}
        maxToRenderPerBatch={6}
        windowSize={5}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { id: item.id })}>
            <MovieCard movie={item} width={cardWidth} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 },
  title: { fontSize: 18, color: Colors.textPrimary, fontWeight: 'bold' },
  more: { fontSize: 14, color: Colors.primary },
});

export default Section;