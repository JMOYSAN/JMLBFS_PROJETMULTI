import Bulle from './Bulle';
import BulleAutre from "./BulleAutre.jsx";

function FilsConversation({ messages }) {
    return (
        <div
            id="fil"
        >
            {messages.map((msg) => {
                const currentUser = JSON.parse(localStorage.getItem('user')).username;
                const isCurrentUser = msg.username === currentUser;

                return isCurrentUser ? (
                    <Bulle message={msg}/>
                ) : (
                    <BulleAutre message={msg}/>
                );
            })}
        </div>
    );
}


export default FilsConversation;
