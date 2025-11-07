import { fetchWithAuth } from './authService.js'
const API_URL = import.meta.env.VITE_API_URL

export function fetchMessages(groupId, limit = 20) {
  const url = `${API_URL}/api/messages/group/${groupId}/lazy?limit=${limit}`

  return fetchWithAuth(url).then((res) => {
    if (!res.ok) {
      throw new Error('Erreur chargement messages')
    }
    return res.json()
  })
}

export function fetchOlderMessages(groupId, beforeId, limit = 20) {
  const url = `${API_URL}/api/messages/group/${groupId}/lazy?limit=${limit}&beforeId=${beforeId}`

  return fetchWithAuth(url).then((res) => {
    if (!res.ok) {
      throw new Error('Erreur chargement messages anciens')
    }
    return res.json()
  })
}

export function deleteMessage(id) {
  return fetchWithAuth(`${API_URL}/api/messages/${id}`, {
    method: 'DELETE',
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur suppression message')
    return res.json()
  })
}

export function sendMessage(userId, groupId, content) {
  return fetchWithAuth(`${API_URL}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      group_id: groupId,
      content,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Erreur envoi message')
    }
    return res.json()
  })
}
