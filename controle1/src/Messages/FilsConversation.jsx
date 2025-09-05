import Bulle from './Bulle'
import BulleAutre from './BulleAutre.jsx'
import Chat from './BarreChat.jsx'
import Topbar from '../Components/Topbar.jsx'

function FilsConversation({
  messages = [],
  currentUser,
  currentGroupe,
  onSend,
}) {
  const messagesFiltres = messages.filter(
    (message) => message.groupe?.nom === currentGroupe.nom
  )

  return (
    <div id="fil">
      <Topbar currentGroupe={currentGroupe}></Topbar>
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
        <Chat onSend={onSend} />
      </div>
    </div>
  )
}

export default FilsConversation
