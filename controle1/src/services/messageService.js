import { fetchWithAuth } from './authService.js'
import { CryptoService } from './crypto/CryptoService.js'

const API_URL = import.meta.env.VITE_API_URL

export async function fetchMessages(groupId, limit = 20) {
  const url = `${API_URL}/api/messages/group/${groupId}/lazy?limit=${limit}`
  const res = await fetchWithAuth(url)
  if (!res.ok) throw new Error('Erreur chargement messages')

  const messages = await res.json()
  for (const msg of messages) {
    if (msg.content && msg.sender_user_id) {
      try {
        const plaintext = await CryptoService.decryptMessage(
          groupId,
          msg.sender_user_id.toString(),
          { body: msg.content, type: msg.type || 1 }
        )
        msg.content = plaintext
      } catch (e) {
        console.warn('E2EE decrypt failed:', e)
      }
    }
  }
  return messages
}

export async function fetchOlderMessages(groupId, beforeId, limit = 20) {
  const url = `${API_URL}/api/messages/group/${groupId}/lazy?limit=${limit}&beforeId=${beforeId}`
  const res = await fetchWithAuth(url)
  if (!res.ok) throw new Error('Erreur chargement messages anciens')

  const messages = await res.json()
  for (const msg of messages) {
    if (msg.content && msg.sender_user_id) {
      try {
        const plaintext = await CryptoService.decryptMessage(
          groupId,
          msg.sender_user_id.toString(),
          { body: msg.content, type: msg.type || 1 }
        )
        msg.content = plaintext
      } catch (e) {
        console.warn('E2EE decrypt failed:', e)
      }
    }
  }
  return messages
}

export function deleteMessage(id) {
  return fetchWithAuth(`${API_URL}/api/messages/${id}`, {
    method: 'DELETE',
  }).then((res) => {
    if (!res.ok) throw new Error('Erreur suppression message')
    return res.json()
  })
}

export async function sendMessage(userId, groupId, content) {
  // 1. Fetch all group members except sender
  const resMembers = await fetchWithAuth(
    `${API_URL}/api/groups-users/${groupId}`
  )
  const members = await resMembers.json()
  const targets = members.filter((m) => m.user_id !== userId)

  // 2. Create sessions if needed for each target
  for (const t of targets) {
    try {
      const res = await fetch(`${API_URL}/e2ee/devices/${t.user_id}`)
      const devices = await res.json()
      if (devices.length > 0) {
        await CryptoService.createSession(devices[0], groupId, t.user_id)
      }
    } catch (e) {
      console.warn('Session setup failed for', t.user_id, e)
    }
  }

  // 3. Encrypt message with first recipient’s session
  const firstTarget = targets[0]
  const ciphertext = await CryptoService.encryptMessage(
    groupId,
    firstTarget.user_id,
    content
  )

  // 4. Send ciphertext to backend
  const res = await fetchWithAuth(`${API_URL}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      group_id: groupId,
      content: ciphertext.body,
      type: ciphertext.type,
    }),
  })

  if (!res.ok) throw new Error('Erreur envoi message')
  return res.json()
}
