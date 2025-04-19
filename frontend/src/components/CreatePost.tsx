import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

type Post = {
    uuid?: string;
    message: string;
}

const CreatePost = () => {
    const [postData, setPostData] = useState<Post>({
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [messages, setMessages] = useState<Post[]>([]); // Corrected: Initialize as an empty array
    const backendURL = 'http://127.0.0.1:5000';

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const fetchMessages = async () => { // Extracted fetch logic into its own function
        try {
            const response = await fetch(`${backendURL}/posts`);
            if (!response.ok) {
                throw new Error(`Failed to fetch messages: ${response.status}`);
            }
            const responseData = await response.json();
            setMessages(responseData);
        } catch (error: any) {
            console.error('Error fetching messages:', error);
            setError(error.message || 'Failed to fetch messages'); // Set error state
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        setPostData(prev => ({ ...prev }));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPostData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (postData.message.trim().length === 0) {
            setError('Message is required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendURL}/create-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to create post.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Post created:', result);
            setSuccess(true);
            setPostData({ message: '' });
            await fetchMessages(); // Await the refresh
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            // loading
            setLoading(false);
            // close modal
            setShow(false);
        }
    };

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" onClick={handleShow}>
                    Create a new post
                </Button>
            </div>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Create a new post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} className="space-y-4">
                    <Form.Group>
                        <Form.Label htmlFor="message" className="block text-sm font-medium">Message</Form.Label>
                        <br/>
                        <Form.Control
                            as="textarea"
                            id="message"
                            name="message"
                            value={postData.message}
                            onChange={handleChange}
                            placeholder="Enter your message"
                            className="mt-1"
                            rows={4}
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
                {loading ? 'Creating...' : 'Create Post'}
            </Button>
            </Modal.Footer>
        </Modal>
            {messages && (
                <div>
                    <h2>Anonymous Money Posts:</h2>
                    <ul>
                        {messages.map((item: Post) => (
                            <>
                            <Card>
                                <Card.Body>
                                <Card.Text>
                                    {item.message}
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
};

export default CreatePost;
