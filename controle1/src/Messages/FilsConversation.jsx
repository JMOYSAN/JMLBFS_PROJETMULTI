import { useEffect, useRef, useState } from 'react'
import Bulle from './Bulle'
import BulleAutre from './BulleAutre.jsx'
import Chat from './BarreChat.jsx'
import Topbar from '../Components/Topbar.jsx'
import Typing from './Typing'

function FilsConversation({
  currentUser,
  currentGroupe,
  onSend,
  utilisateurs,
  OnClose,
  setCurrentGroupe,
  setGroupes,
}) {
  const messagesZoneRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(10)

  const messagesFiltres = currentGroupe?.messages || []
  const totalMessages = messagesFiltres.length

  const participantsTyping =
    currentGroupe?.participants?.filter(
      (p) => p.isTyping && p.nom !== currentUser
    ) || []

  useEffect(() => {
    if (messagesZoneRef.current) {
      messagesZoneRef.current.scrollTop = messagesZoneRef.current.scrollHeight
    }
  }, [messagesFiltres])

  useEffect(() => {
    const container = messagesZoneRef.current
    if (!container) return

    const onScroll = () => {
      if (container.scrollTop === 0 && visibleCount < totalMessages) {
        const previousScrollHeight = container.scrollHeight
        setVisibleCount((prev) => Math.min(prev + 10, totalMessages))
        setTimeout(() => {
          container.scrollTop = container.scrollHeight - previousScrollHeight
        }, 0)
      }
    }

    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [visibleCount, totalMessages])

  const messagesAffiches = messagesFiltres.slice(-visibleCount)

  return (
    <div id="fil">
      <Topbar
        utilisateurs={utilisateurs}
        currentGroupe={currentGroupe}
        currentUser={currentUser}
        OnClose={OnClose}
        setCurrentGroupe={setCurrentGroupe}
        setGroupes={setGroupes}
      />

      <div id="messages-zone" ref={messagesZoneRef}>
        {messagesAffiches.map((message, index) => {
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
