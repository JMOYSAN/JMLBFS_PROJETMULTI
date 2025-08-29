import {useEffect, useState} from 'react';
import Chat from './Messages/BarreChat';
import FilsConversation from './Messages/FilsConversation';
import Login from './Users/Login';
import Sidebar from "./Components/Sidebar.jsx";

function App() {
    const [messages, setMessages] = useState([]);

    const [utilisateurs, setUtilisateurs] = useState([]);

    const gererNouveauMessage = (nouveauMesssage) => {
        setMessages(prev => [...prev, {'message': nouveauMesssage, 'username':JSON.parse(localStorage.getItem('user')).username, 'timestamp': new Date().toLocaleTimeString()}]);
    };

    const gererNouveauUtilisateur = (nouveauUtilisateur) => {
        setUtilisateurs(nouveauUtilisateur);
        setIsConnect(true);
        localStorage.setItem("user", JSON.stringify(nouveauUtilisateur));
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsConnect(false);
    };

    const [isConnect, setIsConnect] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUtilisateurs(JSON.parse(storedUser).username);
            setIsConnect(true);
        }
    }, []);

    return (
        <>
            {
                isConnect ? (
                    <>
                        <FilsConversation messages={messages}/>
                        <Chat onSend={gererNouveauMessage}/>
                        <Sidebar onLogout={handleLogout} />
                    </>
                ) : <Login onLogin={gererNouveauUtilisateur} />
            }
        </>
    );
}

export default App;
