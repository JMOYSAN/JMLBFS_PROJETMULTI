import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  clearUserFromStorage,
  getAccessToken,
  loadUserFromStorage,
  login as loginService,
  logout as logoutService,
  refreshToken as refreshTokenService,
  register as registerService,
  saveUserToStorage,
  setAccessToken,
  updateUserTheme as updateThemeService,
} from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isConnect, setIsConnect] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const accessTokenRef = useRef(null)

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

  const logout = useCallback(() => {
    logoutService()
    clearUserFromStorage()
    accessTokenRef.current = null
    setCurrentUser(null)
    setIsConnect(false)
  }, [])

  const refreshAccessToken = useCallback(async () => {
    try {
      const success = await refreshTokenService()
      if (success) {
        accessTokenRef.current = getAccessToken()
      }
    } catch {
      logout()
    }
  }, [logout])

  useEffect(() => {
    const storedUser = loadUserFromStorage()
    if (storedUser) {
      setCurrentUser(storedUser)
      setIsConnect(true)
      refreshAccessToken()
    }
  }, [refreshAccessToken])

  useEffect(() => {
    if (currentUser?.theme === 'light') {
      document.body.classList.add('light')
    } else {
      document.body.classList.remove('light')
    }
  }, [currentUser])

  const login = useCallback(
    async (username, password) => {
      const data = await runWithPending(() => loginService(username, password))

      setCurrentUser(data.user)
      saveUserToStorage(data.user, data.accessToken)
      accessTokenRef.current = data.accessToken
      setAccessToken(data.accessToken)
      setIsConnect(true)

      console.log(data.accessToken)

      return data.user
    },
    [runWithPending]
  )

  const register = useCallback(
    async (username, password) => {
      return await runWithPending(() => registerService(username, password))
    },
    [runWithPending]
  )

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
    accessTokenRef,
    refreshAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
