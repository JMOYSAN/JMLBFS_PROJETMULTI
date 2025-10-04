import { useEffect, useRef } from 'react'
import Bulle from './Bulle'
import BulleAutre from './BulleAutre.jsx'
import Chat from './BarreChat.jsx'
import Topbar from '../Components/Topbar.jsx'
import Typing from './Typing'

import { useMessages } from '../hooks/useMessages'

function FilsConversation({
  currentUser,
  setCurrentUser,
  currentGroupe,
  utilisateurs,
  onClose,
  setCurrentGroupe,
  setGroupes,
}) {
  const messagesZoneRef = useRef(null)

  const { messages, send, loadMoreMessages, hasMore, pending, members } =
    useMessages(currentGroupe, currentUser)

  useEffect(() => {
    const container = messagesZoneRef.current
    if (!container) return

    const handleScroll = () => {
      if (
        container.scrollTop === 0 &&
        hasMore &&
        !pending &&
        messages.length > 0
      ) {
        const firstId = messages[0]?.id
        if (firstId) {
          loadMoreMessages(firstId).then((olderMessages) => {
            if (olderMessages && olderMessages.length > 0) {
              const scrollOffset = container.scrollHeight - container.scrollTop
              requestAnimationFrame(() => {
                container.scrollTop = container.scrollHeight - scrollOffset
              })
            }
          })
        }
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [messages, loadMoreMessages, hasMore, pending])

  useEffect(() => {
    if (messagesZoneRef.current && !pending) {
      messagesZoneRef.current.scrollTop = messagesZoneRef.current.scrollHeight
    }
  }, [currentGroupe?.id])

  const handleSend = async (contenu) => {
    await send(contenu)

    requestAnimationFrame(() => {
      if (messagesZoneRef.current) {
        messagesZoneRef.current.scrollTop = messagesZoneRef.current.scrollHeight
      }
    })
  }

  const participantsTyping =
    currentGroupe?.participants?.filter(
      (p) => p.isTyping && p.nom !== currentUser?.username
    ) || []
  return (
    <div id="fil">
      <Topbar
        utilisateurs={utilisateurs}
        currentGroupe={currentGroupe}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onClose={onClose}
        setCurrentGroupe={setCurrentGroupe}
        setGroupes={setGroupes}
      />

      <div id="messages-zone" ref={messagesZoneRef}>
        {pending && messages.length === 0 && (
          <p className="loading">Chargement des messages...</p>
        )}

        {[...messages].reverse().map((message) => {
          const estMoi = message.user_id === currentUser.id
          return estMoi ? (
            <Bulle key={message.id} message={message} members={members} />
          ) : (
            <BulleAutre key={message.id} message={message} members={members} />
          )
        })}

        {pending && messages.length > 0 && (
          <p className="loading">Chargement...</p>
        )}
      </div>

      <div>
        {participantsTyping.map((p) => (
          <Typing key={p.nom} nom={p.nom} />
        ))}
      </div>

      <Chat onSend={handleSend} />
    </div>
  )
}

export default FilsConversation
