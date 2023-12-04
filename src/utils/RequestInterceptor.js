import axios from 'axios';
import { useUser } from '../config/UserContext';
import apiUrls from '../config/ApiConfig';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RequestInterceptor = () => {
  const axiosInstance = axios.create();
  const { user, login, logout } = useUser();
  const navigate = useNavigate();

  // Add a request interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      // If the user is authenticated, add the access token to the request headers
      if (user && user.accessToken) {
        if (isTokenExpired(user.accessToken)) {
          // Access token is expired, try to refresh
          try {
            const refreshToken = user.refreshToken;

            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const refreshResponse = await axios.post(apiUrls.refreshToken, { refreshToken });

            if (refreshResponse.status === 200) {
              const { accessToken, refreshToken } = refreshResponse.data;

              // Update the user context with the new tokens
              login(accessToken, refreshToken);

              // Retry the original request with the new access token
              config.headers.Authorization = `Bearer ${accessToken}`;
              return config;
            } else {
              // Refresh token failed, log out and redirect to login
              logout();
              navigate('/login');
              throw new Error('Failed to refresh access token');
            }
          } catch (refreshError) {
            // Handle any errors during the token refresh process
            logout();
            navigate('/login');
            throw new Error('Error during token refresh');
          }
        } else {
          // Access token is still valid, add it to headers
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

const isTokenExpired = (token) => {
  try {
    // Decode the token to get its expiration time
    const decodedToken = jwtDecode(token);
    
    // Check if the current time is greater than the expiration time
    return decodedToken.exp * 1000 < Date.now();
  } catch (error) {
    // Handle decoding errors
    console.error('Error decoding token:', error);
    return true; // Treat decoding errors as expired tokens
  }
};

export default RequestInterceptor;