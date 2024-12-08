import React from 'react';
import { Star, Clock, Check } from 'lucide-react';
import { TMDB_IMAGE_BASE_URL } from '../config/api';

export const MovieCard = ({ movie, onWatchlistToggle, isInWatchlist }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img
        src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-64 object-cover"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/500x750?text=No+Image';
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{movie.overview}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-600">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
          <button
            onClick={() => onWatchlistToggle(movie)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
              isInWatchlist
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isInWatchlist ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                <span>Watch Later</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
