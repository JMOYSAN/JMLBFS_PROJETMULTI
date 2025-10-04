const API_URL = 'http://localhost:3000'

// Chargement initial des messages (les plus récents)
export async function fetchMessages(groupId, limit = 20) {
  const url = `${API_URL}/messages/group/${groupId}/lazy?limit=${limit}`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('Erreur chargement messages')
  }

  return res.json()
}

export async function fetchOlderMessages(groupId, beforeId, limit = 20) {
  const url = `${API_URL}/messages/group/${groupId}/lazy?limit=${limit}&beforeId=${beforeId}`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('Erreur chargement messages anciens')
  }

  return res.json()
}

export async function sendMessage(userId, groupId, content) {
  const res = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      group_id: groupId,
      content,
    }),
  })

  if (!res.ok) {
    throw new Error('Erreur envoi message')
  }

  return res.json()
}
