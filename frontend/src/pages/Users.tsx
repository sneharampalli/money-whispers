import React from 'react';
import RegisterUser from '../components/RegisterUser.tsx';
import Login from './Login.tsx';

// Page to show the users.
const Users = () => { 
    return (
        <div className='postsPage'>
            <Login />
            <RegisterUser />
        </div>
    );
}

export default Users;