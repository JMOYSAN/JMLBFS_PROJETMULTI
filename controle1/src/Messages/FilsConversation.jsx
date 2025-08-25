import Bulle from './Bulle'; // assuming your message component is called Bulle

function FilsConversation({ messages }) {
    return (
        <div id="fil" style={{ backgroundColor: 'black', padding: '10px', color: 'white' }}>
            {messages.map((msg) => (
                <Bulle  message={msg} />
            ))}
        </div>
    );
}

export default FilsConversation;
