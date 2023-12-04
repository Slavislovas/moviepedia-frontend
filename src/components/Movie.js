import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Typography, Paper, Grid, Avatar, CircularProgress, TextField, Button, List, ListItem, ListItemText, Rating, IconButton } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import apiUrls from '../config/ApiConfig';
import { useUser } from '../config/UserContext';
import RequestInterceptor from '../utils/RequestInterceptor';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const Movie = () => {
    const { directorId, movieId } = useParams();
    const [movieDetails, setMovieDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState('');
    const { user } = useUser();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [movieInUserWatchlist, setMovieInUserWatchlist] = useState(false);
    const [movieInUserWatchedMovies, setMovieInUserWatchedMovies] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    const requestInterceptor = RequestInterceptor();

    const fetchReviews = async () => {
        try {
            const response = await requestInterceptor.get(apiUrls.generateMovieReviewsUrl(directorId, movieId));
            setReviews(response.data);
        } catch (error) {
            handleFetchError(error);
        }
    };

    const fetchMovieDetails = async () => {
        try {
            const response = await requestInterceptor.get(apiUrls.generateMovieUrl(directorId, movieId));
            setMovieDetails(response.data);
            setMovieInUserWatchedMovies(response.data.movieInUserWatchedMovies);
            setMovieInUserWatchlist(response.data.movieInUserWatchlist);
            //setUserRating(response.data.userRating || 0);
        } catch (error) {
            handleFetchError(error);
        }
    };

    useEffect(() => {
        fetchMovieDetails();
        fetchReviews();
        console.log(user);
    }, [directorId, movieId]);

    const handleReviewSubmit = async () => {
        try {
            await requestInterceptor.post(apiUrls.generateMovieReviewsUrl(directorId, movieId), { text: review });
            // Refresh the reviews after submitting a new one
            fetchReviews();
            setReview('');
            console.log('Review submitted successfully');
        } catch (error) {
            handleFetchError(error);
        }
    };

    const handleFetchError = (error) => {
        console.log("fetch error");
        if (error.response) {
            const errorData = error.response.data;
            setErrorMessage(errorData.message || 'Failed to fetch data');
        } else {
            setErrorMessage('An unexpected error occurred.');
        }
        setSnackbarOpen(true);
    };

    const closeSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleAddToWatchlist = async () => {
        try {
            const addToWatchlistUrl = apiUrls.generateAddToWatchlistUrl(movieDetails.director.id, movieDetails.id);
            await requestInterceptor.post(addToWatchlistUrl);
            setMovieInUserWatchlist(true);
            console.log('Added to watchlist successfully');
        } catch (error) {
            console.log(error);
            handleFetchError(error);
        }
    };

    const handleRemoveFromWatchlist = async () => {
        try {
            const removeFromWatchlistUrl = apiUrls.generateAddToWatchlistUrl(movieDetails.director.id, movieDetails.id);
            await requestInterceptor.delete(removeFromWatchlistUrl);
            setMovieInUserWatchlist(false);
            console.log('Removed from watchlist successfully');
        } catch (error) {
            handleFetchError(error);
        }
    };

    const handleAddToWatchedMovies = async () => {
        try {
            const addToWatchedMoviesUrl = apiUrls.generateAddToWatchedMoviesUrl(movieDetails.director.id, movieDetails.id);
            await requestInterceptor.post(addToWatchedMoviesUrl);
            setMovieInUserWatchedMovies(true);
        } catch (error) {
            handleFetchError(error);
        }
    };

    const handleRemoveFromWatchedMovies = async () => {
        try {
            const removeFromWatchedMoviesUrl = apiUrls.generateAddToWatchedMoviesUrl(movieDetails.director.id, movieDetails.id);
            await requestInterceptor.delete(removeFromWatchedMoviesUrl);
            setMovieInUserWatchedMovies(false);
            console.log('Removed from watched movies successfully');
        } catch (error) {
            handleFetchError(error);
        }
    };

    const handleRatingChange = (event, newValue) => {
        setUserRating(newValue);
        const value = newValue === null ? movieDetails.userRatingForMovie : newValue;
        console.log(value);
        const ratingUrl = apiUrls.generateRateMovieUrl(directorId, movieId, value);
        requestInterceptor.post(ratingUrl)
            .then(() => {
                console.log('Rating submitted successfully');
                // Refresh the movie details after rating submission
                fetchMovieDetails();
            })
            .catch(error => handleFetchError(error));
    };

    const handleDeleteReview = (directorId, movieId, reviewId) => {
        const deleteReviewUrl = apiUrls.generateDeleteMovieReviewUrl(directorId, movieId, reviewId);
        requestInterceptor.delete(deleteReviewUrl)
            .then(() => {
                console.log('Review deleted successfully');
                fetchReviews();
            })
            .catch(error => handleFetchError(error));
    };

    const handleLike = (directorId, movieId, reviewId) => {
        const deleteReviewUrl = apiUrls.generateLikeUrl(directorId, movieId, reviewId);
        requestInterceptor.post(deleteReviewUrl)
            .then(() => {
                console.log('Review liked successfully');
                fetchReviews();
            })
            .catch(error => handleFetchError(error));
    };

    const handleDislike = (directorId, movieId, reviewId) => {
        const deleteReviewUrl = apiUrls.generateDislikeUrl(directorId, movieId, reviewId);
        requestInterceptor.post(deleteReviewUrl)
            .then(() => {
                console.log('Review disliked successfully');
                fetchReviews();
            })
            .catch(error => handleFetchError(error));
    };

    return (
        <div>
            {user && movieDetails && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_USER') && (
                <>
                    {!movieInUserWatchlist && (
                        <Button sx={{ margin: 1, width: '100%', maxWidth: 300, maxHeight: 200, height: '100%' }} variant="contained" color="primary" onClick={handleAddToWatchlist}>
                            Add to Watchlist
                        </Button>
                    )}
                    {movieInUserWatchlist && (
                        <Button sx={{ margin: 1, width: '100%', maxWidth: 300, maxHeight: 100, height: '100%' }} variant="contained" color="secondary" onClick={handleRemoveFromWatchlist}>
                            Remove from Watchlist
                        </Button>
                    )}
                    {!movieInUserWatchedMovies && (
                        <Button sx={{ margin: 1, width: '100%', maxWidth: 300, maxHeight: 100, height: '100%' }} variant="contained" color="primary" onClick={handleAddToWatchedMovies}>
                            Add to Watched Movies
                        </Button>
                    )}
                    {movieInUserWatchedMovies && (
                        <Button sx={{ margin: 1, width: '100%', maxWidth: 300, maxHeight: 100, height: '100%' }} variant="contained" color="secondary" onClick={handleRemoveFromWatchedMovies}>
                            Remove from Watched Movies
                        </Button>
                    )}
                </>
            )}
            <Grid container spacing={2} justifyContent="center" alignItems="stretch" sx={{ margin: 'auto', marginTop: 2 }}>
                {movieDetails ? (
                    <>
                        <Grid item xs={12} md={6} lg={2}>
                            <Paper style={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 400, height: '100%' }}>
                                <Avatar
                                    variant="rounded"
                                    style={{ width: '100%', height: 'auto', maxWidth: 200, objectFit: 'cover', marginBottom: 4 }}
                                    src={movieDetails.pictureFilePath}
                                    alt={movieDetails.title}
                                />
                                <Typography variant="subtitle1" gutterBottom>
                                    {movieDetails.title}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6} lg={5}>
                            <Paper style={{ padding: 4, textAlign: 'left', height: '100%', maxWidth: 800 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Director: <Link to={`/directors/${movieDetails.director.id}`}>{movieDetails.director.name} {movieDetails.director.surname}</Link>
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Description: {movieDetails.description}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Year: {movieDetails.year}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Genre: {movieDetails.genre}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Actors:
                                    <ul>
                                        {movieDetails.actors.map((actor) => (
                                            <li key={actor.id}>
                                                <Link to={`/actors/${actor.id}`}>{actor.name} {actor.surname}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} style={{ marginTop: 20 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Rating:
                                <Rating
                                    name="user-rating"
                                    value={movieDetails.rating}
                                    precision={1}
                                    onChange={handleRatingChange}
                                    readOnly={!(user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_USER'))}
                                />
                                <Typography variant="subtitle2" gutterBottom>{`Total votes: ${movieDetails.totalVotes}`}</Typography>
                                {movieDetails.userRatingForMovie !== 0 && (
                                    <>
                                        <Typography variant="subtitle2" gutterBottom>{`Your rating: ${movieDetails.userRatingForMovie}`}</Typography>
                                    </>
                                )}
                            </Typography>
                        </Grid>
                        <Grid item xs={11} md={11} lg={11} style={{ marginTop: 20 }}>
                            <Paper style={{ padding: 4, textAlign: 'left' }}>
                                {/* Review Section */}
                                <Typography variant="h6" gutterBottom>
                                    Reviews:
                                </Typography>
                                <List>
                                    {reviews.map((review) => (
                                        <ListItem key={review.id}>
                                            <ListItemText
                                                primary={review.text}
                                                secondary={
                                                    <React.Fragment>
                                                        {`By ${review.reviewerUsername} | Likes: ${review.likes} Dislikes: ${review.dislikes}`}
                                                        <Rating name="reviewer-rating" readOnly={true} value={review.rating} sx={{ fontSize: 16 }} />
                                                        {(user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_USER') && (user.userId === review.reviewerId.toString()) && (
                                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteReview(movieDetails.director.id, movieDetails.id, review.id)}>
                                                                <DeleteIcon />
                                                            </IconButton>)}
                                                        {(user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_USER') && (user.userId !== review.reviewerId.toString()) && (
                                                            <IconButton color="primary" onClick={() => handleLike(movieDetails.director.id, movieDetails.id, review.id)}>
                                                                <ThumbUpIcon />
                                                            </IconButton>)}
                                                        {(user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_USER') && (user.userId !== review.reviewerId.toString()) && (
                                                            <IconButton color="secondary" onClick={() => handleDislike(movieDetails.director.id, movieDetails.id, review.id)}>
                                                                <ThumbDownIcon />
                                                            </IconButton>)}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                {user && (user.userRole === 'ROLE_USER' || user.userRole === 'ROLE_ADMIN') && (
                                    <>
                                        <TextField
                                            label="Write your review"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            style={{ marginBottom: 2 }}
                                        />
                                        {movieDetails.userRatingForMovie !== 0 && (
                                            <Button variant="contained" color="primary" onClick={handleReviewSubmit}>
                                                Submit Review
                                            </Button>
                                        )}
                                        {movieDetails.userRatingForMovie === 0 && (
                                            <Button variant="contained" disabled="true" color="primary" onClick={handleReviewSubmit}>
                                                Rating required for review submission
                                            </Button>
                                        )}
                                    </>
                                )}
                            </Paper>
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={12}>
                        <CircularProgress style={{ margin: 'auto' }} />
                    </Grid>
                )}
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
                <MuiAlert elevation={6} variant="filled" severity="error" onClose={closeSnackbar}>
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
        </div >
    );
};

export default Movie;