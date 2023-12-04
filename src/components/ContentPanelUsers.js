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
    FormControl,
    FormLabel,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
    Select,
    MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RequestInterceptor from '../utils/RequestInterceptor';
import { useUser } from '../config/UserContext';
import apiUrls from '../config/ApiConfig';

const ContentPanelUsers = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const { user } = useUser();
    const requestInterceptor = RequestInterceptor();
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR')) {
            fetchUsers();
        }
    }, [user]);

    const setFieldError = (fieldName, errorMessage) => {
        setFormErrors((prevErrors) => ({ ...prevErrors, [fieldName]: errorMessage }));
    };

    const clearFieldErrors = () => {
        setFormErrors({});
    };

    const fetchUsers = async () => {
        try {
            const response = await requestInterceptor.get(apiUrls.users);
            setUsers(response.data);
        } catch (error) {
            showSnackbar(error.response.data.message);
        }
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setIsCreateMode(false);
        setOpenEditDialog(true);
    };

    const handleEditClose = () => {
        setEditUser(null);
        setOpenEditDialog(false);
    };

    const handleEditSave = async (e) => {
        // Convert the picture to Base64
        e.preventDefault();
        setLoadingEdit(true);

        // Prepare the data for the PUT request
        const updatedUserData = {
            name: editUser?.name,
            surname: editUser?.surname,
            dateOfBirth: editUser?.dateOfBirth,
            email: editUser?.email,
            role: editUser?.role
        };

        try {
            // Send the PUT request with updated data
            await requestInterceptor.put(apiUrls.generateEditUserUrl(editUser?.id), updatedUserData);
            fetchUsers();
            handleEditClose();
        } catch (error) {
            const serverErrors = error.response.data;
            const errorMap = {};

            serverErrors.forEach((errorItem) => {
                errorMap[errorItem.field] = errorItem.errorMessage;
            });
            setFormErrors(errorMap);
        } finally {
            setLoadingEdit(false);
        }
    };

    const handleDelete = (userId) => {
        setUserToDelete(userId);
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setUserToDelete(null);
        setConfirmationDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
        setLoadingDelete(true);

        try {
            await requestInterceptor.delete(apiUrls.generateGetUserUrl(userToDelete));
            fetchUsers();
        } catch (error) {
            showSnackbar(error.response.data.message);
        } finally {
            setLoadingDelete(false);
            handleConfirmationDialogClose();
        }
    };

    const handleCreate = () => {
        setEditUser(null);
        setIsCreateMode(true);
        setOpenEditDialog(true);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior
        setLoadingCreate(true);
        try {
            // Prepare the data for the POST request
            const newUserData = {
                name: editUser?.name,
                surname: editUser?.surname,
                dateOfBirth: editUser?.dateOfBirth,
                email: editUser?.email,
                username: editUser?.username,
                password: editUser?.password
            };

            // Send the POST request with the new actor data
            await requestInterceptor.post(apiUrls.users, newUserData);
            fetchUsers();
            handleEditClose();
        } catch (error) {
            const serverErrors = error.response.data;
            const errorMap = {};

            serverErrors.forEach((errorItem) => {
                errorMap[errorItem.field] = errorItem.errorMessage;
            });
            setFormErrors(errorMap);
        } finally {
            setLoadingCreate(false);
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
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
                                <TableCell>Name</TableCell>
                                <TableCell>Date of Birth</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Role</TableCell>
                                {user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR') && (
                                    <TableCell>Actions</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((retrievedUser) => (
                                <TableRow key={retrievedUser.id}>
                                    <TableCell>{retrievedUser.id}</TableCell>
                                    <TableCell>{`${retrievedUser.name} ${retrievedUser.surname}`}</TableCell>
                                    <TableCell>{retrievedUser.dateOfBirth}</TableCell>
                                    <TableCell>{retrievedUser.email}</TableCell>
                                    <TableCell>{retrievedUser.username}</TableCell>
                                    <TableCell>{retrievedUser.role}</TableCell>
                                    {user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR') && (
                                        <TableCell>
                                            <IconButton onClick={() => handleEdit(retrievedUser)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(retrievedUser.id)}>
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
            <Dialog open={openEditDialog} onClose={() => {
                handleEditClose();
                clearFieldErrors();
            }}>
                <form onSubmit={isCreateMode ? handleCreateSubmit : handleEditSave}>
                    <DialogTitle>{isCreateMode ? 'Create New User' : 'Edit User'}</DialogTitle>
                    <DialogContent style={{ padding: 20 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    value={editUser?.name || ''}
                                    onChange={(e) => {
                                        setEditUser({ ...editUser, name: e.target.value })
                                        setFieldError('name', '');
                                    }}
                                    autoComplete="off"
                                    required
                                />
                                {formErrors.name && <Typography color="error">{formErrors.name}</Typography>}
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField
                                    label="Surname"
                                    fullWidth
                                    value={editUser?.surname || ''}
                                    onChange={(e) => {
                                        setEditUser({ ...editUser, surname: e.target.value })
                                        setFieldError('surname', '');
                                    }}
                                    autoComplete="off"
                                    required
                                />
                                {formErrors.surname && <Typography color="error">{formErrors.surname}</Typography>}
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField
                                    fullWidth
                                    label="Date of birth"
                                    variant="outlined"
                                    type="date"
                                    name="Date of birth"
                                    value={editUser?.dateOfBirth || ''}
                                    onChange={(e) => {
                                        setEditUser({ ...editUser, dateOfBirth: e.target.value })
                                        setFieldError('dateOfBirth', '');
                                    }}
                                    autoComplete="off"
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                {formErrors.dateOfBirth && <Typography color="error">{formErrors.dateOfBirth}</Typography>}
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Email"
                                        multiline
                                        fullWidth
                                        value={editUser?.email || ''}
                                        onChange={(e) => {
                                            setEditUser({ ...editUser, email: e.target.value })
                                            setFieldError('email', '');
                                        }}
                                        autoComplete="off"
                                        required
                                        type="email"
                                    />
                                    {formErrors.email && <Typography color="error">{formErrors.email}</Typography>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField
                                    label="Username"
                                    fullWidth
                                    value={editUser?.username || ''}
                                    onChange={(e) => {
                                        setEditUser({ ...editUser, username: e.target.value })
                                        setFieldError('username', '');
                                    }}
                                    autoComplete="off"
                                    required
                                />
                                {formErrors.username && <Typography color="error">{formErrors.username}</Typography>}
                            </Grid>
                            {isCreateMode === true && (
                                <Grid item xs={12} md={12} lg={12}>
                                    <TextField
                                        label="Password"
                                        fullWidth
                                        value={editUser?.password || ''}
                                        onChange={(e) => {
                                            setEditUser({ ...editUser, password: e.target.value })
                                            setFieldError('password', '');
                                        }}
                                        autoComplete="off"
                                        required
                                        type="password"
                                    />
                                    {formErrors.password && <Typography color="error">{formErrors.password}</Typography>}
                                </Grid>
                            )}
                            {isCreateMode === false && (
                                <Grid item xs={12} md={12} lg={12}>
                                    <FormControl fullWidth>
                                        <FormLabel required>Role</FormLabel>
                                        <Select
                                            value={editUser?.role || ''}
                                            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                            autoComplete="off"
                                            required
                                        >
                                            <MenuItem value="ROLE_USER">User</MenuItem>
                                            <MenuItem value="ROLE_CONTENT_CURATOR">Content curator</MenuItem>
                                            <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
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
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this user?</Typography>
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
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default ContentPanelUsers;