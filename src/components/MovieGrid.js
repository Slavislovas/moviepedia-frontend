import React, { useState, useEffect } from 'react';
import ImageGrid from './ImageGrid';
import apiUrls from '../config/ApiConfig';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import RequestInterceptor from '../utils/RequestInterceptor';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const MovieGrid = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const requestInterceptor = RequestInterceptor();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await requestInterceptor.get(apiUrls.movies);

        if (response.status === 200) {
          const data = response.data;
          const moviesWithLinks = data.map((movie) => ({
            ...movie,
            link: `/directors/${movie.director.id}/movies/${movie.id}`,
          }));
          setMovies(moviesWithLinks);
        } else {
          const errorData = response.data;
          setErrorMessage(errorData.message || 'Failed to retrieve list of movies');
          setSnackbarOpen(true);
        }
      } catch (error) {
        setErrorMessage('An unexpected error occurred.');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    // Filter movies based on the search term
    const filtered = movies.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredMovies(filtered);
  }, [searchTerm, movies]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <TextField
        label="Search by title"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ marginLeft: 'auto' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <ImageGrid items={filteredMovies} />
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={closeSnackbar}>
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default MovieGrid;