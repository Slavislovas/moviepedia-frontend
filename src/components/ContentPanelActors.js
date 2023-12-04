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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RequestInterceptor from '../utils/RequestInterceptor';
import { useUser } from '../config/UserContext';
import apiUrls from '../config/ApiConfig';

const ContentPanelActors = () => {
    const [actors, setActors] = useState([]);
    const [editActor, setEditActor] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const { user } = useUser();
    const requestInterceptor = RequestInterceptor();
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [actorToDelete, setActorToDelete] = useState(null);

    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    useEffect(() => {
        if (user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR')) {
            fetchActors();
        }
    }, [user]);

    const fetchActors = async () => {
        try {
            const response = await requestInterceptor.get(apiUrls.actors);
            setActors(response.data);
        } catch (error) {
            console.error('Error fetching actors:', error);
        }
    };

    const handleEdit = (actor) => {
        setEditActor(actor);
        setIsCreateMode(false);
        setOpenEditDialog(true);
    };

    const handleEditClose = () => {
        setEditActor(null);
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
        const updatedActorData = {
            name: editActor?.name,
            surname: editActor?.surname,
            dateOfBirth: editActor?.dateOfBirth,
            biography: editActor?.biography,
            picture: base64WithoutPrefix,
        };

        try {
            // Send the PUT request with updated data
            await requestInterceptor.put(apiUrls.generateActorUrl(editActor?.id), updatedActorData);
            console.log('Actor updated successfully');
        } catch (error) {
            console.error('Error updating actor:', error);
            // Handle the error as needed
        } finally {
            setLoadingEdit(false);
        }
        fetchActors();
        handleEditClose();
    };

    const handleDelete = (actorId) => {
        setActorToDelete(actorId);
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setActorToDelete(null);
        setConfirmationDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
        setLoadingDelete(true);

        try {
            await requestInterceptor.delete(apiUrls.generateActorUrl(actorToDelete));
            console.log('Actor deleted successfully');
            fetchActors();
        } catch (error) {
            console.error('Error deleting actor:', error);
        } finally {
            setLoadingDelete(false);
            handleConfirmationDialogClose();
        }
    };

    const handleCreate = () => {
        setEditActor(null);
        setIsCreateMode(true);
        setOpenEditDialog(true);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior
        setLoadingCreate(true);
        try {
            // Validate required fields
            if (!editActor.name || !editActor.surname || !editActor.dateOfBirth || !editActor.biography) {
                console.error('Please fill in all required fields');
                // You might want to show an error message to the user
                return;
            }

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
            const newActorData = {
                name: editActor?.name,
                surname: editActor?.surname,
                dateOfBirth: editActor?.dateOfBirth,
                biography: editActor?.biography,
                picture: base64WithoutPrefix,
            };

            // Send the POST request with the new actor data
            await requestInterceptor.post(apiUrls.actors, newActorData);
            console.log('Actor created successfully');
            fetchActors();
            handleEditClose();
        } catch (error) {
            console.error('Error creating actor:', error);
            // Handle the error as needed
            // You might want to show an error message to the user
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
                                <TableCell>Name</TableCell>
                                <TableCell>Date of Birth</TableCell>
                                {user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR') && (
                                    <TableCell>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {actors.map((actor) => (
                                <TableRow key={actor.id}>
                                    <TableCell>{actor.id}</TableCell>
                                    <TableCell>
                                        {actor.pictureFilePath && (
                                            <img
                                                src={actor.pictureFilePath}
                                                alt={`${actor.name} ${actor.surname}`}
                                                style={{ maxWidth: '50px', maxHeight: '50px' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>{`${actor.name} ${actor.surname}`}</TableCell>
                                    <TableCell>{actor.dateOfBirth}</TableCell>
                                    {user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR') && (
                                        <TableCell>
                                            <IconButton onClick={() => handleEdit(actor)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(actor.id)}>
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
                    <DialogTitle>{isCreateMode ? 'Create New Actor' : 'Edit Actor'}</DialogTitle>
                    <DialogContent style={{ padding: 20 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    value={editActor?.name || ''}
                                    onChange={(e) => setEditActor({ ...editActor, name: e.target.value })}
                                    autoComplete="off"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField
                                    label="Surname"
                                    fullWidth
                                    value={editActor?.surname || ''}
                                    onChange={(e) => setEditActor({ ...editActor, surname: e.target.value })}
                                    autoComplete="off"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField
                                    fullWidth
                                    label="Date of birth"
                                    variant="outlined"
                                    type="date"
                                    name="Date of birth"
                                    value={editActor?.dateOfBirth || ''}
                                    onChange={(e) => setEditActor({ ...editActor, dateOfBirth: e.target.value })}
                                    autoComplete="off"
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Biography"
                                        multiline
                                        fullWidth
                                        value={editActor?.biography || ''}
                                        onChange={(e) => setEditActor({ ...editActor, biography: e.target.value })}
                                        autoComplete="off"
                                        required
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <FormControl fullWidth>
                                    <FormLabel required>Picture</FormLabel>
                                    <Input
                                        type="file"
                                        fullWidth
                                        onChange={(e) => setEditActor({ ...editActor, picture: e.target.files[0] })}
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
                <DialogTitle>Delete Actor</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this actor?</Typography>
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

export default ContentPanelActors;