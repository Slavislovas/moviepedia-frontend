import React, { useEffect } from 'react';
import { Button, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import apiUrls from '../config/ApiConfig';
import { useUser } from '../config/UserContext';
import RequestInterceptor from '../utils/RequestInterceptor';
import DynamicForm from './DynamicForm';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { user } = useUser();
  const axiosInstance = RequestInterceptor();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const navigate = useNavigate();

  const formFields = [
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'Surname', name: 'surname', type: 'text', required: true },
    { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', required: true },
    { label: 'Email',
      name: 'email',
      type: 'text',
      required: true,
      title: 'Must be a well formed email address',
      validationRegex:  /^[^\s@]+@[^\s@]+\.[^\s@]+$/},
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(apiUrls.generateGetUserUrl(user.userId));

        if (response.status === 200) {
          const userData = response.data;
          // Set initial form data
          const initialFormData = {};
          formFields.forEach((field) => {
            initialFormData[field.name] = userData[field.name] || '';
          });
          setFormData(initialFormData);
        }
      } catch (error) {
        setSnackbarMessage('Error fetching user data');
        setOpenSnackbar(true);
      }
    };

    // Fetch user data when the component mounts
    fetchUserData();
  }, []);

  const [formData, setFormData] = React.useState({});
  const [formErrors, setFormErrors] = React.useState({});

  const handleSubmit = async (formData) => {
    setFormData(formData);
      handleDialogOpen();
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmEdit = async () => {
    try {
      console.log(formData);
      // Send post request to edit profile
      const response = await axiosInstance.put(apiUrls.generateGetUserUrl(user.userId), formData);

      if (response.status === 200) {
        setSnackbarMessage('Profile edited successfully');
        setOpenSnackbar(true);
        handleDialogClose();
        navigate(`/profile/${user.userId}`)
        // You may want to redirect to the profile page here
      } else {
        setSnackbarMessage('Error editing profile');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Error editing profile');
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
    <div style={{ maxWidth: 400, margin: 'auto', marginTop: 50 }}>
      <Typography variant="h5" gutterBottom>Edit profile</Typography>
      <DynamicForm
        formFields={formFields}
        onSubmit={handleSubmit}
        initialFormData={formData}
        formErrors={formErrors}
      />
      </div>
      {/* Snackbar for displaying messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />

      {/* Dialog for confirmation */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <div>Are you sure you want to edit your profile?</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmEdit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditProfile;