import { useEffect, useRef, useState } from 'react'
import Bulle from './Bulle'
import BulleAutre from './BulleAutre.jsx'
import Chat from './BarreChat.jsx'
import Topbar from '../Components/Topbar.jsx'
import Typing from './Typing'

function FilsConversation({
  currentUser,
  setCurrentUser,
  currentGroupe,
  onSend, // you can drop this if API fully replaces it
  utilisateurs,
  onClose,
  setCurrentGroupe,
  setGroupes,
}) {
  const messagesZoneRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [visibleCount, setVisibleCount] = useState(20)

  useEffect(() => {
    if (!currentGroupe?.id) return

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/messages/group/${currentGroupe.id}`
        )
        if (!res.ok) throw new Error('Erreur chargement messages')
        const data = await res.json()
        setMessages(data)
      } catch (err) {
        console.error('Erreur récupération messages:', err)
      }
    }

    fetchMessages()
  }, [currentGroupe])

  useEffect(() => {
    if (messagesZoneRef.current) {
      messagesZoneRef.current.scrollTop = messagesZoneRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (contenu) => {
    if (!contenu.message?.trim() && !contenu.fichier) return
    try {
      console.log('Send payload', {
        user_id: currentUser?.id,
        group_id: currentGroupe?.id,
        content: contenu?.message,
      })

      const res = await fetch('http://localhost:3000/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          group_id: currentGroupe.id,
          content: contenu.message,
        }),
      })
      if (!res.ok) throw new Error('Erreur envoi message')
      const newMsg = await res.json()
      setMessages((prev) => [...prev, newMsg])
    } catch (err) {
      console.error('Erreur envoi message:', err)
    }
  }

  const messagesAffiches = messages.slice(-visibleCount)

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
        {messagesAffiches.map((message, index) => {
          const estMoi = message.user_id === currentUser.id
          return estMoi ? (
            <Bulle
              key={message.id ?? index}
              message={{ ...message, texte: message.content }}
            />
          ) : (
            <BulleAutre
              key={message.id ?? index}
              message={{ ...message, texte: message.content }}
            />
          )
        })}
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
