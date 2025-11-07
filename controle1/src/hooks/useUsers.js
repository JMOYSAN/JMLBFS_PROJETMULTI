// src/hooks/useUsers.js
import { useEffect, useState, useCallback } from 'react'
import { fetchWithAuth } from '../services/authService.js'

const API_URL = import.meta.env.VITE_API_URL

export function useUsers() {
  const [users, setUsers] = useState([])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setPending(true)
    setError('')
    try {
      const res = await fetchWithAuth(`${API_URL}/api/users`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Erreur chargement utilisateurs')
      setUsers([])
    } finally {
      setPending(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { users, pending, error, reload: load }
}
