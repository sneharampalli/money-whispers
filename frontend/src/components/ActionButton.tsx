// frontend/src/pages/HomePage.js
import React, {Component} from 'react';

class ActionButton extends Component {

    handleClick = () => {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render() {
        return (<button type="button" onClick={this.handleClick}>{this.props.buttonText}</button>);
    }
}

export default ActionButton;