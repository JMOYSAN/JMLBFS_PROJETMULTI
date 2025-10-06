import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  login as loginService,
  register as registerService,
  saveUserToStorage,
  loadUserFromStorage,
  clearUserFromStorage,
  updateUserTheme as updateThemeService,
} from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
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

  useEffect(() => {
    const storedUser = loadUserFromStorage()
    if (storedUser) {
      setCurrentUser(storedUser)
      setIsConnect(true)
    }
  }, [])

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

  const value = {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}
