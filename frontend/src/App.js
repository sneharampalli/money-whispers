// frontend/src/App.js
import React, { Component } from 'react';
import MoneyWhispersNavbar from './MoneyWhispersNavbar.tsx';
import '@fontsource/league-spartan/400.css'; // Import the regular weight (400)
import "@fontsource/libre-baskerville"; // Defaults to weight 400
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider } from './AuthContext.js';

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <MoneyWhispersNavbar />
      </AuthProvider>
    );
  }
}

export default App;