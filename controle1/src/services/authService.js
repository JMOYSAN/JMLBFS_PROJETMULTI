const API_URL = 'http://localhost:3000'

let accessToken = null

export function setAccessToken(token) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur de connexion')

  accessToken = data.accessToken

  saveUserToStorage(data.user, data.accessToken)

  return { user: data.user, accessToken: data.accessToken }
}

export async function register(username, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json()
  if (res.status !== 201) throw new Error(data.error)
  return data
}

export async function fetchWithAuth(url, options = {}) {
  // Vérifier le token en mémoire d'abord
  if (!accessToken) {
    accessToken = getAccessTokenFromStorage()
  }

  // ✅ LOGS DE DEBUG
  console.log('🔍 DEBUG fetchWithAuth:')
  console.log('  URL:', url)
  console.log('  Token en mémoire:', accessToken ? 'OUI ✅' : 'NON ❌')
  console.log(
    '  Token (premiers chars):',
    accessToken ? accessToken.substring(0, 20) + '...' : 'null'
  )

  if (!accessToken) {
    console.error('❌ Pas de token disponible!')
    throw new Error("Token d'accès manquant")
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
  }

  console.log('  Headers:', headers)

  const res = await fetch(url, { ...options, headers, credentials: 'include' })

  console.log('  Réponse status:', res.status)

  if (res.status === 401) {
    console.log('  ⚠️ 401 reçu, tentative de refresh...')
    const refreshed = await refreshToken()
    if (refreshed) {
      console.log('  ✅ Token refreshed, nouvelle tentative')
      return fetchWithAuth(url, options)
    }
    console.error('  ❌ Refresh failed')
    throw new Error('Session expirée, veuillez vous reconnecter')
  }

  return res
}

export async function refreshToken() {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    clearUserFromStorage()
    accessToken = null
    return false
  }

  const data = await res.json()
  accessToken = data.accessToken

  updateAccessTokenInStorage(data.accessToken)

  return true
}

export async function logout() {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
  accessToken = null
  clearUserFromStorage()
}

export async function listPrivateGroups(userId) {
  const res = await fetchWithAuth(`${API_URL}/groups/private/${userId}`)
  if (!res.ok) throw new Error('Erreur récupération groupes privés')
  return res.json()
}

export function saveUserToStorage(user, token) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('user', JSON.stringify(user))
    if (token) {
      localStorage.setItem('accessToken', token)
    }
  } catch (err) {
    console.warn("Impossible de sauvegarder l'utilisateur", err)
  }
}

export function loadUserFromStorage() {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  } catch (err) {
    console.warn("Impossible de charger l'utilisateur", err)
    return null
  }
}

export function getAccessTokenFromStorage() {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('accessToken')
  } catch (err) {
    console.warn('Impossible de charger le token', err)
    return null
  }
}

export function updateAccessTokenInStorage(token) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('accessToken', token)
  } catch (err) {
    console.warn('Impossible de mettre à jour le token', err)
  }
}

export function clearUserFromStorage() {
  if (typeof window === 'undefined') return
  localStorage.clear()
}

export function updateUserTheme(userId, newTheme) {
  return fetchWithAuth(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme: newTheme }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Erreur lors de la mise à jour du thème')
    }
    return res.json()
  })
}
