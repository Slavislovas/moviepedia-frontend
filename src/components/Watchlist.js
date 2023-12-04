import React, { useState, useEffect } from 'react';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import apiUrls from '../config/ApiConfig';
import RequestInterceptor from '../utils/RequestInterceptor';
import { Link } from 'react-router-dom';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const axiosInstance = RequestInterceptor();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axiosInstance.get(apiUrls.watchlist);
        if (response.status === 200) {
          setWatchlist(response.data);
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    };

    fetchWatchlist();
  }, []);

  const handleRemoveFromWatchlist = async (directorId, movieId) => {
    try {
      const response = await axiosInstance.delete(apiUrls.generateAddToWatchlistUrl(directorId, movieId));
      if (response.status === 200) {
        setWatchlist((prevWatchlist) => prevWatchlist.filter((movie) => movie.id !== movieId));
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error.response.data.message);
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={8} lg={6}>
        <Typography variant="h5" gutterBottom align="center">
          Watchlist
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Director</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {watchlist.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <img src={movie.pictureFilePath} alt={movie.title} style={{ width: 50, height: 50 }} />
                      </Grid>
                      <Grid item>
                        <Link to={`/directors/${movie.director.id}/movies/${movie.id}`}>{movie.title}</Link>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Link to={`/directors/${movie.director.id}`}>{movie.director.name} {movie.director.surname}</Link>
                  </TableCell>
                  <TableCell>{movie.year}</TableCell>
                  <TableCell>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromWatchlist(movie.director.id, movie.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Watchlist;