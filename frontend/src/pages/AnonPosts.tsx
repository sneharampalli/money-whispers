import React from 'react';
import Posts from './Posts.tsx';
import PostProvider from './PostProvider.tsx';

// Page to show the anonymous money posts and create a new post.
const AnonPosts = () => { 
    return (
        <div className='postsPage'>
            <PostProvider>
                <Posts/>
            </PostProvider>
        </div>
    );
}

export default AnonPosts;