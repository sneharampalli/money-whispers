import React from 'react';
import Posts from './Posts.tsx';

// Page to show the anonymous money posts and create a new post.
const AnonPosts = () => { 
    return (
        <div className='postsPage'>
            <Posts/>
        </div>
    );
}

export default AnonPosts;