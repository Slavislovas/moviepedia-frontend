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

const ContentPanelDirectors = () => {
  const [directors, setDirectors] = useState([]);
  const [editDirector, setEditDirector] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { user } = useUser();
  const requestInterceptor = RequestInterceptor();
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [directorToDelete, setDirectorToDelete] = useState(null);

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if (user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR')) {
      fetchDirectors();
    }
  }, [user]);

  const fetchDirectors = async () => {
    try {
      const response = await requestInterceptor.get(apiUrls.directors);
      setDirectors(response.data);
    } catch (error) {
      console.error('Error fetching actors:', error);
    }
  };

  const handleEdit = (director) => {
    setEditDirector(director);
    setIsCreateMode(false);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setEditDirector(null);
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
   const updatedDirectorData = {
     name: editDirector?.name,
     surname: editDirector?.surname,
     dateOfBirth: editDirector?.dateOfBirth,
     biography: editDirector?.biography,
     picture: base64WithoutPrefix,
   };

   try {
     // Send the PUT request with updated data
     await requestInterceptor.put(apiUrls.generateDirectorUrl(editDirector?.id), updatedDirectorData);
     fetchDirectors();
     handleEditClose();
   } catch (error) {
     // Handle the error as needed
   } finally {
    setLoadingEdit(false);
   }
  };

  const handleDelete = (directorId) => {
    setDirectorToDelete(directorId);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmationDialogClose = () => {
    setDirectorToDelete(null);
    setConfirmationDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);

    try {
      await requestInterceptor.delete(apiUrls.generateDirectorUrl(directorToDelete));
      fetchDirectors();
    } catch (error) {
    } finally {
      setLoadingDelete(false);
      handleConfirmationDialogClose();
    }
  };

  const handleCreate = () => {
    setEditDirector(null);
    setIsCreateMode(true);
    setOpenEditDialog(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setLoadingCreate(true);
    try {
      // Validate required fields
      if (!editDirector.name || !editDirector.surname || !editDirector.dateOfBirth || !editDirector.biography) {
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
      const newDirectorData = {
        name: editDirector?.name,
        surname: editDirector?.surname,
        dateOfBirth: editDirector?.dateOfBirth,
        biography: editDirector?.biography,
        picture: base64WithoutPrefix,
      };
  
      // Send the POST request with the new actor data
      await requestInterceptor.post(apiUrls.directors, newDirectorData);
      fetchDirectors();
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
                <TableCell>Name</TableCell>
                <TableCell>Date of Birth</TableCell>
                {user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR') && (
                  <TableCell>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {directors.map((director) => (
                <TableRow key={director.id}>
                  <TableCell>{director.id}</TableCell>
                  <TableCell>
                    {director.pictureFilePath && (
                      <img
                        src={director.pictureFilePath}
                        alt={`${director.name} ${director.surname}`}
                        style={{ maxWidth: '50px', maxHeight: '50px' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{`${director.name} ${director.surname}`}</TableCell>
                  <TableCell>{director.dateOfBirth}</TableCell>
                  {user && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_CONTENT_CURATOR') && (
                    <TableCell>
                      <IconButton onClick={() => handleEdit(director)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(director.id)}>
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
      <DialogTitle>{isCreateMode ? 'Create New Director' : 'Edit Director'}</DialogTitle>
        <DialogContent style={{padding:20}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}  lg={12}>
              <TextField
                label="Name"
                fullWidth
                value={editDirector?.name || ''}
                onChange={(e) => setEditDirector({ ...editDirector, name: e.target.value })}
                autoComplete="off"
                required
              />
            </Grid>
            <Grid item xs={12} md={12}  lg={12}>
              <TextField
                label="Surname"
                fullWidth
                value={editDirector?.surname || ''}
                onChange={(e) => setEditDirector({ ...editDirector, surname: e.target.value })}
                autoComplete="off"
                required
              />
            </Grid>
            <Grid item xs={12} md={12}  lg={12}>
              <TextField
               fullWidth
               label="Date of birth"
               variant="outlined"
               type="date"
                name="Date of birth"
                value={editDirector?.dateOfBirth || ''}
                onChange={(e) => setEditDirector({ ...editDirector, dateOfBirth: e.target.value })}
                autoComplete="off"
                required
                InputLabelProps={{
                    shrink: true,
                  }}
              />
            </Grid>
            <Grid item xs={12} md={12}  lg={12}>
              <FormControl fullWidth>
                <TextField
                  label="Biography"
                  multiline
                  fullWidth
                  value={editDirector?.biography || ''}
                  onChange={(e) => setEditDirector({ ...editDirector, biography: e.target.value })}
                  autoComplete="off"
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}  lg={12}>
              <FormControl fullWidth>
                <FormLabel required>Picture</FormLabel>
                <Input
                  type="file"
                  fullWidth
                  onChange={(e) => setEditDirector({ ...editDirector, picture: e.target.files[0] })}
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
        <DialogTitle>Delete Director</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this director? All of their movies will be deleted  aswell</Typography>
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

export default ContentPanelDirectors;