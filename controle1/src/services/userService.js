/*
import { fetchWithAuth } from './authService.js'
const API_URL = import.meta.env.VITE_API_URL

export function listUsers() {
  return fetchWithAuth(`${API_URL}/users`).then((res) => {
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs')
    }
    return res.json()
  })
}

export function fetchNextUsers(lastUserId) {
  return fetchWithAuth(`${API_URL}/users/next/${lastUserId}`).then((res) => {
    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`)
    }
    return res.json()
  })
}

export function normalizeUser(user, index = 0) {
  return {
    id: user.id ?? index,
    nom: user.username ?? `Utilisateur${index}`,
    statut: user.online_status ?? 'offline',
    avatar: user.avatar ?? null,
  }
}
*/

// src/services/userService.js
import { fetchWithAuth } from './authService.js'

export async function listUsers() {
  const res = await fetchWithAuth(`/api/users`, { method: 'GET' })
  if (!res.ok) throw new Error('Erreur récupération utilisateurs')
  return res.json()
}

export async function getUser(userId) {
  const res = await fetchWithAuth(`/api/users/${userId}`, { method: 'GET' })
  if (!res.ok) throw new Error('Erreur récupération utilisateur')
  return res.json()
}

export async function updateUserTheme(userId, newTheme) {
  const res = await fetchWithAuth(`/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme: newTheme }),
  })
  if (!res.ok) throw new Error('Erreur mise à jour du thème')
  return res.json()
}
