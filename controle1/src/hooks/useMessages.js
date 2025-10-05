import { useCallback, useEffect, useState } from 'react'
import {
  fetchMessages,
  fetchOlderMessages,
  sendMessage,
} from '../services/messageService.js'
import { fetchGroupMembers } from '../services/groupService.js'

export function useMessages(currentGroupe, currentUser) {
  const [messages, setMessages] = useState([])
  const [members, setMembers] = useState({})
  const [hasMore, setHasMore] = useState(true)
  const [pending, setPending] = useState(false)

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
      users.forEach((u) => {
        map[u.id] = u.username || u.nom
      })
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
        // Les messages arrivent triés DESC (plus récent en premier)
        // On les garde dans cet ordre
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
    const beforeId = oldestMessage.id // ✅ Utilisez .id

    const olderMessages = await runWithPending(
      () => fetchOlderMessages(currentGroupe.id, beforeId, 20) // ✅ Passez l'ID
    )

    if (olderMessages.length < 20) {
      setHasMore(false)
    }

    if (olderMessages.length > 0) {
      setMessages((prev) => [...prev, ...olderMessages])
    }

    return olderMessages
  }, [hasMore, currentGroupe?.id, messages, pending, runWithPending])

  // Envoyer un message
  const send = useCallback(
    async (contenu) => {
      if (!contenu.message?.trim() && !contenu.fichier) return
      if (!currentUser?.id || !currentGroupe?.id) return

      const newMsg = await runWithPending(() =>
        sendMessage(currentUser.id, currentGroupe.id, contenu.message)
      )

      // Ajouter le nouveau message au début (plus récent)
      setMessages((prev) => [newMsg, ...prev])
      return newMsg
    },
    [currentUser?.id, currentGroupe?.id, runWithPending]
  )

  return {
    messages,
    members,
    send,
    loadMoreMessages,
    hasMore,
    pending,
  }
}
