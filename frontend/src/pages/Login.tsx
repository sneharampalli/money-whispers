import React, { useEffect, useState } from 'react';
import { Form, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Box, Button, FormControl, FormLabel, IconButton, Input, InputLabel, TextField, Typography } from '@mui/material';
import { Modal } from '@mui/material';
import Secondary_Logo from '../assets/Secondary_Black.svg';
type User = {
    username: string;
    email?: string;
    password: string;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

// Page to show the users.
const Login = () => { 
    const backendURL = 'http://127.0.0.1:5000/api';

    const [postData, setPostData] = useState<User>({
        username: '',
        password: '',
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [show, setShow] = useState(false);

    const [showLoginForm, setShowLoginForm] = useState<boolean>(true);
    const handleClose = () => setShow(false);
    const handleLoginShow = () => setShow(true);
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPostData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        setPostData(prev => ({ ...prev }));
    }, []);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${backendURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
                credentials: 'include',
            });

            if (!response.ok) {
                let errorMessage = 'Failed to login.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
                }
                setError(errorMessage);
                return;
            }

            const result = await response.json();
            setSuccess(true);
            setPostData({ 
                username: '',
                password: '',
             });
             // Set authentication state and redirect to root path
            login(result);
            navigate('/', { replace: true });
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            // loading
            setLoading(false);
            // close modal
            setShow(false);
        }
    };

    const handleCreateUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${backendURL}/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to create user.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
                }
                setError(errorMessage);
                return;
            }

            const result = await response.json();
            setSuccess(true);
            setPostData({ 
                username: '',
                password: '',
            });
            login(result);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            // loading
            setLoading(false);
            // close modal
            setShow(false);
        }
    };

    return (
        <>
        <div className='homePage'>
            {/* <IconButton 
                size="large"
                edge="start"
                color="inherit"
                aria-label="logo"
            > */}
                <img 
                src={Secondary_Logo} 
                alt="Logo" 
                style={{ 
                    height: '100px', // adjust size as needed
                    width: 'auto'
                }} 
                />
            {/* </IconButton> */}
            <h1 style={{ fontFamily: 'Libre Baskerville' }}>anonymous, raw, and <span style={{fontFamily: 'Playfair Display'}}>real</span> money stories.</h1>
            <div className="loginButton">
            <Button variant="contained" color="primary" onClick={handleLoginShow}>
                Login
            </Button>
            <Modal open={show} onClose={handleClose}>
                <Box sx={style}>
                <Typography variant="h6">{showLoginForm ? 'Login' : 'Create account'}</Typography>
                {showLoginForm && <FormControl fullWidth>
                    <FormLabel>Username</FormLabel>
                    <TextField
                        id="username"
                        name="username"
                        value={postData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className="mt-1"
                        required
                        disabled={loading}
                    />
                    <br/>
                    <FormLabel>Password</FormLabel>
                    <TextField
                        id="password"
                        name="password"
                        value={postData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="mt-1"
                        required
                        type='password'
                        disabled={loading}
                    />
                    <Typography>Don't have an account. Create one <Button variant='text' onClick={() => setShowLoginForm(false)}>here</Button>.</Typography>
                    <Button variant="contained" color="primary" onClick={handleLoginSubmit}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                    {error && <Typography color="error">{error}</Typography>}
                </FormControl>}
                {!showLoginForm && 
                    <FormControl fullWidth>
                        <FormLabel>Username</FormLabel>
                        <TextField
                            id="username"
                            name="username"
                            value={postData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            className="mt-1"
                            required
                            disabled={loading}
                        />
                        <FormLabel>Password</FormLabel>
                        <TextField
                            id="password"
                            name="password"
                            value={postData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="mt-1"
                            required
                            type='password'
                            disabled={loading}
                        />
                        <FormLabel>Email</FormLabel>
                        <TextField
                           id="email"
                           name="email"
                           value={postData.email}
                           onChange={handleChange}
                           placeholder="Enter your email"
                           className="mt-1"
                           disabled={loading}
                        /> 
                        <Typography>Have an account? Login <Button onClick={() => setShowLoginForm(true)}>here</Button>.</Typography>
                        <Button variant="contained" color="primary" onClick={handleCreateUserSubmit}>
                            {loading ? 'Creating...' : 'Create account'}
                        </Button>
                        {error && <Typography color="error">{error}</Typography>}
                    </FormControl>
                    }
                {/* <Button type="submit" disabled={loading} onClick={showLoginForm ? handleLoginSubmit : handleCreateUserSubmit}>
                    {loading ? 'Creating...' : 'Login'}
                </Button> */}
                </Box>
            </Modal>
            </div>
        </div>
        </>
    );
}

export default Login;