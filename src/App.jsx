import React, { useState, useEffect, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Film } from 'lucide-react';
import { MovieCard } from './components/MovieCard';
import { SearchBar } from './components/SearchBar';
import { GenreFilter } from './components/GenreFilter';
import { useMovies } from './hooks/useMovies';
import debounce from 'lodash/debounce';

const queryClient = new QueryClient();

function MovieDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading, error } = useMovies(searchQuery, currentPage);
  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  const filteredMovies = movies.filter(
    (movie) =>
      selectedGenres.length === 0 ||
      movie.genre_ids.some((id) => selectedGenres.includes(id))
  );

  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('watchlist');
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  }, []);

  const handleSearch = debounce((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, 500);

  const handleGenreSelect = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const toggleWatchlist = useCallback((movie) => {
    setWatchlist((prev) => {
      const newWatchlist = prev.find((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
      
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      return newWatchlist;
    });
  }, []);

  const isInWatchlist = useCallback(
    (movieId) => watchlist.some((m) => m.id === movieId),
    [watchlist]
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading movies: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Film className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Movie Database</h1>
        </div>

        <div className="space-y-6">
          <SearchBar onSearch={handleSearch} />
          <GenreFilter
            selectedGenres={selectedGenres}
            onGenreSelect={handleGenreSelect}
          />

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isInWatchlist={isInWatchlist(movie.id)}
                    onWatchlistToggle={() => toggleWatchlist(movie)}
                  />
                ))}
              </div>

              {filteredMovies.length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                  No movies found
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MovieDatabase />
    </QueryClientProvider>
  );
}

export default App;
