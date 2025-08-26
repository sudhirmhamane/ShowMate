import axios from "axios";
import Movie from "../models/Movie.js";

// Search movies by title
export const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const { data } = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        timeout: 10000,
      }
    );

    res.json({
      success: true,
      movies: data.results
    });

  } catch (error) {
    console.error('TMDB Search API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search movies',
      error: error.message
    });
  }
};

// Get movie details by ID
export const getMovieDetails = async (req, res) => {
  try {
    const { movieId } = req.params;

    // First check if movie exists in our database
    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Fetch from TMDB API
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      movie = await Movie.create(movieDetails);
    }

    res.json({
      success: true,
      movie
    });

  } catch (error) {
    console.error('Get movie details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movie details',
      error: error.message
    });
  }
};

// Get popular movies
export const getPopularMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://api.themoviedb.org/3/movie/popular',
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        timeout: 10000,
      }
    );

    res.json({
      success: true,
      movies: data.results
    });

  } catch (error) {
    console.error('TMDB Popular API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular movies',
      error: error.message
    });
  }
};

// Get top rated movies
export const getTopRatedMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://api.themoviedb.org/3/movie/top_rated',
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        timeout: 10000,
      }
    );

    res.json({
      success: true,
      movies: data.results
    });

  } catch (error) {
    console.error('TMDB Top Rated API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top rated movies',
      error: error.message
    });
  }
};

// Get upcoming movies
export const getUpcomingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://api.themoviedb.org/3/movie/upcoming',
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        timeout: 10000,
      }
    );

    res.json({
      success: true,
      movies: data.results
    });

  } catch (error) {
    console.error('TMDB Upcoming API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming movies',
      error: error.message
    });
  }
};

// Get movies by genre
export const getMoviesByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;

    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        timeout: 10000,
      }
    );

    res.json({
      success: true,
      movies: data.results
    });

  } catch (error) {
    console.error('TMDB Genre API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies by genre',
      error: error.message
    });
  }
};
