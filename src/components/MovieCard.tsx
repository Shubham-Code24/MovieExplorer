




import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ImageSourcePropType } from 'react-native';
import Colors from '../constants/Colors';
import { Movie } from '../services/movieService';

interface Props {
  movie: Movie;
  width: number;
}

const badgeMap: Record<string, ImageSourcePropType> = {

  gold: require('../assets/images/goldBadge.png'),
  platinum: require('../assets/images/platinumBadge.png'),
};

const MovieCard: React.FC<Props> = ({ movie, width }) => {
  const [loading, setLoading] = useState(true);
  const uri = movie.poster_url;

  // pick badge image or undefined
  const badgeImage = badgeMap[movie.plan] ?? null;

  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.imageWrapper}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={Colors.primary}
            style={styles.loader}
          />
        )}
        <Image
          source={{ uri }}
          style={styles.image}
          onLoadEnd={() => setLoading(false)}
        />

        {badgeImage && (
          <Image
            source={badgeImage}
            style={styles.badge}
            resizeMode="contain"
          />
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {movie.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 12,
  },
  imageWrapper: {
    position: 'relative',
    aspectRatio: 2 / 3,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.cardBackground,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
    tintColor: 'rgba(222, 208, 208, 0.9)'
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 32,
    height: 32,
    
  
  },
  title: {
    marginTop: 8,
    color: Colors.textPrimary,
    fontSize: 14,
  },
});

export default MovieCard;
