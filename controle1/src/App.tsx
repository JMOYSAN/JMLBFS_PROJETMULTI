import { useState } from 'react';
import Chat from './Messages/BarreChat';
import FilsConversation from './Messages/FilsConversation';

function App() {
    const [messages, setMessages] = useState([]);

    const handleNewMessage = (newMsg) => {
        setMessages(prev => [...prev, newMsg]);
    };

    return (
        <>
            <FilsConversation messages={messages} />
            <Chat onSend={handleNewMessage} />
        </>
    );
}

export default App;
