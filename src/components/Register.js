import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import apiUrls from '../config/ApiConfig';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import RequestInterceptor from '../utils/RequestInterceptor';

const Register = () => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const requestInterceptor = RequestInterceptor();

  const registerFormFields = [
    { label: 'Name', name: 'name', required: true },
    { label: 'Surname', name: 'surname', required: true },
    { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true, validationRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, title: 'Must be a well formed email address' },
    { label: 'Username', name: 'username', required: true },
    {
      label: 'Password',
      name: 'password',
      type: 'password',
      validationRegex: '^(?=.*[a-zA-Z0-9]).*(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\\:\'",.<>?]).{8,}$',
      title: 'Password must be at least 8 characters and contain both letters and special characters.',
      required: true,
    },
  ];

  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      const response = await requestInterceptor.post(apiUrls.register, formData);

      if (response.status === 201) {
        navigate('/login');
      } else {
        const errorData = response.data;
        setErrorMessage(errorData.message || 'Registration failed');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', marginTop: 50 }}>
      <h2>Register</h2>
      <DynamicForm formFields={registerFormFields} onSubmit={handleRegister} loading={loading} />
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Link to="/login">Already registered? Login here</Link>
      </div>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={closeSnackbar}>
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Register;