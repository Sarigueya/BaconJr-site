import { createContext, useContext, useEffect, useState } from 'react'
import { getActiveSession, logoutUser } from '../utils/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getActiveSession())
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [fromCheckout, setFromCheckout] = useState(false)
  const [authToast, setAuthToast] = useState(null)

  useEffect(() => {
    if (!authToast) return
    const timer = window.setTimeout(() => setAuthToast(null), 3500)
    return () => window.clearTimeout(timer)
  }, [authToast])

  const openAuthModal = ({ checkout = false } = {}) => {
    setFromCheckout(checkout)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
    setFromCheckout(false)
  }

  const handleAuthSuccess = (user, action = 'login') => {
    setCurrentUser(user)
    setIsAuthModalOpen(false)
    setFromCheckout(false)
    setAuthToast(
      action === 'register'
        ? `¡Cuenta creada con éxito! Bienvenido, ${user.name}.`
        : `¡Sesión iniciada! Bienvenido de nuevo, ${user.name}.`
    )
  }

  const logout = () => {
    logoutUser()
    setCurrentUser(null)
    setAuthToast('Has cerrado sesión.')
  }

  const dismissToast = () => setAuthToast(null)

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthModalOpen,
        fromCheckout,
        authToast,
        dismissToast,
        openAuthModal,
        closeAuthModal,
        handleAuthSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}