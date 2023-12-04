import React, { useState, useEffect } from 'react';
import ImageGrid from './ImageGrid';
import apiUrls from '../config/ApiConfig';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import RequestInterceptor from '../utils/RequestInterceptor';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const DirectorGrid = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDirectors, setFilteredDirectors] = useState([]);
  const requestInterceptor = RequestInterceptor();

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await requestInterceptor.get(apiUrls.directors);

        if (response.status === 200) {
          const data = response.data;
          const directorsWithLinks = data.map((director) => ({
            ...director,
            link: `/directors/${director.id}`,
            title: `${director.name} ${director.surname}`,
          }));
          setDirectors(directorsWithLinks);
        } else {
          const errorData = response.data;
          setErrorMessage(errorData.message || 'Failed to retrieve list of directors');
          setSnackbarOpen(true);
        }
      } catch (error) {
        setErrorMessage('An unexpected error occurred.');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectors();
  }, []);

  useEffect(() => {
    // Filter directors based on the search term
    const filtered = directors.filter(
      (director) =>
        `${director.name} ${director.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDirectors(filtered);
  }, [searchTerm, directors]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <TextField
        label="Search by director name"
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
        <p>Loading directors...</p>
      ) : (
        <ImageGrid items={filteredDirectors} />
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={closeSnackbar}>
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default DirectorGrid;