import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

declare global {
    interface Tally {
      loadEmbeds: () => void;
      // Add other Tally methods and properties if you use them
    }
    var Tally: Tally;
}

const HomePage = () => {
    return (
        <div className='homePage'>
            <div className="container">
                <h1 className="homePageHeader">Learn your money language.</h1>
                <Link to="/money-vibe-check-test">
                    <Button variant="primary">Get started here</Button>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;