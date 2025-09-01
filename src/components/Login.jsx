import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../components/ThemeContext'

const Login = () => {
  const { theme } = useTheme()
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStudentType, setSelectedStudentType] = useState('')
  const [credential, setCredential] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = login(selectedRole, credential, selectedStudentType)
      
      if (!result.success) {
        setError(result.error)
      }
      // If successful, the AuthProvider will handle the state change
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedRole('')
    setSelectedStudentType('')
    setCredential('')
    setError('')
  }

  const getCredentialLabel = () => {
    if (selectedRole === 'admin') return 'Admin Password'
    if (selectedRole === 'student') return 'Access Key'
    if (selectedRole === 'investor') return 'Investor Access Key'
    return 'Credential'
  }

  const getWelcomeMessage = () => {
    switch (selectedRole) {
      case 'admin':
        return 'Welcome back, Administrator! You have full access to all features.'
      case 'student':
        if (selectedStudentType === 'longCourse') {
          return 'Long Course Student Access - You can view and download materials for SAM and SAIPEM groups.'
        } else if (selectedStudentType === 'shortCourse') {
          return 'Short Course Student Access - You can view and download materials for NESMA group.'
        }
        return 'Please select your course type.'
      case 'investor':
        return 'Investor Preview - You can explore all content but downloading requires premium access.'
      default:
        return 'Please select your role to continue.'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className={`text-3xl font-bold ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-900'}`}>
            Access Control
          </h2>
          <p className={`mt-2 text-sm ${theme === 'blackGold' ? 'text-white' : 'text-gray-600'}`}>
            Please identify yourself to access the platform
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {/* Role Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'blackGold' ? 'text-white' : 'text-gray-700'}`}>
              Select Your Role
            </label>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin')
                  setSelectedStudentType('')
                  setCredential('')
                  setError('')
                }}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRole === 'admin'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👑</span>
                  <div>
                    <div className="font-semibold">Administrator</div>
                    <div className="text-sm opacity-75">Full access to all features</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('student')
                  setSelectedStudentType('')
                  setCredential('')
                  setError('')
                }}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRole === 'student'
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <div className="font-semibold">Student</div>
                    <div className="text-sm opacity-75">Access course materials</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('investor')
                  setSelectedStudentType('')
                  setCredential('')
                  setError('')
                }}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRole === 'investor'
                    ? 'border-purple-500 bg-purple-50 text-purple-900'
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💼</span>
                  <div>
                    <div className="font-semibold">Investor</div>
                    <div className="text-sm opacity-75">Preview access to explore courses</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Student Type Selection */}
          {selectedRole === 'student' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'blackGold' ? 'text-white' : 'text-gray-700'}`}>
                Course Type
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudentType('longCourse')
                    setCredential('')
                    setError('')
                  }}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    selectedStudentType === 'longCourse'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📚</span>
                    <div>
                      <div className="font-semibold">Long Course</div>
                      <div className="text-sm opacity-75">SAM, SAIPEM groups</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudentType('shortCourse')
                    setCredential('')
                    setError('')
                  }}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    selectedStudentType === 'shortCourse'
                      ? 'border-orange-500 bg-orange-50 text-orange-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📖</span>
                    <div>
                      <div className="font-semibold">Short Course</div>
                      <div className="text-sm opacity-75">NESMA group</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Credential Input */}
          {selectedRole && (selectedRole !== 'student' || selectedStudentType) && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'blackGold' ? 'text-white' : 'text-gray-700'}`}>
                {getCredentialLabel()}
              </label>
              <input
                type="password"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter your ${getCredentialLabel().toLowerCase()}`}
                required
              />
            </div>
          )}

          {/* Welcome Message */}
          {selectedRole && (
            <div className={`p-3 rounded-lg ${
              selectedRole === 'admin' ? 'bg-blue-50 border border-blue-200' :
              selectedRole === 'student' ? 'bg-green-50 border border-green-200' :
              'bg-purple-50 border border-purple-200'
            }`}>
              <p className={`text-sm ${
                selectedRole === 'admin' ? 'text-blue-800' :
                selectedRole === 'student' ? 'text-green-800' :
                'text-purple-800'
              }`}>
                {getWelcomeMessage()}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {selectedRole && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset
              </button>
            )}
            
            <button
              type="submit"
              disabled={!selectedRole || (selectedRole === 'student' && !selectedStudentType) || !credential || isLoading}
              className="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Access Platform'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
