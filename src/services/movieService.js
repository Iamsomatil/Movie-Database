import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const searchMovies = async (query, page = 1) => {
  const response = await api.get('/search/movie', {
    params: { query, page },
  });
  return {
    results: response.data.results,
    total_pages: response.data.total_pages
  };
};

export const getPopularMovies = async (page = 1) => {
  const response = await api.get('/movie/popular', {
    params: { page },
  });
  return {
    results: response.data.results,
    total_pages: response.data.total_pages
  };
};

export const getGenres = async () => {
  const response = await api.get('/genre/movie/list');
  return response.data.genres;
};
