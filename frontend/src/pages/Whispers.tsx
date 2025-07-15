import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Button, Card, FormControl, FormLabel, Modal, Select, Typography, MenuItem, CardContent, TextField, Link, IconButton } from '@mui/material';
import { WhisperContext, Thread } from './WhisperContext.tsx';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { useNavigate } from 'react-router-dom';
import About from './About.tsx';

type Whisper = {
    title: string;
    message: string;
    thread_id: string;
    // only on return object
    thread_title?: string;
    author?: string;
    uuid?: string;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#EDEDED',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

const CreateWhisper = () => {
    const context = useContext(WhisperContext);
    const [whisperFormData, setWhisperFormData] = useState<Whisper>({
        message: '',
        title: '',
        thread_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successThread, setSuccessThread] = useState<boolean>(false);
    const [successWhisper, setSuccessWhisper] = useState<boolean>(false);
    const [whispers, setWhispers] = useState<Whisper[]>([]);
    const backendURL = 'http://127.0.0.1:5000/api';
    const navigate = useNavigate();

    console.log(successWhisper);
    console.log(successThread);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showAbout, setShowAbout] = useState(false);

    const handleShowAbout = (show: boolean) => setShowAbout(show);

    const fetchMessages = useCallback(async () => {
        try {
            const response = await fetch(`${backendURL}/whispers`, {credentials: 'include'});
            if (response.status === 401) {
                // Session expired or invalid
                navigate('/login');
                return;
            }
            if (!response.ok) {
                throw new Error(`Failed to fetch whispers: ${response.status}`);
            }
            const responseData = await response.json();
            setWhispers(responseData);
        } catch (error: any) {
            console.error('Error fetching whispers:', error);
            if (error.message.includes('401')) {
                navigate('/login');
                return;
            }
            setError(error.message || 'Failed to fetch whispers');
        }
    }, [navigate, backendURL]);

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        setWhisperFormData(prev => ({ ...prev }));
    }, []);

    useEffect(() => {
        setThreadData(prev => ({ ...prev }));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setWhisperFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateThreadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setThreadData(prev => ({ ...prev, [name]: value }));
    };


    const handleThreadChange = (event: React.ChangeEvent<{ value: unknown }>, child: React.ReactNode) => {
        setWhisperFormData(prev => ({...prev, thread_id: event.target.value as string}));
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

            // const result = await response.json();
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

    const handleCreateWhisper = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(false);
        setError(null);
        setSuccessWhisper(false);  

        if (whisperFormData.message.trim().length === 0) {
            setError('Message is required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendURL}/create-whisper`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(whisperFormData),
                credentials: 'include'
            });

            if (!response.ok) {
                let errorMessage = 'Failed to create whisper.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setSuccessWhisper(true);
            setWhisperFormData({ message: '', thread_id: '', title: '' });
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
        <div className="whispersPage" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
                <Button variant="text" color="secondary" onClick={() => handleShowAbout(true)}>
                    <InfoOutlineIcon color="secondary" style={{ marginRight: '10px' }}/>
                    wtf is money whispers?
                </Button>
                <About open={showAbout} handleOpen={handleShowAbout} />
                <div style={{ display: 'flex', justifyContent: 'end'}}>
                    <Button variant="outlined" color="secondary" style={{ marginRight: '10px' }} onClick={handleShow}>
                        <IconButton color="secondary">
                            <AddIcon />
                        </IconButton>
                        New whisper
                    </Button>
                    <Button variant="outlined" color="secondary" style={{ marginRight: '10px' }} onClick={handleShowThread}>
                        <IconButton color="secondary">
                            <AddIcon />
                        </IconButton>
                        New thread
                    </Button>
                </div>
            </div>

        <Modal open={showThread} onClose={handleCloseThread}>
            <Box sx={style}>
                <Typography variant="h6">Create a thread</Typography>
                <FormControl onSubmit={createThread} style={{ width: '100%' }}>
                    <FormLabel htmlFor="titleThread">Title</FormLabel>
                    <TextField
                        id="title"
                        name="title"
                        value={threadData.title}
                        onChange={handleCreateThreadChange}
                        placeholder="Enter your title"
                        className="mt-1"
                        rows={4}
                        style={{marginBottom: '10px'}}
                    />
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <TextField
                        id="description"
                        name="description"
                        value={threadData.description}
                        onChange={handleCreateThreadChange}
                        placeholder="Enter your description"
                        className="mt-1"
                        rows={4}
                        disabled={loading}
                    />
                    <br/>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button variant="outlined" color="primary" style={{ marginRight: '10px' }} onClick={handleCloseThread}>
                        Close
                    </Button>
                    <Button variant="contained" type="submit" disabled={loading} onClick={createThread}>
                        {loading ? 'Creating...' : 'Create Thread'}
                    </Button>
                    </div>
                </FormControl>
            </Box>
        </Modal>

        <Modal open={show} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6">Create a whisper</Typography>
                <FormControl onSubmit={handleCreateWhisper} style={{ width: '100%' }}>
                <FormLabel htmlFor="thread-selection">Select a thread for the whisper.</FormLabel>
                    <Select
                        labelId="thread-selection"
                        id="thread-selection"
                        name="thread-selection"
                        value={whisperFormData.thread_id}
                        onChange={handleThreadChange}
                        label="Select a thread"   
                    >
                        {context && context.threads.map((thread: Thread) => (
                            <MenuItem key={thread.thread_id} value={thread.thread_id}>{thread.title}</MenuItem>
                        ))}
                    </Select>
                    <br/>
                    <FormLabel htmlFor="title">Title</FormLabel>
                    <TextField
                        id="title"
                        name="title"
                        value={whisperFormData.title}
                        onChange={handleChange}
                        placeholder="Enter your title"
                        className="mt-1"
                        rows={4}
                        disabled={loading}
                        style={{marginBottom: '10px'}}
                    />
                    <FormLabel htmlFor="message">Message</FormLabel>
                    <TextField
                        id="message"
                        name="message"
                        value={whisperFormData.message}
                        onChange={handleChange}
                        placeholder="Enter your message"
                        className="mt-1"
                        rows={4}
                        disabled={loading}
                        style={{marginBottom: '10px'}}
                    />
                    <br/>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button variant="outlined" color="primary" style={{ marginRight: '10px' }} onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="contained" type="submit" disabled={loading} onClick={handleCreateWhisper}>
                            {loading ? 'Creating...' : 'Create Whisper'}
                        </Button>   
                    </div>
                </FormControl>
            </Box>
        </Modal>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
            {whispers.length === 0 && (
                <Box sx={{  
                    flex: 1,
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                }}>   
                    <Typography variant="h2" style={{ textAlign: 'center', color: '#EDEDED', marginBottom: '16px' }}>No whispers found... yet.</Typography>
                    <Typography variant="h6" style={{ textAlign: 'center', color: '#EDEDED' }}>Add your first whisper!</Typography>
                </Box>
            )}
            {whispers && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', width: '100%' }}>
                    {whispers.map((item) => (
                        <>
                        <Card variant="outlined" style={{ width: '100%', borderRadius: '10px' }}>
                            <React.Fragment>
                                <CardContent>
                                <Typography gutterBottom sx={{ color: '#F56D95', fontSize: 14 }}>
                                    {item.thread_title}
                                </Typography>
                                <Typography style={{ fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' }} component="div">
                                    {item.title}
                                </Typography>
                                <Typography style={{ fontSize: 20 }} component="div">
                                    {item.message}
                                </Typography>
                                <Typography style={{ fontSize: 16 }} component="div">
                                    author: {item.author}
                                </Typography>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}> 
                                    <Link href={`/whisper/${item.uuid}`}>
                                        <ChatBubbleOutlineIcon
                                            sx={{ color: 'text.secondary', fontSize: 18 }}
                                        />
                                    </Link>
                                    {/* <div style={{ marginLeft: '10px' }}>
                                        <FavoriteBorderIcon
                                            sx={{ color: 'text.secondary', fontSize: 18 }}
                                            onClick={() => handleLike(item.uuid)}
                                        />
                                </div> */}
                                </div>
                                </CardContent>
                            </React.Fragment>
                        </Card>
                        <br/>
                        </>
                    ))}
                </div>
            )}
        </div>
        </div>
    );
};

export default CreateWhisper;
