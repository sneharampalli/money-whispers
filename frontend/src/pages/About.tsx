import React from 'react';
import { Typography, Box, Link, Modal, Button } from '@mui/material';

interface AboutProps {
    open: boolean;
    handleOpen: (show: boolean) => void;
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxHeight: '90vh',
    bgcolor: 'white',
    boxShadow: 24,
    borderRadius: '10px',
    p: 4,
    overflow: 'auto'
};

const About: React.FC<AboutProps> = ({ open, handleOpen }) => {
    return (
        <Modal 
            open={open} 
            onClose={() => handleOpen(false)}
            aria-labelledby="about-modal-title"
        >
            <Box sx={modalStyle}>
                <Typography variant="h1" component="h1" gutterBottom style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Anonymous, raw, and <span style={{ color: '#E52A1C' }}>real</span> money stories.
                </Typography>
                <Typography variant="h5" component="h5" gutterBottom>
                    Money whispers is a platform to share your deepest, darkest, and unfiltered thoughts about money.
                    And guess what? You're anonymous. So you can say, ask, or holler whatever the f**k you want.
                </Typography>
                <Typography variant="h5" component="h5" gutterBottom>
                    Whether it's the $4k you just dropped on your bestie's bachelorette trip, recent dating stories about who pays the bill, or investing questions you feel too dumb to ask in front of your friends, we're here to listen.
                </Typography>
                <Typography variant="h5" component="h5" gutterBottom>
                    A whisper is a single thought you have about money, whether it's a midnight shower thought or a fully fleshed out story. A thread is a group of whispers that share a common theme.
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>  
                    <Button variant="contained" color="primary" onClick={() => handleOpen(false)}>
                        let's get started
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default About;