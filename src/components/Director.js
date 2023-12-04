import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Grid, Avatar, CircularProgress } from '@mui/material';
import apiUrls from '../config/ApiConfig';
import RequestInterceptor from '../utils/RequestInterceptor';

const Director = () => {
  const { directorId } = useParams();
  const [directorDetails, setDirectorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const requestInterceptor = RequestInterceptor();

  useEffect(() => {
    const fetchDirectorDetails = async () => {
      try {
        const response = await requestInterceptor.get(apiUrls.generateDirectorUrl(directorId));

        if (response.status === 200) {
          const data = response.data;
          setDirectorDetails(data);
        } else {
          const errorData = response.data;
          setErrorMessage(errorData.message || 'Failed to fetch director details');
          setSnackbarOpen(true);
        }
      } catch (error) {
        setErrorMessage('An unexpected error occurred during director details fetch.');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectorDetails();
  }, []);

  return (
    <div>
      <Grid>
        {loading ? (
          <Grid item xs={12}>
            <CircularProgress style={{ margin: 'auto' }} />
          </Grid>
        ) : (
          <>
            <Grid container spacing={2} justifyContent="center" sx={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 2 }}>
              <Paper style={{ padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  variant="rounded"
                  style={{ width: '100%', height: 'auto', maxWidth: 200, objectFit: 'cover', marginBottom: 16 }}
                  src={directorDetails.pictureFilePath}
                />
                <Typography variant="subtitle1" gutterBottom>
                  {directorDetails.name} {directorDetails.surname}
                </Typography>
              </Paper>

              <Paper style={{ padding: 50, textAlign: 'left', maxWidth: 1000 }}>
                <Typography variant="body1" paragraph>
                  Date of birth: {directorDetails.dateOfBirth}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Biography: {directorDetails.biography}
                </Typography>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default Director;