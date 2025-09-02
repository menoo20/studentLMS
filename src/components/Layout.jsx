
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Students', href: '/students', icon: '👥' },
    { name: 'Schedule', href: '/schedule', icon: '📅' },
    { name: 'Syllabus', href: '/syllabus', icon: '📚' },
    { name: 'Resources', href: '/resources', icon: '📁' },
  ]

  const { theme, toggleTheme, getThemeStyles } = useTheme();

  const getUserDisplayInfo = () => {
    if (!user) return null;
    
    const roleIcons = {
      admin: '👑',
      student: '🎓', 
      investor: '💼'
    };
    
    const roleNames = {
      admin: 'Administrator',
      student: user.subType === 'longCourse' ? 'Long Course Student' : 'Short Course Student',
      investor: 'Investor'
    };
    
    return {
      icon: roleIcons[user.role] || '👤',
      name: roleNames[user.role] || 'User',
      groups: user.groups?.join(', ') || 'All Groups'
    };
  };

  const displayInfo = getUserDisplayInfo();

  return (
    <div className={getThemeStyles(
      'min-h-screen bg-gray-50',
      'min-h-screen bg-blackGold-bg text-blackGold-white',
      'min-h-screen bg-gradient-to-br from-vibrantGradient-900 via-vibrantGradient-800 to-vibrantGradient-500 text-white'
    )}>
      {/* Header */}
      <header className={getThemeStyles(
        'bg-white shadow-sm border-b border-gray-200',
        'bg-blackGold-bg shadow-sm border-b border-blackGold-gold',
        'bg-gradient-to-r from-vibrantGradient-900/90 to-vibrantGradient-800/90 backdrop-blur-sm shadow-lg border-b border-vibrantGradient-pink/30'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src={`${import.meta.env.PROD ? '/studentLMS' : ''}/images/logo.png`}
                alt="Logo" 
                className="w-8 mr-3"
              />
              <h1 className={getThemeStyles(
                'text-2xl font-bold text-gray-900',
                'text-2xl font-bold text-blackGold-gold',
                'text-2xl font-bold text-vibrantGradient-coral'
              )}>
                Student Management System
              </h1>
            </div>
            
            {/* User Info and Navigation */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              {displayInfo && (
                <div className="hidden sm:flex items-center space-x-3">
                  <div className={getThemeStyles(
                    'bg-blue-50 border border-blue-200 rounded-lg px-3 py-2',
                    'bg-blackGold-gold/20 border border-blackGold-gold rounded-lg px-3 py-2',
                    'bg-vibrantGradient-pink/20 border border-vibrantGradient-coral rounded-lg px-3 py-2'
                  )}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{displayInfo.icon}</span>
                      <div className="text-sm">
                        <div className={getThemeStyles(
                          'font-semibold text-blue-900',
                          'font-semibold text-blackGold-gold',
                          'font-semibold text-white'
                        )}>
                          {displayInfo.name}
                        </div>
                        {user.role === 'student' && (
                          <div className={getThemeStyles(
                            'text-blue-700 text-xs',
                            'text-blackGold-gold/80 text-xs',
                            'text-white/80 text-xs'
                          )}>
                            {displayInfo.groups}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={logout}
                    className={getThemeStyles(
                      'px-3 py-2 rounded-md text-sm font-medium bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors',
                      'px-3 py-2 rounded-md text-sm font-medium bg-red-900/20 text-red-400 border border-red-400 hover:bg-red-900/40 transition-colors',
                      'px-3 py-2 rounded-md text-sm font-medium bg-red-500/20 text-red-200 border border-red-400 hover:bg-red-500/40 transition-colors'
                    )}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
              
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform ${
                      location.pathname === item.href || 
                      (item.name === 'Syllabus' && location.pathname.startsWith('/syllabus'))
                        ? getThemeStyles(
                            'bg-blue-100 text-blue-700 shadow-md scale-105 border-b-2 border-blue-500',
                            'bg-blackGold-gold text-blackGold-bg shadow-lg scale-105 border-b-2 border-blackGold-accent',
                            'bg-vibrantGradient-pink text-white shadow-lg scale-105 border-b-2 border-vibrantGradient-coral'
                          )
                        : getThemeStyles(
                            'text-gray-600 hover:text-blue-700 hover:bg-blue-50 hover:scale-105 hover:shadow-md border-b-2 border-transparent hover:border-blue-300',
                            'text-blackGold-gold hover:text-blackGold-accent hover:bg-blackGold-bg hover:scale-105 hover:shadow-md border-b-2 border-transparent hover:border-blackGold-gold',
                            'text-vibrantGradient-coral hover:text-white hover:bg-vibrantGradient-pink/20 hover:scale-105 hover:shadow-md border-b-2 border-transparent hover:border-vibrantGradient-coral'
                          )
                    }`}
                  >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
                ))}
              </nav>
              <button
                onClick={toggleTheme}
                className={getThemeStyles(
                  'px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-900 border border-gray-300 hover:bg-blue-100 hover:border-blue-400 hover:scale-105 hover:shadow-md transition-all duration-200 transform',
                  'px-3 py-2 rounded-md text-sm font-medium bg-blackGold-gold text-blackGold-bg border border-blackGold-gold hover:bg-blackGold-accent hover:scale-105 hover:shadow-lg transition-all duration-200 transform',
                  'px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-vibrantGradient-pink to-vibrantGradient-coral text-white border border-vibrantGradient-coral hover:from-vibrantGradient-coral hover:to-vibrantGradient-pink hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl transform'
                )}
                aria-label="Toggle theme"
              >
                {getThemeStyles('🌕 Light', '🌑 Black Gold', '� Vibrant')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className={getThemeStyles(
        'md:hidden bg-white border-b border-gray-200',
        'md:hidden bg-blackGold-bg border-b border-blackGold-gold',
        'md:hidden bg-gradient-to-r from-vibrantGradient-900/80 to-vibrantGradient-800/80 border-b border-vibrantGradient-pink/30'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Mobile User Info */}
          {displayInfo && (
            <div className="sm:hidden py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{displayInfo.icon}</span>
                  <div className="text-sm">
                    <div className={getThemeStyles(
                      'font-semibold text-gray-900',
                      'font-semibold text-blackGold-gold',
                      'font-semibold text-white'
                    )}>
                      {displayInfo.name}
                    </div>
                    {user.role === 'student' && (
                      <div className={getThemeStyles(
                        'text-gray-600 text-xs',
                        'text-blackGold-gold/80 text-xs',
                        'text-white/80 text-xs'
                      )}>
                        {displayInfo.groups}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className={getThemeStyles(
                    'px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors',
                    'px-2 py-1 rounded text-xs font-medium bg-red-900/20 text-red-400 border border-red-400 hover:bg-red-900/40 transition-colors',
                    'px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-200 border border-red-400 hover:bg-red-500/40 transition-colors'
                  )}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
          
          <div className="flex space-x-1 py-2 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 transform ${
                  location.pathname === item.href
                    ? getThemeStyles(
                        'bg-blue-100 text-blue-700 shadow-md scale-105 border-l-4 border-blue-500',
                        'bg-blackGold-gold text-blackGold-bg shadow-lg scale-105 border-l-4 border-blackGold-accent',
                        'bg-vibrantGradient-pink text-white shadow-lg scale-105 border-l-4 border-vibrantGradient-coral'
                      )
                    : getThemeStyles(
                        'text-gray-600 hover:text-blue-700 hover:bg-blue-50 hover:scale-105 hover:shadow-md border-l-4 border-transparent hover:border-blue-300',
                        'text-blackGold-gold hover:text-blackGold-accent hover:bg-blackGold-bg hover:scale-105 hover:shadow-md border-l-4 border-transparent hover:border-blackGold-gold',
                        'text-vibrantGradient-coral hover:text-white hover:bg-vibrantGradient-pink/20 hover:scale-105 hover:shadow-md border-l-4 border-transparent hover:border-vibrantGradient-coral'
                      )
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
  </div>
  )
}

export default Layout
