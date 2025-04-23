import React, { useEffect, useState } from 'react';
import {Button, Form, Card, Modal} from 'react-bootstrap';

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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPostData(prev => ({ ...prev, [name]: value }));
    };


    useEffect(() => {
        setPostData(prev => ({ ...prev }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
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
            <Button variant="primary" onClick={handleShow}>
                Login
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} className="space-y-4">
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button type="submit" disabled={loading} onClick={handleSubmit}>
                    {loading ? 'Creating...' : 'Login'}
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Login;