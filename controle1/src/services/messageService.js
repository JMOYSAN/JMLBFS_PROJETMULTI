/*
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
*/

// src/services/messageService.js
import { fetchWithAuth } from './authService.js'

export async function fetchMessages(groupId, limit = 50, beforeId = null) {
  const params = new URLSearchParams({ limit: String(limit) })
  if (beforeId) params.set('beforeId', String(beforeId))

  const res = await fetchWithAuth(
    `/api/messages/group/${groupId}?${params.toString()}`,
    { method: 'GET' }
  )
  if (!res.ok) throw new Error('Erreur récupération des messages')
  return res.json()
}

export async function fetchOlderMessages(groupId, beforeId, limit = 50) {
  return fetchMessages(groupId, limit, beforeId)
}

export async function sendMessage(groupId, text) {
  const res = await fetchWithAuth(`/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ groupId, text }),
  })
  if (!res.ok) throw new Error('Erreur envoi du message')
  return res.json()
}
