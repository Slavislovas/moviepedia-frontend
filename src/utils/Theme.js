import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#2196F3',
      },
      secondary: {
        main: '#FF4081',
      },
      background: {
        default: '#f0f0f0',
      },
    },
    appbar: {
        typography:{
            fontFamily: 'Roboto Condensed, sans-serif',
            fontSize: '4rem'
        }
    },
    typography: {
      fontFamily: 'Roboto Condensed, sans-serif', // Specify the fallback font first
      h1: {
        fontFamily: 'Roboto Condensed, sans-serif', // Specify the font for headings
        fontSize: '2.5rem', // Adjusted font size
        fontWeight: 600,
      },
      h2: {
        fontFamily: 'Roboto Condensed, sans-serif',
        fontSize: '2rem', // Adjusted font size
        fontWeight: 500,
      },
      h3: {
        fontFamily: 'Roboto Condensed, sans-serif',
        fontSize: '1.8rem', // Adjusted font size
        fontWeight: 500,
      },
      body1: {
        fontFamily: 'Roboto Condensed, sans-serif',
        fontSize: '1.2rem', // Adjusted font size
      },
      body2: {
        fontFamily: 'Roboto Condensed, sans-serif',
        fontSize: '1rem', // Adjusted font size
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
  });
  
  export default theme;