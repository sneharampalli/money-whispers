import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { PostContext, Thread } from './PostContext.tsx';

type Post = {
    title: string;
    message: string;
    thread_id: string;
    // only on return object
    thread_title?: string;
    author?: string;
}

const CreatePost = () => {
    const context = useContext(PostContext);
    const [postFormData, setPostFormData] = useState<Post>({
        message: '',
        title: '',
        thread_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successThread, setSuccessThread] = useState<boolean>(false);
    const [successPost, setSuccessPost] = useState<boolean>(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const backendURL = 'http://127.0.0.1:5000/api';

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchMessages = async () => { // Extracted fetch logic into its own function
        try {
            const response = await fetch(`${backendURL}/posts`, {credentials: 'include'});
            if (!response.ok) {
                throw new Error(`Failed to fetch posts: ${response.status}`);
            }
            const responseData = await response.json();
            console.log(responseData);
            setPosts(responseData);
        } catch (error: any) {
            console.error('Error fetching posts:', error);
            setError(error.message || 'Failed to fetch posts'); // Set error state
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        setPostFormData(prev => ({ ...prev }));
    }, []);

    useEffect(() => {
        setThreadData(prev => ({ ...prev }));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPostFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateThreadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setThreadData(prev => ({ ...prev, [name]: value }));
    };


    const handleThreadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostFormData(prev => ({...prev, thread_id: e.target.value}));
        console.log(postFormData)
    };

    const [threadData, setThreadData] = useState<Thread>({
        thread_id: '',
        title: '',
        description: '',
    });
    const [showThread, setShowThread] = useState<boolean>(false);
    const handleCloseThread = () => setShowThread(false);
    const handleShowThread = () => setShowThread(true);

    const createThread = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessThread(false);

        if (threadData.title.trim().length === 0 || threadData.description.trim().length === 0) {
            setError('Title or description is required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendURL}/create-thread`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(threadData),
                credentials: 'include'
            });

            if (!response.ok) {
                let errorMessage = 'Failed to create thread.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setSuccessThread(true);
            setThreadData({ thread_id: '', title: '', description: '' });
            context?.fetchThreads();
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            // loading
            setLoading(false);
            setShowThread(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(false);
        setError(null);
        setSuccessPost(false);        

        if (postFormData.message.trim().length === 0) {
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
                body: JSON.stringify(postFormData),
                credentials: 'include'
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
            setSuccessPost(true);
            setPostFormData({ message: '', thread_id: '', title: '' });
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
            <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" onClick={handleShowThread}>
                    Create a thread
                </Button>
            </div>

        <Modal show={showThread} onHide={handleCloseThread}>
            <Modal.Header closeButton>
            <Modal.Title>Create a thread</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={createThread} className="space-y-4">
                    <Form.Group>
                        <Form.Label htmlFor="title" className="block text-sm font-medium">Title</Form.Label>
                        <br/>
                        <Form.Control
                            as="textarea"
                            id="title"
                            name="title"
                            value={threadData.title}
                            onChange={handleCreateThreadChange}
                            placeholder="Enter your title"
                            className="mt-1"
                            rows={4}
                            disabled={loading}
                        />
                        <Form.Label htmlFor="description" className="block text-sm font-medium">Description</Form.Label>
                        <br/>
                        <Form.Control
                            as="textarea"
                            id="description"
                            name="description"
                            value={threadData.description}
                            onChange={handleCreateThreadChange}
                            placeholder="Enter your description"
                            className="mt-1"
                            rows={4}
                            disabled={loading}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseThread}>
                Close
            </Button>
            <Button type="submit" disabled={loading} onClick={createThread}>
                {loading ? 'Creating...' : 'Create Thread'}
            </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Create a new post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleCreatePost} className="space-y-4">
                    <Form.Group>
                        <Form.Label htmlFor="title" className="block text-sm font-medium">Title</Form.Label>
                        <br/>
                        <Form.Control
                            as="textarea"
                            id="title"
                            name="title"
                            value={postFormData.title}
                            onChange={handleChange}
                            placeholder="Enter your title"
                            className="mt-1"
                            rows={4}
                            disabled={loading}
                        />
                        <br/>
                        <Form.Label htmlFor="message" className="block text-sm font-medium">Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            id="message"
                            name="message"
                            value={postFormData.message}
                            onChange={handleChange}
                            placeholder="Enter your message"
                            className="mt-1"
                            rows={4}
                            disabled={loading}
                        />
                        <br/>
                        <Form.Label htmlFor="thread-selection" className="block text-sm font-medium">Select a thread for the post.</Form.Label>
                        {context && context.threads.map((thread: Thread) => (
                            <div key={thread.thread_id}>
                                <Form.Check
                                    type="radio"
                                    name="threadSelection"
                                    id={`radio-${thread.thread_id}`}
                                    value={thread.thread_id}
                                    onChange={handleThreadChange}
                                    label={thread.title}
                                    checked={postFormData.thread_id === thread.thread_id} // Optional but recommended
                                />
                            </div>
                        ))}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button type="submit" disabled={loading} onClick={handleCreatePost}>
                {loading ? 'Creating...' : 'Create Post'}
            </Button>
            </Modal.Footer>
        </Modal>
            {posts && (
                <div>
                    <h2>Anonymous Money Posts:</h2>
                    <ul>
                        {posts.map((item: Post) => (
                            <>
                            <Card key={item.message}>
                                <Card.Body>
                                <Card.Text>
                                    {item.message} | thread: {item.thread_title} | by: {item.author}
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
