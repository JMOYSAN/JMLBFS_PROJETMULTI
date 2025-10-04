import { useEffect, useRef, useState, useCallback } from 'react'
import Bulle from './Bulle'
import BulleAutre from './BulleAutre.jsx'
import Chat from './BarreChat.jsx'
import Topbar from '../Components/Topbar.jsx'
import Typing from './Typing'

function FilsConversation({
  currentUser,
  setCurrentUser,
  currentGroupe,
  onSend,
  utilisateurs,
  onClose,
  setCurrentGroupe,
  setGroupes,
}) {
  const messagesZoneRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const prevCount = useRef(0)

  // Charger les messages initiaux
  useEffect(() => {
    if (!currentGroupe?.id) return
    setMessages([])
    setHasMore(true)
    fetchMessages()
  }, [currentGroupe])

  const fetchMessages = useCallback(
    async (beforeId = null) => {
      if (isLoading || !currentGroupe?.id) return
      setIsLoading(true)
      try {
        let url = `http://localhost:3000/messages/group/${currentGroupe.id}?limit=20`
        if (beforeId) url += `&before=${beforeId}`

        const res = await fetch(url)
        if (!res.ok) throw new Error('Erreur chargement messages')
        const data = await res.json()

        if (data.length === 0) {
          setHasMore(false)
        } else {
          setMessages((prev) => (beforeId ? [...data, ...prev] : data))
        }
      } catch (err) {
        console.error('Erreur récupération messages:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [currentGroupe?.id, isLoading]
  )

  // Lazy load on scroll top
  useEffect(() => {
    const container = messagesZoneRef.current
    if (!container) return
    const handleScroll = () => {
      if (
        container.scrollTop === 0 &&
        hasMore &&
        !isLoading &&
        messages.length > 0
      ) {
        const firstId = messages[0]?.id
        if (firstId) fetchMessages(firstId)
      }
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [messages, fetchMessages, hasMore, isLoading])

  // ✅ Scroll only when new messages appended (no jump on load)
  useEffect(() => {
    if (!messagesZoneRef.current || isLoading) return

    const container = messagesZoneRef.current
    const newCount = messages.length

    // scroll only when messages appended at bottom
    if (newCount > prevCount.current) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: prevCount.current === 0 ? 'auto' : 'smooth',
      })
    }

    prevCount.current = newCount
  }, [messages.length, isLoading])

  const handleSend = async (contenu) => {
    if (!contenu.message?.trim()) return
    try {
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
        {messages.map((message) => {
          const estMoi = message.user_id === currentUser.id
          return estMoi ? (
            <Bulle
              key={message.id}
              message={{ ...message, texte: message.content }}
            />
          ) : (
            <BulleAutre
              key={message.id}
              message={{ ...message, texte: message.content }}
            />
          )
        })}
        {isLoading && <p className="loading">Chargement...</p>}
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
