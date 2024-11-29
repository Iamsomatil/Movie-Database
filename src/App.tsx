import React, { useState, useEffect, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Film } from 'lucide-react';
import { MovieCard } from './components/MovieCard';
import { SearchBar } from './components/SearchBar';
import { GenreFilter } from './components/GenreFilter';
import { useMovies } from './hooks/useMovies';
import { Movie } from './types/movie';
import debounce from 'lodash/debounce';

const queryClient = new QueryClient();

function MovieDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading, error } = useMovies(searchQuery, currentPage);
  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  const filteredMovies = movies.filter(
    (movie) =>
      selectedGenres.length === 0 ||
      movie.genre_ids.some((id) => selectedGenres.includes(id))
  );

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('watchlist');
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error('Failed to save watchlist:', error);
    }
  }, [watchlist]);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const debouncedSetSearchQuery = useCallback(
    debounce((value: string) => setSearchQuery(value), 500),
    []
  );

  const handleAddToWatchlist = (movie: Movie) => {
    setWatchlist(prev => {
      const exists = prev.some(m => m.id === movie.id);
      if (exists) {
        return prev.filter(m => m.id !== movie.id);
      }
      return [...prev, movie];
    });
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(m => m.id === movieId);
  };

  const handleGenreSelect = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MovieDB</h1>
            </div>
            <div className="w-96">
              <SearchBar value={searchQuery} onChange={debouncedSetSearchQuery} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter by Genre</h2>
          <GenreFilter
            selectedGenres={selectedGenres}
            onGenreSelect={handleGenreSelect}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-600 text-center">
              <p className="text-xl font-semibold mb-2">Error loading movies</p>
              <p className="text-sm">{error instanceof Error ? error.message : 'Please check your API key and try again'}</p>
            </div>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">No movies found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onAddToWatchlist={handleAddToWatchlist}
                  isInWatchlist={isInWatchlist(movie.id)}
                />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-8 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </>
        )}

        {watchlist.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">My Watchlist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {watchlist.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onAddToWatchlist={handleAddToWatchlist}
                  isInWatchlist={true}
                />
              ))}
            </div>
          </div>
        )}
      </main>
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