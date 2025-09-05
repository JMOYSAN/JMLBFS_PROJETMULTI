import Bulle from './Bulle'
import BulleAutre from './BulleAutre.jsx'
import Chat from './BarreChat.jsx'
import Topbar from '../Components/Topbar.jsx'
import Typing from "./Typing";

function FilsConversation({
  messages = [],
  currentUser,
  currentGroupe,
  setCurrentGroupe,
  onSend,
}) {
  const messagesFiltres = messages.filter(
    (message) => message.groupe?.nom === currentGroupe.nom
  )
    const participantsTyping = currentGroupe?.participants?.filter(
        (p) => p.isTyping && p.nom !== currentUser
    ) || [];

  const changeTyping = (bool) => {
      setCurrentGroupe((prevGroupe) => {
          const updatedParticipants = prevGroupe.participants.map((p) => {
              if (p.nom === currentUser.nom) {
                  return { ...p, isTyping: bool };
              }
              return p;
          });

          return {
              ...prevGroupe,
              participants: updatedParticipants,
          };
      });
      console.log(currentGroupe)
  }

  return (
    <div id="fil">
      <Topbar currentGroupe={currentGroupe} currentUser={currentUser}></Topbar>
      <div id="messages-zone">
        {messagesFiltres.map((message, index) => {
          const estMoi = message.username === currentUser
          return estMoi ? (
            <Bulle key={message.id ?? index} message={message} />
          ) : (
            <BulleAutre key={message.id ?? index} message={message} />
          )
        })}
      </div>
      <div>
          {participantsTyping && participantsTyping.map((p) => (
              <Typing key={p.nom} nom={p.nom} />
          ))}
      </div>
      <div>
        <Chat onSend={onSend} changeTyping={changeTyping}/>
      </div>
    </div>
  )
}

export default FilsConversation
