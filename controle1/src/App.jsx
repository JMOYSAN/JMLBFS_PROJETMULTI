import {useEffect, useState} from 'react';
import Chat from './Messages/BarreChat';
import FilsConversation from './Messages/FilsConversation';
import Login from './Users/Login';
import Sidebar from "./Components/Sidebar.jsx";
import FormCreerGroupe from "./Form/FormCreerGroupe.jsx";

function App() {
    const [messages, setMessages] = useState([]);

    const [utilisateurs, setUtilisateurs] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    const [groupes, setGroupes] = useState([]);
    const [currentGroupe, setCurrentGroupe] = useState();
    const gererNouveauMessage = (nouveauMesssage) => {
        if (currentGroupe){
            setMessages(prev => [...prev, {'message': nouveauMesssage,'username': currentUser,
                'timestamp': new Date().toLocaleTimeString(), 'groupe': currentGroupe}]);

        }
    };
    console.log("messages:", JSON.stringify(messages, null, 2));
    console.log("currentGroupe:", JSON.stringify(currentGroupe, null, 2));
    console.log("currentUser:", JSON.stringify(currentUser, null, 2));
    const gererNouveauUtilisateur = (nouveauUtilisateur) => {
        if (!utilisateurs.some(u => u === nouveauUtilisateur)){
            setUtilisateurs(prev =>[...prev, nouveauUtilisateur]);

        }
        console.log("nouveauUser:", JSON.stringify(nouveauUtilisateur, null, 2));
        setCurrentUser(nouveauUtilisateur);
        setIsConnect(true);
        localStorage.setItem("user", JSON.stringify(nouveauUtilisateur));
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsConnect(false);
    };
    const [showForm, setShowForm] = useState(false);
    const showFormCreerGroupe = () => {
        setShowForm(true);
    }

    const creerNouveauGroupe = (nomGroupe, participantsAjoutes) => {
        const groupe = {
            nom: nomGroupe,
            participants: [...participantsAjoutes, currentUser]
        };
        setGroupes(prev=> [...prev,groupe]);
        setShowForm(false);
    }

    const [isConnect, setIsConnect] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
            setIsConnect(true);
        }
    }, []);
    console.log(groupes);
    return (
        <>
            {
                isConnect ? (
                    <>
                        <div id='chat-container'>
                            <Sidebar onLogout={handleLogout} showFormCreerGroupe={showFormCreerGroupe} showForm={showForm}
                                     utilisateurs={utilisateurs} onCLose={creerNouveauGroupe} setCurrentGroupe={setCurrentGroupe}
                                     groupes={groupes} currentUser={currentUser}/>
                            <FilsConversation messages={messages} currentUser={currentUser} currentGroupe={currentGroupe}/>
                        </div>
                        <Chat onSend={gererNouveauMessage}/>

                    </>
                ) : <Login onLogin={gererNouveauUtilisateur} />
            }
        </>
    );
}

export default App;
