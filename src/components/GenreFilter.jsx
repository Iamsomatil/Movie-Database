import React from 'react';
import { useQuery } from 'react-query';
import { getGenres } from '../services/movieService';

export const GenreFilter = ({ selectedGenres, onGenreSelect }) => {
  const { data: genres = [] } = useQuery('genres', getGenres);

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onGenreSelect(genre.id)}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedGenres.includes(genre.id)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};
