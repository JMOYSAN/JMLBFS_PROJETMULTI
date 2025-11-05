/*
import { fetchWithAuth } from './authService.js'
const API_URL = import.meta.env.VITE_API_URL

export function listPublicGroups() {
  return fetchWithAuth(`${API_URL}/groups/public`).then((res) => {
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des groupes publics')
    }
    return res.json()
  })
}

export function fetchGroupMembers(groupId) {
  return fetchWithAuth(`${API_URL}/groups-users/group/${groupId}`).then(
    (res) => {
      if (!res.ok) {
        throw new Error('Erreur récupération membres du groupe')
      }
      return res.json()
    }
  )
}

export function listPrivateGroups(userId) {
  return fetchWithAuth(`${API_URL}/groups/private/${userId}`).then((res) => {
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des groupes privés')
    }
    return res.json()
  })
}

export function fetchNextGroups(type, lastGroupId, limit = 20) {
  return fetchWithAuth(
    `${API_URL}/groups/next/${type}/${lastGroupId}?limit=${limit}`
  ).then((res) => {
    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`)
    }
    return res.json()
  })
}

export function createGroup(name, isPrivate) {
  return fetchWithAuth(`${API_URL}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.trim(),
      is_private: isPrivate ? 1 : 0,
    }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((err) => {
        throw new Error(err.error || 'Erreur création groupe')
      })
    }
    return res.json()
  })
}

export function addUserToGroup(userId, groupId) {
  return fetchWithAuth(`${API_URL}/groups-users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, groupId }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((err) => {
        throw new Error(err.error || "Erreur lors de l'ajout au groupe")
      })
    }
    return res.json()
  })
}

export function getGroupMembers(groupId) {
  return fetchWithAuth(`${API_URL}/groups-users/group/${groupId}`).then(
    (res) => {
      if (!res.ok) {
        throw new Error('Erreur lors de la récupération des membres')
      }
      return res.json()
    }
  )
}

export function normalizeGroup(groupe, index = 0) {
  return {
    id: groupe.id ?? index,
    nom: groupe.name ?? `Groupe${index}`,
    type: groupe.is_private ? 'private' : 'public',
  }
}
*/

// src/services/groupService.js
import { fetchWithAuth } from './authService.js'

export async function listPublicGroups() {
  const res = await fetchWithAuth(`/api/groups/public`, { method: 'GET' })
  if (!res.ok) throw new Error('Erreur récupération des groupes publics')
  return res.json()
}

export async function listPrivateGroups(userId) {
  const res = await fetchWithAuth(`/api/groups/private/${userId}`, {
    method: 'GET',
  })
  if (!res.ok) throw new Error('Erreur récupération des groupes privés')
  return res.json()
}

export async function createGroup(name, isPublic = true) {
  const res = await fetchWithAuth(`/api/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, isPublic }),
  })
  if (!res.ok) throw new Error('Erreur création du groupe')
  return res.json()
}

export async function joinGroup(groupId) {
  const res = await fetchWithAuth(`/api/groups/${groupId}/join`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Erreur pour rejoindre le groupe')
  return res.json()
}

export async function leaveGroup(groupId) {
  const res = await fetchWithAuth(`/api/groups/${groupId}/leave`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Erreur pour quitter le groupe')
  return res.json()
}
