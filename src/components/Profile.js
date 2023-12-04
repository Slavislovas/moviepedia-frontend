import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Typography, Button, Paper, CircularProgress } from '@mui/material';
import RequestInterceptor from '../utils/RequestInterceptor';
import apiUrls from '../config/ApiConfig';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { userId } = useParams();

    const requestInterceptor = RequestInterceptor();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await requestInterceptor.get(apiUrls.generateGetUserUrl(userId));
                if (response.status === 200) {
                    const data = response.data;
                    console.log(data);
                    setUserData(data);
                } else {
                    const errorData = response.data;
                    setErrorMessage(errorData.message || 'Failed to fetch profile details');
                    setSnackbarOpen(true);
                }
            } catch (error) {
                setErrorMessage('An unexpected error occurred during profile details fetch.');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };
            fetchUserData();
    }, []);

    const closeSnackbar = () => {
        setSnackbarOpen(false);
      };

    return (
        <div>
            {loading ? (
                <CircularProgress style={{ margin: 'auto' }} />
            ) : (
                <Paper style={{ padding: 20, maxWidth: 400, margin: 'auto', marginTop: 20 }}>
                    <Button sx={{ margin: 1, width: '100%', maxWidth: 300, maxHeight: 200, height: '100%' }} variant="contained" color="primary" component={Link} to="/watchlist">
                            Watchlist
                    </Button>
                    <Button sx={{ margin: 1, width: '100%', maxWidth: 300, maxHeight: 200, height: '100%' }} variant="contained" color="primary" component={Link} to="/watched-movies">
                            Watched movies
                    </Button>
                    <Typography variant="h5" gutterBottom>
                        User Profile
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Name:</strong> {userData.name}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Surname:</strong> {userData.surname}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Date of Birth:</strong> {userData.dateOfBirth}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Email:</strong> {userData.email}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Username:</strong> {userData.username}
                    </Typography>
                    <Button variant="contained" color="primary" component={Link} to="/profile/edit" style={{ marginTop: 10 }}>
                        Edit Profile
                    </Button>
                </Paper>
            )}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
                <MuiAlert elevation={6} variant="filled" severity="error" onClose={closeSnackbar}>
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default Profile;