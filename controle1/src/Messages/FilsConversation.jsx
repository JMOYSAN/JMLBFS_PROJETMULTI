import { useEffect, useRef } from 'react'
import Bulle from './Bulle'
import BulleAutre from './BulleAutre.jsx'
import Chat from './BarreChat.jsx'
import Topbar from '../Components/Topbar.jsx'
import Typing from './Typing'

function FilsConversation({ currentUser, currentGroupe, onSend }) {
  const messagesZoneRef = useRef(null)

  const messagesFiltres = currentGroupe?.messages || []

  const participantsTyping =
    currentGroupe?.participants?.filter(
      (p) => p.isTyping && p.nom !== currentUser
    ) || []

  useEffect(() => {
    if (messagesZoneRef.current) {
      messagesZoneRef.current.scrollTop = messagesZoneRef.current.scrollHeight
    }
  }, [messagesFiltres])

  return (
    <div id="fil">
      <Topbar currentGroupe={currentGroupe} currentUser={currentUser} />

      <div id="messages-zone" ref={messagesZoneRef}>
        {messagesFiltres.map((message, index) => {
          const estMoi = message.auteur === currentUser
          return estMoi ? (
            <Bulle key={message.id ?? index} message={message} />
          ) : (
            <BulleAutre key={message.id ?? index} message={message} />
          )
        })}
      </div>

      <div>
        {participantsTyping.map((p) => (
          <Typing key={p.nom} nom={p.nom} />
        ))}
      </div>

      <Chat onSend={onSend} />
    </div>
  )
}

export default FilsConversation
