// hooks/useMessages.js
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchMessages,
  fetchOlderMessages,
  sendMessage,
} from '../services/messageService.js'
import { fetchGroupMembers } from '../services/groupService.js'
import { deleteMessage } from '../services/messageService'

export function useMessages(currentGroupe, currentUser) {
  const [messages, setMessages] = useState([])
  const [members, setMembers] = useState({})
  const [hasMore, setHasMore] = useState(true)
  const [pending, setPending] = useState(false)
  const ws = useRef(null)

  const runWithPending = useCallback(async (task) => {
    setPending(true)
    try {
      return await task()
    } finally {
      setPending(false)
    }
  }, [])

  // Charger les membres du groupe
  useEffect(() => {
    if (!currentGroupe?.id) return
    runWithPending(async () => {
      const users = await fetchGroupMembers(currentGroupe.id)
      const map = {}
      users.forEach((u) => (map[u.id] = u.username || u.nom))
      setMembers(map)
    })
  }, [currentGroupe?.id, runWithPending])

  // Charger les messages initiaux
  useEffect(() => {
    if (!currentGroupe?.id) return
    setMessages([])
    setHasMore(true)

    runWithPending(() => fetchMessages(currentGroupe.id, 20))
      .then((data) => {
        setMessages(data)
        if (data.length < 20) setHasMore(false)
      })
      .catch((err) => console.error('Erreur récupération messages:', err))
  }, [currentGroupe?.id, runWithPending])

  // Charger les messages plus anciens
  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || !currentGroupe?.id || messages.length === 0 || pending)
      return

    const oldestMessage = messages[messages.length - 1]
    const beforeId = oldestMessage.id

    const olderMessages = await runWithPending(() =>
      fetchOlderMessages(currentGroupe.id, beforeId, 20)
    )

    if (olderMessages.length < 20) setHasMore(false)
    if (olderMessages.length > 0)
      setMessages((prev) => [...prev, ...olderMessages])
    return olderMessages
  }, [hasMore, currentGroupe?.id, messages, pending, runWithPending])

  // Envoyer un message
  const send = useCallback(
    async (contenu) => {
      if (!contenu.message?.trim() && !contenu.fichier) return
      if (!currentUser?.id || !currentGroupe?.id) return

      // envoi via API (persistance + éventuel broadcast côté serveur)
      const newMsg = await runWithPending(() =>
        sendMessage(currentUser.id, currentGroupe.id, contenu.message)
      )

      // ajout optimiste dans la liste locale
      if (newMsg) {
        setMessages((prev) => [
          {
            ...newMsg,
            content: contenu.message,
            sender_user_id: currentUser.id,
            group_id: currentGroupe.id,
          },
          ...prev,
        ])
      }

      return newMsg
    },
    [currentUser?.id, currentGroupe?.id, runWithPending]
  )

  const remove = useCallback(async (id) => {
    try {
      await deleteMessage(id)
      setMessages((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      console.error('Erreur suppression:', err)
    }
  }, [])

  useEffect(() => {
    if (!currentUser?.id) return

    const wsUrl = `${
      import.meta.env.VITE_WEBSOCKET_URL
    }?user=${currentUser.id}&token=${localStorage.getItem('accessToken') || ''}`

    console.log('[useMessages] Opening WS:', wsUrl)

    ws.current = new WebSocket(wsUrl)

    ws.current.onopen = () => console.log('[useMessages] WS connected')
    ws.current.onclose = () => console.log('[useMessages] WS closed')
    ws.current.onerror = (err) => console.error('[useMessages] WS error:', err)

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'message' && data.group_id === currentGroupe?.id) {
          // ici, data est le message envoyé par l’API via Redis/WS
          setMessages((prev) => [data, ...prev])
        }

        if (data.type === 'delete') {
          setMessages((prev) => prev.filter((m) => m.id !== data.id))
        }
      } catch (err) {
        console.error('[useMessages] parse error:', err)
      }
    }

    return () => {
      if (ws.current) {
        ws.current.close()
        ws.current = null
      }
    }
  }, [currentUser?.id, currentGroupe?.id])

  return {
    messages,
    members,
    send,
    loadMoreMessages,
    hasMore,
    pending,
    remove,
  }
}
