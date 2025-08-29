import {useState} from 'react';
import Chat from './Messages/BarreChat';
import FilsConversation from './Messages/FilsConversation';
import Login from './Users/Login';

function App() {
    const [messages, setMessages] = useState([]);

    const [utilisateurs, setUtilisateurs] = useState([]);

    const gererNouveauMessage = (nouveauMesssage) => {
        setMessages(prev => [...prev, nouveauMesssage]);
    };

    const gererNouveauUtilisateur = (nouveauUtilisateur) => {
        setUtilisateurs(prev => [...prev, nouveauUtilisateur]);
    };

    return (
        <>
            <FilsConversation messages={messages} />
            <Chat onSend={gererNouveauMessage} />
        </>
    );
}

export default App;
