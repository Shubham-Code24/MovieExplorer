



import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import MovieCard from '../components/MovieCard';
import { getTrending, getFanFavourite, getNewReleases, Movie, MoviesResponse } from '../services/movieService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Props type for navigation
type Props = NativeStackScreenProps<RootStackParamList, 'MovieList'>;

const MovieListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { filter, title } = route.params;
  const { width } = useWindowDimensions();
  const numCols = 2;
  const cardWidth = Math.round((width - 16 * (numCols + 1)) / numCols);

  const [data, setData] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetcher =
    filter === 'trending' ? getTrending : filter === 'fanfavourite' ? getFanFavourite : getNewReleases;

  const load = async (p: number) => {
    if (p === 1) setLoading(true);
    else setLoadingMore(true);
    const res: MoviesResponse = await fetcher(p);
    setData(prev => (p === 1 ? res.movies : [...prev, ...res.movies]));
    setTotalPages(res.total_pages);
    setPage(res.current_page);
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    navigation.setOptions({ title });
    load(1);
  }, []);

  const onEnd = () => {
    if (!loadingMore && page < totalPages) load(page + 1);
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        numColumns={numCols}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ marginBottom: 16, marginRight: (item.id % numCols === 0 ? 0 : 16) }}
            onPress={() => navigation.navigate('MovieDetail', { id: item.id })}
          >
            <MovieCard movie={item} width={cardWidth} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        onEndReached={onEnd}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={Colors.primary} /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 16 },
});

export default MovieListScreen;
