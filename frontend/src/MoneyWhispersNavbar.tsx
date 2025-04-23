import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import MoneyVibeCheckTest from './pages/MoneyVibeCheckTest.tsx';
import AnonPosts from './pages/AnonPosts.tsx';
import {Container, Nav, Navbar} from 'react-bootstrap'
import Login from './pages/Login.tsx';

const MoneyWhispersNavbar = () => {
  return (
    <Router>
        <Navbar sticky='top' expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand className="navbar-brand" href="/">Money Whispers</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/money-vibe-check-test">Money Vibe Check Test</Nav.Link>
            <Nav.Link as={Link} to="/posts">Anonymous Money Posts</Nav.Link>
          </Nav>
          <Nav className="justify-content-end">
            <Nav.Link as={Login}></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/money-vibe-check-test" element={<MoneyVibeCheckTest />} />
        <Route path="/posts" element={<AnonPosts />} />
    </Routes>
    </Router>
);
};

export default MoneyWhispersNavbar;