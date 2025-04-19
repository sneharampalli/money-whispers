import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const BUTTON_TEXT: string = "begin here";

declare global {
    interface Tally {
      loadEmbeds: () => void;
      // Add other Tally methods and properties if you use them
    }
    var Tally: Tally;
}

const HomePage = () => { // Changed to a functional component
    return (
        <div className='homePage'>
            <div className="container">
                <h1 className="homePageHeader">Learn your money language.</h1>
                <Link to="/money-vibe-check-test">
                    <Button variant="primary">{BUTTON_TEXT}</Button>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;