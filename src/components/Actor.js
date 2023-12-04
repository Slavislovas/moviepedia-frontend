import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Grid, Avatar, CircularProgress } from '@mui/material';
import apiUrls from '../config/ApiConfig';

const Actor = () => {
  const { actorId } = useParams();
  const [actorDetails, setActorDetails] = useState(null);

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        const response = await fetch(apiUrls.generateActorUrl(actorId));
        if (response.ok) {
          const data = await response.json();
          setActorDetails(data); // Assuming data is an object with movie details
        } else {
          console.error('Failed to fetch actor details:', response.status);
        }
      } catch (error) {
        console.error('Error during actor details fetch:', error);
      }
    };

    fetchActorDetails();
  }, []);

  return (
    <div>
      <Grid>
        {actorDetails ? (
          <>
            <Grid container spacing={2} justifyContent="center" sx={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 2 }}>
              <Paper style={{ padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  variant="rounded"
                  style={{ width: '100%', height: 'auto', maxWidth: 200, objectFit: 'cover', marginBottom: 16 }}
                  src={actorDetails.pictureFilePath}
                />
                <Typography variant="subtitle1" gutterBottom>
                  {actorDetails.name} {actorDetails.surname}
                </Typography>
              </Paper>

              <Paper style={{ padding: 50, textAlign: 'left', maxWidth: 1000}}>
                <Typography variant="body1" paragraph>
                  Date of birth: {actorDetails.dateOfBirth}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Biography: {actorDetails.biography}
                </Typography>
              </Paper>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <CircularProgress style={{ margin: 'auto' }} />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Actor;