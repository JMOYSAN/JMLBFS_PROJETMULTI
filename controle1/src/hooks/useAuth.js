import { useCallback, useEffect, useState } from 'react'
import {
  login as loginService,
  register as registerService,
  saveUserToStorage,
  loadUserFromStorage,
  clearUserFromStorage,
  updateUserTheme as updateThemeService,
} from '../services/authService.js'

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isConnect, setIsConnect] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const runWithPending = useCallback(async (task) => {
    setPending(true)
    setError('')
    try {
      return await task()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setPending(false)
    }
  }, [])

  // Restaurer utilisateur depuis le storage au montage
  useEffect(() => {
    const storedUser = loadUserFromStorage()
    if (storedUser) {
      setCurrentUser(storedUser)
      setIsConnect(true)
    }
  }, [])

  // Gérer le thème
  useEffect(() => {
    if (currentUser?.theme === 'light') {
      document.body.classList.add('light')
    } else {
      document.body.classList.remove('light')
    }
  }, [currentUser])

  const login = useCallback(
    async (username, password) => {
      const user = await runWithPending(() => loginService(username, password))
      setCurrentUser(user)
      saveUserToStorage(user)
      setIsConnect(true)
      return user
    },
    [runWithPending]
  )

  const register = useCallback(
    async (username, password) => {
      const user = await runWithPending(() =>
        registerService(username, password)
      )
      return user
    },
    [runWithPending]
  )

  const logout = useCallback(() => {
    clearUserFromStorage()
    setCurrentUser(null)
    setIsConnect(false)
  }, [])

  const toggleTheme = useCallback(async () => {
    if (!currentUser) return

    const newTheme = currentUser.theme === 'dark' ? 'light' : 'dark'
    const updatedUser = await runWithPending(() =>
      updateThemeService(currentUser.id, newTheme)
    )

    setCurrentUser(updatedUser)
    saveUserToStorage(updatedUser)
  }, [currentUser, runWithPending])

  return {
    currentUser,
    setCurrentUser,
    isConnect,
    login,
    register,
    logout,
    toggleTheme,
    pending,
    error,
  }
}
