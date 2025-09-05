import React from 'react';
import styled from 'styled-components';


const StyledWrapper = styled.div`
    .typing-indicator {
        display: flex;
        align-items: center;
        width: 50px;
        height: 20px;
        position: relative;
        z-index: 4;
    }

    .typing-circle {
        width: 6px;
        height: 6px;
        position: absolute;
        border-radius: 50%;
        background-color: #000;
        left: 15%;
        animation: bounceY 0.9s ease-in-out infinite;
    }

    .typing-circle:nth-child(2) {
        left: 45%;
        animation-delay: 0.15s;
    }

    .typing-circle:nth-child(3) {
        right: 15%;
        left: auto;
        animation-delay: 0.3s;
    }

    @keyframes bounceY {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-6px);
        }
    }

    .typing-shadow {
        width: 4px;
        height: 3px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.15);
        position: absolute;
        top: 18px;
        left: 15%;
        filter: blur(1px);
        z-index: 3;
        animation: shadowScale 0.9s ease-in-out infinite;
    }

    .typing-shadow:nth-child(4) {
        left: 45%;
        animation-delay: 0.15s;
    }

    .typing-shadow:nth-child(5) {
        right: 15%;
        left: auto;
        animation-delay: 0.3s;
    }

    @keyframes shadowScale {
        0%, 100% {
            transform: scaleX(1.2);
            opacity: 0.3;
        }
        50% {
            transform: scaleX(1);
            opacity: 0.15;
        }
    }
`;



const Loader = () => {
    return (
        <StyledWrapper>
            <div className="typing-indicator">
                <div className="typing-circle" />
                <div className="typing-circle" />
                <div className="typing-circle" />
                <div className="typing-shadow" />
                <div className="typing-shadow" />
                <div className="typing-shadow" />
            </div>
        </StyledWrapper>
    );
}

export default Loader;
