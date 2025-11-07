const API_URL = import.meta.env.VITE_API_URL

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
  if (!accessToken) {
    const refreshed = await refreshToken()
    if (!refreshed) {
      throw new Error('Session expirée')
    }
    accessToken = getAccessTokenFromStorage()
  }

  if (!accessToken) {
    throw new Error("Token d'accès manquant")
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
  }

  const res = await fetch(url, { ...options, headers, credentials: 'include' })

  if (res.status === 401) {
    const refreshed = await refreshToken()
    if (refreshed) {
      return fetchWithAuth(url, options)
    }
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
*/

// src/services/authService.js
/* eslint-disable no-undef */

// Base URL: set in Vite env for renderer and packaged builds
export const API_URL = import.meta.env.VITE_API_URL || 'https://bobberchat.com'

let accessToken = null

// ---------- Storage helpers (safe in Electron/SSR) ----------
function lsGet(key) {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function lsSet(key, val) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, val)
  } catch {}
}
function lsRemoveAll() {
  if (typeof window === 'undefined') return
  try {
    localStorage.clear()
  } catch {}
}

// ---------- Token helpers ----------
export function setAccessToken(token) {
  accessToken = token || null
  if (token) lsSet('accessToken', token)
}
export function getAccessToken() {
  return accessToken || lsGet('accessToken')
}

// ---------- User storage ----------
export function saveUserToStorage(user, token) {
  if (user) lsSet('user', JSON.stringify(user))
  if (token) setAccessToken(token)
}
export function loadUserFromStorage() {
  const raw = lsGet('user')
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
export function clearUserFromStorage() {
  lsRemoveAll()
  accessToken = null
}

// ---------- Auth endpoints (only endpoints not under /api) ----------
export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Erreur de connexion')

  // Expect: { accessToken, user }
  saveUserToStorage(data.user, data.accessToken)
  return { user: data.user, accessToken: data.accessToken }
}

export async function register(username, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Inscription échouée')
  return data
}

export async function logout() {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {})
  clearUserFromStorage()
}

// Refresh using HttpOnly cookie. Returns boolean.
export async function refreshToken() {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    clearUserFromStorage()
    throw new Error('Unauthorized refresh')
  }

  const data = await res.json().catch(() => ({}))
  if (!data?.accessToken) {
    clearUserFromStorage()
    throw new Error('No access token from refresh')
  }

  setAccessToken(data.accessToken)
  // Optionally persist updated user if server returns it
  if (data.user) saveUserToStorage(data.user, data.accessToken)
  return true
}

// ---------- Centralized authorized fetch with auto-refresh ----------
export async function fetchWithAuth(pathOrUrl, options = {}) {
  // Build absolute URL if relative path passed
  const url = pathOrUrl.startsWith('http')
    ? pathOrUrl
    : `${API_URL}${pathOrUrl}`

  // Ensure token present or attempt one-time refresh
  let token = getAccessToken()
  if (!token) {
    await refreshToken() // throws on failure
    token = getAccessToken()
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  }

  const doFetch = () =>
    fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    })

  let res = await doFetch()

  // If 401, try refresh once, then retry original request
  if (res.status === 401) {
    await refreshToken() // throws on failure
    const retryHeaders = {
      ...(options.headers || {}),
      Authorization: `Bearer ${getAccessToken()}`,
    }
    res = await fetch(url, {
      ...options,
      headers: retryHeaders,
      credentials: 'include',
    })
  }

  return res
}

export async function updateUserTheme(userId, newTheme) {
  const res = await fetchWithAuth(`/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme: newTheme }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Erreur lors de la mise à jour du thème')
  }

  return res.json()
}
