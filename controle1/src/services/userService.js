const API_URL = 'http://localhost:3000'

export function listUsers() {
  return fetch(`${API_URL}/users`).then((res) => {
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs')
    }
    return res.json()
  })
}

export function fetchNextUsers(lastUserId) {
  return fetch(`${API_URL}/users/next/${lastUserId}`).then((res) => {
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
