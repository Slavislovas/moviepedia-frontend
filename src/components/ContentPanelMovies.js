import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    IconButton,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Input,
    InputAdornment,
    FormControl,
    FormLabel,
    Typography,
    CircularProgress,
    MenuItem,
    Select,
    Autocomplete,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RequestInterceptor from '../utils/RequestInterceptor';
import { useUser } from '../config/UserContext';
import apiUrls from '../config/ApiConfig';

const ContentPanelMovies = () => {
    const [movies, setMovies] = useState([]);
    const [editMovie, setEditMovie] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const { user } = useUser();
    const requestInterceptor = RequestInterceptor();
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [directors, setDirectors] = useState([]);

    useEffect(() => {
        if (user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR')) {
            fetchMovies();
            fetchDirectors();
        }
    }, [user]);

    const fetchDirectors = async () => {
        try {
            const response = await requestInterceptor.get(apiUrls.directors);
            setDirectors(response.data);
        } catch (error) {
            console.error('Error fetching directors:', error);
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await requestInterceptor.get(apiUrls.movies);
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const handleEdit = (movie) => {
        setEditMovie(movie);
        setIsCreateMode(false);
        setOpenEditDialog(true);
    };

    const handleEditClose = () => {
        setEditMovie(null);
        setOpenEditDialog(false);
    };

    const handleEditSave = async (e) => {
        // Convert the picture to Base64
        e.preventDefault();
        setLoadingEdit(true);
        const pictureFileInput = document.getElementById('edit-dialog-picture-input');
        let base64WithoutPrefix = '';
        if (pictureFileInput.files.length > 0) {
            const reader = new FileReader();
            await new Promise((resolve) => {
                reader.onload = (event) => {
                    base64WithoutPrefix = event.target.result.split(',')[1]
                    resolve(event.target.result);
                };
                reader.readAsDataURL(pictureFileInput.files[0]);
            });
        }
        // Prepare the data for the PUT request
        const updatedMovieData = {
            title: editMovie?.title,
            description: editMovie?.description,
            year: editMovie?.year,
            genre: editMovie?.genre,
            picture: base64WithoutPrefix,
        };

        try {
            // Send the PUT request with updated data
            await requestInterceptor.put(apiUrls.generateMovieUrl(editMovie.director.id, editMovie?.id), updatedMovieData);
            fetchMovies();
            handleEditClose();
        } catch (error) {
            // Handle the error as needed
        } finally {
            setLoadingEdit(false);
        }
    };

    const handleDelete = (movie) => {
        setMovieToDelete(movie);
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setMovieToDelete(null);
        setConfirmationDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
        setLoadingDelete(true);

        try {
            await requestInterceptor.delete(apiUrls.generateMovieUrl(movieToDelete.director.id, movieToDelete.id));
            fetchMovies();
        } catch (error) {
        } finally {
            setLoadingDelete(false);
            handleConfirmationDialogClose();
        }
    };

    const handleCreate = () => {
        setEditMovie(null);
        setIsCreateMode(true);
        setOpenEditDialog(true);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior
        setLoadingCreate(true);
        try {
            // Convert the picture to Base64
            const pictureFileInput = document.getElementById('edit-dialog-picture-input');
            let base64WithoutPrefix = '';
            if (pictureFileInput.files.length > 0) {
                const reader = new FileReader();
                await new Promise((resolve) => {
                    reader.onload = (event) => {
                        base64WithoutPrefix = event.target.result.split(',')[1];
                        resolve(event.target.result);
                    };
                    reader.readAsDataURL(pictureFileInput.files[0]);
                });
            }

            // Prepare the data for the POST request
            const newMovieData = {
                title: editMovie?.title,
                description: editMovie?.description,
                year: editMovie?.year,
                genre: editMovie?.genre,
                picture: base64WithoutPrefix,
            };

            // Send the POST request with the new actor data
            await requestInterceptor.post(apiUrls.generateCreateMovieUrl(editMovie.director.id), newMovieData);
            fetchMovies();
            handleEditClose();
        } catch (error) {
            // Handle the error as needed
        } finally {
            setLoadingCreate(false);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                {user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR') && (
                    <Button variant="contained" color="primary" style={{ marginBottom: '16px' }} onClick={handleCreate}>
                        Create New
                    </Button>
                )}
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Picture</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Year</TableCell>
                                <TableCell>Genre</TableCell>
                                {user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR') && (
                                    <TableCell>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {movies.map((movie) => (
                                <TableRow key={movie.id}>
                                    <TableCell>{movie.id}</TableCell>
                                    <TableCell>
                                        {movie.pictureFilePath && (
                                            <img
                                                src={movie.pictureFilePath}
                                                alt={`${movie.title}`}
                                                style={{ maxWidth: '50px', maxHeight: '50px' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>{`${movie.title}`}</TableCell>
                                    <TableCell>{`${movie.description}`}</TableCell>
                                    <TableCell>{`${movie.year}`}</TableCell>
                                    <TableCell>{`${movie.genre}`}</TableCell>
                                    {user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR') && (
                                        <TableCell>
                                            <IconButton onClick={() => handleEdit(movie)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(movie)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Dialog open={openEditDialog} onClose={handleEditClose}>
                <form onSubmit={isCreateMode ? handleCreateSubmit : handleEditSave}>
                    <DialogTitle>{isCreateMode ? 'Create New Movie' : 'Edit Movie'}</DialogTitle>
                    <DialogContent style={{ padding: 20 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField
                                    label="Title"
                                    fullWidth
                                    value={editMovie?.title || ''}
                                    onChange={(e) => setEditMovie({ ...editMovie, title: e.target.value })}
                                    autoComplete="off"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    value={editMovie?.description || ''}
                                    onChange={(e) => setEditMovie({ ...editMovie, description: e.target.value })}
                                    autoComplete="off"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField
                                    fullWidth
                                    label="Year"
                                    variant="outlined"
                                    type="number"
                                    inputProps={{
                                        min: 1900, // Set the minimum year
                                        max: new Date().getFullYear(), // Set the maximum year as the current year
                                    }}
                                    name="Year"
                                    value={editMovie?.year || ''}
                                    onChange={(e) => setEditMovie({ ...editMovie, year: e.target.value })}
                                    autoComplete="off"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <FormControl fullWidth>
                                    <FormLabel required>Genre</FormLabel>
                                    <Select
                                        value={editMovie?.genre || ''}
                                        onChange={(e) => setEditMovie({ ...editMovie, genre: e.target.value })}
                                        autoComplete="off"
                                        required
                                    >
                                        <MenuItem value="Action">Action</MenuItem>
                                        <MenuItem value="Comedy">Comedy</MenuItem>
                                        <MenuItem value="Drama">Drama</MenuItem>
                                        <MenuItem value="Fantasy">Fantasy</MenuItem>
                                        <MenuItem value="Horror">Horror</MenuItem>
                                        <MenuItem value="Mystery">Mystery</MenuItem>
                                        <MenuItem value="Romance">Romance</MenuItem>
                                        <MenuItem value="Thriller">Thriller</MenuItem>
                                        <MenuItem value="Western">Western</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {isCreateMode === true && (
                                 <Grid item xs={12} md={12} lg={12}>
                                 <FormControl fullWidth>
                                     <FormLabel required>Director</FormLabel>
                                     <Autocomplete
                                         options={directors} // Populate this array with the directors from your get request
                                         getOptionLabel={(option) => `${option.name} ${option.surname}`} // Adjust this based on your director data structure
                                         value={editMovie?.director || null}
                                         onChange={(event, newValue) => setEditMovie({ ...editMovie, director: newValue })}
                                         renderInput={(params) => (
                                             <TextField {...params} label="Search for Director" variant="outlined" />
                                         )}
                                     />
                                 </FormControl>
                             </Grid>
                            )}
                            <Grid item xs={12} md={12} lg={12}>
                                <FormControl fullWidth>
                                    <FormLabel>Picture</FormLabel>
                                    <Input
                                        type="file"
                                        fullWidth
                                        onChange={(e) => setEditMovie({ ...editMovie, picture: e.target.files[0] })}
                                        endAdornment={<InputAdornment position="end">Upload</InputAdornment>}
                                        id="edit-dialog-picture-input"
                                        accept="image/*"
                                        required
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose} disabled={loadingCreate || loadingEdit}>
                            Cancel
                        </Button>
                        <Button type="submit" color="primary" disabled={loadingCreate || loadingEdit}>
                            {loadingCreate || loadingEdit ? <CircularProgress size={24} /> : isCreateMode ? 'Create' : 'Save'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={confirmationDialogOpen} onClose={handleConfirmationDialogClose}>
                <DialogTitle>Delete Movie</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this movie?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmationDialogClose} disabled={loadingDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} disabled={loadingDelete} color="primary">
                        {loadingDelete ? <CircularProgress size={24} /> : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default ContentPanelMovies;