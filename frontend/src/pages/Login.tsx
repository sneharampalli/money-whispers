import React, { useEffect, useState } from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

type User = {
    username: string;
    email?: string;
    password: string;
}

// Page to show the users.
const Login = () => { 
    const backendURL = 'http://127.0.0.1:5000/api';

    const [postData, setPostData] = useState<User>({
        username: '',
        password: '',
    });

    const { login } = useAuth();

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
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setSuccess(true);
            setPostData({ 
                username: '',
                password: '',
             });
             login(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            // loading
            setLoading(false);
            // close modal
            setShow(false);
        }
    };

    const [logoutError, setLogoutError] = useState<string | null>(null);

    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendURL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                let logoutErrorMessage = 'Failed to logout.';
                try {
                    const logoutErrorData = await response.json();
                    logoutErrorMessage = logoutErrorData.error || logoutErrorMessage;
                } catch (parseError) {
                }
                throw new Error(logoutErrorMessage);
            }

            const result = await response.json();
        } catch (err: any) {
            setLogoutError(err.message || 'An unexpected error occurred.');
        } finally {
            console.log("logged out")
        }
    }

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
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setSuccess(true);
            setPostData({ 
                username: '',
                password: '',
            });
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
            <div className="loginButton">
                <Button variant="primary" className="loginButton" onClick={handleLoginShow}>
                    Login
                </Button>
                <Button variant="outline-primary" className="loginButton" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{showLoginForm ? 'Login' : 'Create account'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showLoginForm && <Form onSubmit={handleLoginSubmit} className="space-y-4">
                        <Form.Group>
                            <Form.Label htmlFor="username" className="block text-sm font-medium">Username</Form.Label>
                            <Form.Control
                                id="username"
                                name="username"
                                value={postData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                className="mt-1"
                                required
                                disabled={loading}
                            />
                            <Form.Label htmlFor="password" className="block text-sm font-medium">Password</Form.Label>
                            <Form.Control
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
                        </Form.Group>
                        <br/>
                        <Form.Text>Don't have an account. Create one <Button onClick={() => setShowLoginForm(false)}>here</Button>.</Form.Text>
                    </Form>}
                    {!showLoginForm && 
                        <Form onSubmit={handleCreateUserSubmit} className="space-y-4">
                            <Form.Group>
                                <Form.Label htmlFor="username" className="block text-sm font-medium">Username</Form.Label>
                                <Form.Control
                                    id="username"
                                    name="username"
                                    value={postData.username}
                                    onChange={handleChange}
                                    placeholder="Enter your username"
                                    className="mt-1"
                                    required
                                    disabled={loading}
                                />
                                <Form.Label htmlFor="password" className="block text-sm font-medium">Password</Form.Label>
                                <Form.Control
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
                                <Form.Label htmlFor="email" className="block text-sm font-medium">Email</Form.Label>
                                <Form.Control
                                    id="email"
                                    name="email"
                                    value={postData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="mt-1"
                                    disabled={loading}
                                />
                            </Form.Group>
                            <br/>
                            <Form.Text>Have an account? Login <Button onClick={() => setShowLoginForm(true)}>here</Button>.</Form.Text>
                        </Form>
                    }
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button type="submit" disabled={loading} onClick={showLoginForm ? handleLoginSubmit : handleCreateUserSubmit}>
                    {loading ? 'Creating...' : 'Login'}
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Login;