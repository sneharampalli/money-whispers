// frontend/src/App.js
import React, { Component } from 'react';
import MoneyWhispersNavbar from './MoneyWhispersNavbar.tsx';
import '@fontsource/league-spartan/400.css'; // Import the regular weight (400)
import "@fontsource/libre-baskerville"; // Defaults to weight 400
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './AuthContext.js';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3C4F48',
      light: '#5c6f68',
      dark: '#2a3732',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#EDEDED',
      light: '#3a3a3a',
      dark: '#1c1c1c',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#3C4F48',
      secondary: '#282828',
    },
  },
});

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <MoneyWhispersNavbar />
        </AuthProvider>
      </ThemeProvider>
    );
  }
}

export default App;