import { useQuery } from "react-query";
import { getPopularMovies, searchMovies } from "../services/movieService";

export const useMovies = (searchQuery = "", page = 1) => {
  return useQuery(
    ["movies", searchQuery, page],
    () => (searchQuery ? searchMovies(searchQuery, page) : getPopularMovies(page)),
    {
      keepPreviousData: true,
      retry: 2,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      onError: (error) => {
        console.error("Failed to fetch movies:", error);
      },
    }
  );
};
