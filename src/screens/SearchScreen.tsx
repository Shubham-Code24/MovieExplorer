

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Colors from '../constants/Colors';
import MovieCard from '../components/MovieCard';
import { fetchMovies, Movie, MoviesResponse } from '../services/movieService';
import { debounce } from 'lodash';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const { width } = useWindowDimensions();
  const numCols = 2;
  const cardWidth = Math.round((width - 16 * (numCols + 1)) / numCols);

  const load = async (p: number, q: string) => {
    if (!q.trim()) return;
    if (p === 1) setLoading(true);
    else setLoadingMore(true);

    const res: MoviesResponse = await fetchMovies('all', q.trim(), p);
    setMovies(prev => (p === 1 ? res.movies : [...prev, ...res.movies]));
    setTotalPages(res.total_pages);
    setPage(res.current_page);

    setLoading(false);
    setLoadingMore(false);
  };

  const debounced = useCallback(debounce((q: string) => load(1, q), 300), []);

  useEffect(() => {
    debounced(query);
  }, [query]);

  const onEnd = () => {
    if (!loadingMore && page < totalPages) {
      load(page + 1, query);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Type to search movies..."
        placeholderTextColor={Colors.textSecondary}
        value={query}
        onChangeText={setQuery}
      />

      {(!query.trim() && !loading) ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>Nothing to Search</Text>
        </View>
      ) : loading && page === 1 ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={item => item.id.toString()}
          numColumns={numCols}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('MovieDetail', { id: item.id })}
              style={styles.cardWrapper}
            >
              <MovieCard movie={item} width={cardWidth} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
          onEndReached={onEnd}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color={Colors.primary} /> : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchInput: {
    height: 40,
    margin: 16,
    borderColor: Colors.textSecondary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: Colors.textPrimary,
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: Colors.textSecondary, marginTop: 8, fontSize: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  cardWrapper: { marginBottom: 16, marginRight: 16 },
});

export default SearchScreen;
