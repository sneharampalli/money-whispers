import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Fix this import
import { Card, CardContent, Typography, Button, Box, FormControl, TextField, Paper, Avatar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Post = () => {
    const { whisperId } = useParams<{ whisperId: string }>();
    const [whisper, setPost] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const backendURL = 'http://127.0.0.1:5000/api';
    const [comment, setComment] = useState('');
    const navigate = useNavigate();

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (comment.length === 0) {
            setError('Comment cannot be empty');
            return;
        }
        const response = await fetch(`${backendURL}/whispers/${whisperId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({ message: comment }),
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Failed to create comment: ${response.status}`);
        }
        setComment('');
        fetchPost();
    };

    const fetchPost = useCallback(async () => {
        setLoading(true);  // Add loading state
        try {
            console.log('Fetching whisper:', whisperId);  // Debug log
            const response = await fetch(`${backendURL}/whispers/${whisperId}`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch whispers: ${response.status}`);
            }
            const data = await response.json();
            setPost(data);
        } catch (error: any) {
            console.error('Error fetching whispers:', error);
            setError(error.message || 'Failed to fetch whispers');
        } finally {
            setLoading(false);  // Reset loading state
        }
    }, [whisperId]);
    

    // const fetchPost = async () => {
    //     setLoading(true);  // Add loading state
    //     try {
    //         console.log('Fetching whisper:', whisperId);  // Debug log
    //         const response = await fetch(`${backendURL}/whispers/${whisperId}`, {
    //             credentials: 'include'
    //         });
    //         if (!response.ok) {
    //             throw new Error(`Failed to fetch whispers: ${response.status}`);
    //         }
    //         const data = await response.json();
    //         setPost(data);
    //     } catch (error: any) {
    //         console.error('Error fetching whispers:', error);
    //         setError(error.message || 'Failed to fetch whispers');
    //     } finally {
    //         setLoading(false);  // Reset loading state
    //     }
    // };

    useEffect(() => {
        if (whisperId) {
            fetchPost();
        }
    }, [whisperId, fetchPost]);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <Typography>Loading whisper...</Typography>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <Typography color="error">Error: {error}</Typography>
            </div>
        );
    }

    if (!whisper) {
        return (
            <div className="container mx-auto p-4">
                <Typography>Post not found</Typography>
            </div>
        );
    }

    return (
        <div className="singleWhisperPage">
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1, width: '75%', height: '100%', padding: '20px 10px', margin: '0 auto' }}>
                <Card variant="outlined" style={{ width: '100%', borderRadius: '10px', minHeight: '100%', overflowY: 'auto', padding: '20px' }}>
                    <IconButton onClick={() => navigate('/')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <CardContent>
                        <Typography variant="h3" component="h3" gutterBottom style={{ textTransform: 'uppercase' }}>
                            {whisper.title}
                        </Typography>
                        <Typography variant="h5" color="text.primary">
                            {whisper.message}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            author: {whisper.author}
                        </Typography>
                        <FormControl fullWidth>
                            <TextField
                                id="comment"
                                label="Share your thoughts"
                                multiline
                                style={{ width: '100%', fontSize: '12px', marginBottom: '10px' }}
                                rows={2}
                                value={comment}
                                onChange={handleCommentChange}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>Submit</Button>
                                </div>
                            </FormControl>
                    </CardContent>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {whisper.comments.length > 0 ? (
                        whisper.comments.map((comment: any) => (
                            <Paper elevation={0} key={comment.uuid} style={{ width: '100%', padding: '20px', borderRadius: '10px' }}> 
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                        <Avatar sx={{ width: 48, height: 48, marginRight: '10px' }}>
                                            {comment.author.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                {comment.author}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {comment.created_at}
                                            </Typography>   
                                            <Typography variant="body1" color="text.primary">
                                                {comment.message}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </Paper>
                    ))
                    ) : (
                        <div style={{marginLeft: '20px', marginBottom: '20px'}}>
                            <Typography variant="body1" color="text.secondary">
                                No comments yet!
                            </Typography>
                        </div>
                    )}
                </Box>
                </Card>
            </Box>
        </div>
    );
};

export default Post;