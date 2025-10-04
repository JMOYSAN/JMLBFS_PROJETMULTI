const API_URL = 'http://localhost:3000'

export async function listPublicGroups() {
  const res = await fetch(`${API_URL}/groups/public`)

  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des groupes publics')
  }

  return res.json()
}

export async function fetchGroupMembers(groupId) {
  const res = await fetch(`${API_URL}/groups-users/group/${groupId}`)
  if (!res.ok) {
    throw new Error('Erreur récupération membres du groupe')
  }
  const data = await res.json()
  return data
}

export async function listPrivateGroups(userId) {
  const res = await fetch(`${API_URL}/groups/private/${userId}`)
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des groupes privés')
  }

  const data = await res.json()
  return data
}

export async function fetchNextGroups(type, lastGroupId, limit = 20) {
  await delay()
  const res = await fetch(
    `${API_URL}/groups/next/${type}/${lastGroupId}?limit=${limit}`
  )

  if (!res.ok) {
    throw new Error(`Erreur HTTP ${res.status}`)
  }

  return res.json()
}

export async function createGroup(name, isPrivate) {
  const res = await fetch(`${API_URL}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.trim(),
      is_private: isPrivate ? 1 : 0,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Erreur création groupe')
  }

  return res.json()
}

export async function addUserToGroup(userId, groupId) {
  const res = await fetch(`${API_URL}/groups-users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, groupId }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Erreur lors de l'ajout au groupe")
  }

  return res.json()
}

export async function getGroupMembers(groupId) {
  const res = await fetch(`${API_URL}/groups-users/group/${groupId}`)

  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des membres')
  }

  return res.json()
}

export function normalizeGroup(groupe, index = 0) {
  return {
    id: groupe.id ?? index,
    nom: groupe.name ?? `Groupe${index}`,
    type: groupe.is_private ? 'private' : 'public',
  }
}
