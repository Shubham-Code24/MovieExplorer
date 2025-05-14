

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Colors from '../constants/Colors';
import MovieCard from '../components/MovieCard';
import { fetchMovies, Movie, MoviesResponse } from '../services/movieService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;


const genres = [
  'All',
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
];

const genreColors: Record<string, string> = {
  All: '#4FD1C5',
  Action: '#E53E3E',
  Adventure: '#DD6B20',
  Comedy: '#F6E05E',
  Drama: '#805AD5',
  Fantasy: '#4FD1C5',
  Horror: '#1A202C',
  Mystery: '#2C5282',
  Romance: '#ED64A6',
  'Sci-Fi': '#38B2AC',
  Thriller: '#9B2C2C',
};

const ExploreScreen: React.FC<Props> = ({ navigation }) => {
  const [genre, setGenre] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { width } = useWindowDimensions();
  const numCols = 2;
  const cardWidth = Math.round((width - 16 * (numCols + 1)) / numCols);

  // fetch movies for current genre
  const load = async (p: number, g: string) => {
    if (p === 1) setLoading(true);
    else setLoadingMore(true);

    let res: MoviesResponse;
    if (g === 'All') {
      // server endpoint to return all
      res = await fetchMovies('all', '', 1);
    } else {
      res = await fetchMovies(g, '', p);
    }

    setMovies(prev => (p === 1 ? res.movies : [...prev, ...res.movies]));
    setTotalPages(res.total_pages);
    setPage(res.current_page);

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    load(1, genre);
  }, [genre]);

  const onEnd = () => {
    if (!loadingMore && page < totalPages && genre !== 'All') {
      load(page + 1, genre);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genreContainer}
      >
        {genres.map(g => (
          <TouchableOpacity
            key={g}
            style={[
              styles.genreButton,
              { backgroundColor: genre === g ? genreColors[g] : Colors.cardBackground },
            ]}
            onPress={() => {
              setGenre(g);
              setPage(1);
            }}
          >
            <Text
              style={[
                styles.genreText,
                { color: genre === g ? Colors.background : genreColors[g] },
              ]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={item => item.id.toString()}
          numColumns={numCols}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('MovieDetail', { id: item.id })}
              style={{ marginBottom: 16, marginRight: 16 }}
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
  genreContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  genreButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  genreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
});({
  container: { flex: 1, backgroundColor: Colors.background },
  genreContainer: {
    paddingHorizontal: 16,
  },
  genreButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  genreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
});

export default ExploreScreen;
