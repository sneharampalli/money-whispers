import React, { Component, useEffect } from 'react';
import ActionButton from '../components/ActionButton.tsx';

const BUTTON_TEXT: string = "begin here";

class HomePage extends Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    script.onload = () => {
      if (typeof Tally !== 'undefined') {
        Tally.loadEmbeds();
      }
    };
    script.onerror = () => {
      console.error("Failed to load Tally embed script.");
    };

    document.body.appendChild(script);

    // Clean up the script when the component unmounts (optional but good practice)
    return () => {
      document.body.removeChild(script);
    };
  }

  render() {
    return (
      <div className='moneyVibeCheckTest'>
        <iframe
          data-tally-src="https://tally.so/embed/w2DWG9?dynamicHeight=1"
          loading="lazy"
          width="100%"
          height="481"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="Money Vibe Check Test"
        ></iframe>
      </div>
    );
  }
}

export default HomePage;