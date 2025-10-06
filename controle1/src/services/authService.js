const API_URL = 'http://localhost:3000'

export function login(username, password) {
  return fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json().then((data) => ({ res, data })))
    .then(({ res, data }) => {
      if (!res.ok) {
        throw new Error(data.error || 'Erreur de connexion')
      }
      return data
    })
}

export function register(username, password) {
  return fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json().then((data) => ({ res, data })))
    .then(({ res, data }) => {
      if (res.status !== 201) {
        throw new Error(data.error || "Erreur lors de l'inscription")
      }
      return data
    })
}

export function saveUserToStorage(user) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('user', JSON.stringify(user))
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

export function clearUserFromStorage() {
  if (typeof window === 'undefined') return
  localStorage.clear()
}

export function updateUserTheme(userId, newTheme) {
  return fetch(`${API_URL}/users/${userId}`, {
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
