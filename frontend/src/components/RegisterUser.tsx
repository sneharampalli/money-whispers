import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';

type User = {
    username: string;
    email?: string;
    password: string;
}

const RegisterUser = () => { 
    const backendURL = 'http://127.0.0.1:5000/api';
    const [userData, setUserData] = useState<User>({
        username: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        setUserData(prev => ({ ...prev }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
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
                body: JSON.stringify(userData),
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
            setUserData({ 
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
        <div className='postsPage'>
            
            <Button variant="primary" onClick={handleShow}>
                Create a new user
            </Button>
            
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Create a new user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} className="space-y-4">
                        <Form.Group>
                            <Form.Label htmlFor="username" className="block text-sm font-medium">Username</Form.Label>
                            <Form.Control
                                id="username"
                                name="username"
                                value={userData.username}
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
                                value={userData.password}
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
                                value={userData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="mt-1"
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
                    {loading ? 'Creating...' : 'Create User'}
                </Button>
                </Modal.Footer>
            </Modal>
            {users && (
                <div>
                    <h2>Users</h2>
                    <ul>
                        {users.map((item: User) => (
                            <>
                            <Card>
                                <Card.Body>
                                <Card.Text>
                                    {item.username}
                                </Card.Text>
                                </Card.Body>
                            </Card>
                            <br/>
                            </>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default RegisterUser;