import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WhisperProvider } from './pages/WhisperContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import CreateWhisper from './pages/Whispers';
import Login from './pages/Login';
import Register from './pages/Register';
import WhisperDetail from './pages/WhisperDetail';
import CommunityGuidelines from './pages/CommunityGuidelines';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WhisperProvider>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<CreateWhisper />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/whisper/:id" element={<WhisperDetail />} />
              <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            </Routes>
          </div>
        </WhisperProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 