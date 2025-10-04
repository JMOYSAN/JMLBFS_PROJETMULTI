const API_URL = 'http://localhost:3000'

export async function listUsers() {
  const res = await fetch(`${API_URL}/users`)

  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des utilisateurs')
  }

  return res.json()
}

export async function fetchNextUsers(lastUserId) {
  const res = await fetch(`${API_URL}/users/next/${lastUserId}`)

  if (!res.ok) {
    throw new Error(`Erreur HTTP ${res.status}`)
  }

  return res.json()
}

export function normalizeUser(user, index = 0) {
  return {
    id: user.id ?? index,
    nom: user.username ?? `Utilisateur${index}`,
    statut: user.online_status ?? 'offline',
    avatar: user.avatar ?? null,
  }
}
