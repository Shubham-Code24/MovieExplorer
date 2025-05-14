







import API from './auth';
import { Movie } from './movieService';

export interface FilePayload {
  uri: string;
  fileName?: string;
  type: string;
}

export interface NewMoviePayload {
  title: string;
  genre: string;
  release_year: number;
  rating: number;
  director?: string;
  duration?: number;
  description?: string;
  plan: 'basic' | 'gold' | 'platinum';
  poster: FilePayload;
  banner: FilePayload;
}

export async function createMovie(
  payload: NewMoviePayload
): Promise<Movie> {
  const form = new FormData();

  form.append('title', payload.title);
  form.append('genre', payload.genre);
  form.append('release_year', String(payload.release_year));
  form.append('rating', String(payload.rating));

  if (payload.director) {
    form.append('director', payload.director);
  }
  if (payload.duration != null) {
    form.append('duration', String(payload.duration));
  }
  if (payload.description) {
    form.append('description', payload.description);
  }

  form.append('plan', payload.plan);

  form.append('poster', {
    uri: payload.poster.uri,
    name: payload.poster.fileName || 'poster.jpg',
    type: payload.poster.type,
  } as any);

  form.append('banner', {
    uri: payload.banner.uri,
    name: payload.banner.fileName || 'banner.jpg',
    type: payload.banner.type,
  } as any);

  const response = await API.post<Movie>('/movies', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
