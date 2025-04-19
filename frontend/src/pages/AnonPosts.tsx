import React, { useState, useEffect } from 'react';
import CreatePost from '../components/CreatePost.tsx';

const AnonPosts = () => { 
    return (
        <div className='postsPage'>
            <CreatePost/>
        </div>
    );
}

export default AnonPosts;