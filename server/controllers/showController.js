import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";


export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://api.themoviedb.org/3/movie/now_playing',
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        timeout: 10000, // 10-second timeout to avoid hanging requests
      }
    );

    const movies = data.results;
    res.json({ success: true, movies });
  } catch (error) {
    console.error('TMDB API Error:', error.code, error.message);

    // Provide a better error message based on type
    if (error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        success: false,
        message: 'Request timed out while contacting TMDB API.',
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data?.status_message || 'API error occurred.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred.',
    });
  }
};


// API to add a new show to the database

export const addShow = async (req, res) => {
  try {
    const { movieId, showInput, showPrice } = req.body;

    let movie = await Movie.findById(movieId);

    if (!movie) {
      //fetch movie details and credits from tmdb api.

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

    const showsToCreate = [];
    showInput.forEach(show => {
        const showData = show.date;
        show.time.forEach((time)=>{
            const dateTimeString = `${showData}T${time}`;
            showsToCreate.push({
                movie: movieId,
                showDateTime: new Date(dateTimeString),
                showPrice,
                occupiedSeats: {}
            });
        });
    });

    if(showsToCreate.length > 0){
        await Show.insertMany(showsToCreate);
    }

    res.json({success: true, message: 'Show Added Successfully!'});
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all the shows from the database

export const getShows = async(req,res) =>{
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime: 1});

        const uniqueShows = new Set(shows.map(show => show.movie))

        res.json({success:true, shows: Array.from(uniqueShows)});

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export const getShow = async(req,res) =>{
    try {
        const {movieId} = req.params;

        //get all upcoming shows for the movie
        const shows = await Show.find({movie: movieId, showDateTime: {
            $gte: new Date()
        }})
        
        const movie = await Movie.findById(movieId);
        const dateTime = {};

        shows.forEach((show) =>{
           const date = show.showDateTime.toISOString().split("T")[0];
           
           if(!dateTime[date]){
            dateTime[date] = [];
           }

           dateTime[date].push({time: show.showDateTime, showId: show._id});
        });

        res.json({success:true, movie, dateTime});
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}