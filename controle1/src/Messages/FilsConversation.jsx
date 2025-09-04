import Bulle from './Bulle';
import BulleAutre from "./BulleAutre.jsx";

function FilsConversation({ messages, currentUser, currentGroupe }) {
    const messagesFiltrer = messages.filter(
        (msg) =>
            msg.groupe.nom === currentGroupe.nom &&
            currentGroupe.participants.includes(currentUser)
    );
    return (
        <div id="fil">
            {messagesFiltrer.map((msg) => {
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
