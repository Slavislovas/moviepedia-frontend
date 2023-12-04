import React, { useState, useEffect } from 'react';
import ImageGrid from './ImageGrid';
import apiUrls from '../config/ApiConfig';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import RequestInterceptor from '../utils/RequestInterceptor';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ActorGrid = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredActors, setFilteredActors] = useState([]);
  const requestInterceptor = RequestInterceptor();

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await requestInterceptor.get(apiUrls.actors);

        if (response.status === 200) {
          const data = response.data;
          const actorsWithLinks = data.map((actor) => ({
            ...actor,
            link: `/actors/${actor.id}`,
            title: `${actor.name} ${actor.surname}`,
          }));
          setActors(actorsWithLinks);
        } else {
          const errorData = response.data;
          console.error('Failed to retrieve actors:', errorData.message || 'Unknown error');
          setErrorMessage(errorData.message || 'Failed to retrieve list of actors');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('An unexpected error occurred during actor fetch:', error);
        setErrorMessage('An unexpected error occurred.');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, []); // Remove requestInterceptor from dependencies

  useEffect(() => {
    // Filter actors based on the search term
    const filtered = actors.filter(
      (actor) =>
        `${actor.name} ${actor.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActors(filtered);
  }, [searchTerm, actors]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <TextField
        label="Search by actor name"
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
        <p>Loading actors...</p>
      ) : (
        <ImageGrid items={filteredActors} />
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={closeSnackbar}>
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default ActorGrid;