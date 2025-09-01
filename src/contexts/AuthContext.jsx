import { createContext, useContext, useState } from 'react'
import { validateCredentials, getUserPermissions, getUserGroups } from '../config/auth-config'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = (role, credential, subType = null) => {
    const isValid = validateCredentials(role, credential, subType)
    
    if (isValid) {
      const permissions = getUserPermissions(role, subType)
      const groups = getUserGroups(role, subType)
      
      const userData = {
        role,
        subType,
        permissions,
        groups,
        loginTime: new Date().toISOString()
      }
      
      setUser(userData)
      setIsAuthenticated(true)
      
      // Store in sessionStorage (not localStorage for security)
      sessionStorage.setItem('authUser', JSON.stringify(userData))
      
      return { success: true, user: userData }
    }
    
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    sessionStorage.removeItem('authUser')
  }

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || user?.permissions?.includes('all') || false
  }

  const canAccessGroup = (groupName) => {
    // Admin can access everything
    if (user?.role === 'admin') return true
    
    // Investor can view everything but not download
    if (user?.role === 'investor') return true
    
    // Students can only access their assigned groups
    if (user?.role === 'student') {
      return user.groups?.includes(groupName) || false
    }
    
    return false
  }

  const canDownload = () => {
    return hasPermission('download')
  }

  // Initialize auth state from sessionStorage on app load
  const initializeAuth = () => {
    const storedUser = sessionStorage.getItem('authUser')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        sessionStorage.removeItem('authUser')
      }
    }
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    canAccessGroup,
    canDownload,
    initializeAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
