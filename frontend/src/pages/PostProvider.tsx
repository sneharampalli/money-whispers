import React, { useEffect, useState } from 'react';
import { Thread, PostContextProps, PostContext } from './PostContext.tsx';

const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const backendURL = 'http://127.0.0.1:5000/api';
    const [threadData, setThreadData] = useState<Thread[]>([]);
    const [error, setError] = useState(null);

    const fetchThreads = async () => { // Extracted fetch logic into its own function
        try {
            const response = await fetch(`${backendURL}/threads`, {credentials: 'include'});
            if (!response.ok) {
                throw new Error(`Failed to fetch messages: ${response.status}`);
            }
            const responseData = await response.json();
            setThreadData(responseData);
        } catch (error: any) {
            console.error('Error fetching messages:', error);
            setError(error.message || 'Failed to fetch messages'); // Set error state
        }
    };

    useEffect(() => {
        fetchThreads();
    }, []); // Empty dependency array means this effect runs only once after the initial render


    const contextValue: PostContextProps = {
        threads: threadData, 
        fetchThreads: fetchThreads
    };

    return (
        <PostContext.Provider value={contextValue}>
        {children}
        </PostContext.Provider>
    );
};

export default PostProvider;