// src/services/groupService.js
import { fetchWithAuth } from './authService.js'
const API_URL = import.meta.env.VITE_API_URL

export async function listPublicGroups() {
  const res = await fetchWithAuth(`${API_URL}/api/groups/public`)
  if (!res.ok) throw new Error('Erreur récupération groupes publics')
  return res.json()
}

export async function listPrivateGroups(userId) {
  const res = await fetchWithAuth(`${API_URL}/api/groups/private/${userId}`)
  if (!res.ok) throw new Error('Erreur récupération groupes privés')
  return res.json()
}

export async function createGroup(name, isPrivate = false) {
  const res = await fetchWithAuth(`${API_URL}/api/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, is_private: isPrivate ? 1 : 0 }),
  })
  if (!res.ok) throw new Error('Erreur création groupe')
  return res.json()
}

export async function addUserToGroup(groupId, userId) {
  const res = await fetchWithAuth(
    `${API_URL}/api/groups/${groupId}/users/${userId}`,
    {
      method: 'POST',
    }
  )
  if (!res.ok) throw new Error('Erreur ajout utilisateur au groupe')
  return res.json()
}

export async function fetchNextGroups(offset) {
  const res = await fetchWithAuth(`${API_URL}/api/groups/page/${offset}`)
  if (!res.ok) throw new Error('Erreur pagination groupes')
  return res.json()
}

export async function getGroupMembers(groupId) {
  const res = await fetchWithAuth(`${API_URL}/api/groups/${groupId}/members`)
  if (!res.ok) throw new Error('Erreur membres du groupe')
  return res.json()
}
