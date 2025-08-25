import { useState } from 'react';

function Chat({ onSend }) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim() === '') return;

        onSend(message);
        setMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div id="chat-bar">
            <input
                type="text"
                id="chat-input"
                placeholder="Tapez un message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button id="send-btn" onClick={handleSend}>
                Send
            </button>
        </div>
    );
}

export default Chat;
