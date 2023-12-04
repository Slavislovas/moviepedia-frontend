import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import apiUrls from '../config/ApiConfig';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useUser } from '../config/UserContext';
import RequestInterceptor from '../utils/RequestInterceptor';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loginFormFields = [
    { label: 'Username', name: 'username', required: true },
    { label: 'Password', name: 'password', type: 'password', required: true },
  ];

  const requestInterceptor = RequestInterceptor();

  const handleLogin = async (formData) => {
    try {
      setLoading(true);

      const response = await requestInterceptor.post(apiUrls.login, formData);

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;
        // Save tokens in cookies and user context
        login(accessToken, refreshToken);

        // Handle successful login, e.g., navigate to another page
        navigate('/');
      } else {
        const errorData = response.data;
        setErrorMessage(errorData.message || 'Login failed');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred during login.');
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
      <h2>Login</h2>
      <DynamicForm formFields={loginFormFields} onSubmit={handleLogin} loading={loading} />
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Link to="/register">Not Registered? Register here</Link>
      </div>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={closeSnackbar}>
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Login;