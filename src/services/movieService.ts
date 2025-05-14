


import axios from 'axios';

export interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  rating: number;
  duration: number;
  description: string;
  banner_url: string;
  poster_url: string;
  director: string;
  plan: string;
}

export interface MoviesResponse {
  movies: Movie[];
  total_pages: number;
  current_page: number;
}

const BASE_URL = 'https://movie-explorer-rorakshaykat2003-movie.onrender.com/api/v1/movies';
const PAGE_SIZE = 10;
let moviesCache: Movie[] | null = null;

async function fetchAllMovies(): Promise<Movie[]> {
  if (moviesCache) {
    return moviesCache;
  }

  try {
    const first = await axios.get<MoviesResponse>(BASE_URL, { params: { page: 1 } });
    let all = first.data.movies;
    const totalPages = first.data.total_pages;

    const requests = [];
    for (let p = 2; p <= totalPages; p++) {
      requests.push(axios.get<MoviesResponse>(BASE_URL, { params: { page: p } }));
    }

    const results = await Promise.all(requests);
    results.forEach(res => {
      all = all.concat(res.data.movies);
    });

    moviesCache = all;
    return all;
  } catch (_) {
    return [];
  }
}

function paginate(items: Movie[], page: number): MoviesResponse {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = items.slice(start, start + PAGE_SIZE);
  return { movies: pageItems, total_pages: totalPages, current_page: page };
}

export async function getTrending(page = 1): Promise<MoviesResponse> {
  const all = await fetchAllMovies();
  const filtered = all.filter(m => m.rating > 7.5).sort((a, b) => b.rating - a.rating);
  return paginate(filtered, page);
}

export async function getFanFavourite(page = 1): Promise<MoviesResponse> {
  const all = await fetchAllMovies();
  const filtered = all.filter(m => m.rating > 8.0).sort((a, b) => b.rating - a.rating);
  return paginate(filtered, page);
}

export async function getNewReleases(page = 1): Promise<MoviesResponse> {
  const all = await fetchAllMovies();
  const filtered = all.filter(m => m.release_year > 2015).sort((a, b) => b.release_year - a.release_year);
  return paginate(filtered, page);
}

export const fetchMovies = async (
  genre: string = 'all',
  search: string = '',
  page: number = 1
): Promise<MoviesResponse> => {
  try {
    const params: Record<string, unknown> = { page };
    if (genre !== 'all') params.genre = genre;
    if (search) params.search = search;

    const res = await axios.get<MoviesResponse>(BASE_URL, { params });
    return res.data;
  } catch (_) {
    return { movies: [], total_pages: 1, current_page: page };
  }
};
