import React, { useEffect, useState } from 'react';
import {Button, Form, Card, Modal} from 'react-bootstrap';

type User = {
    username: string;
    email?: string;
    password: string;
}

// Component to logout.
const Logout = () => { 
    const backendURL = 'http://127.0.0.1:5000/api';

    const [error, setError] = useState<string | null>(null);

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
                let errorMessage = 'Failed to logout.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            console.log("logged out")
        }
    };

    return (
        <Button variant="secondary" onClick={handleLogout}>
            Logout
        </Button>
    );
}

export default Logout;