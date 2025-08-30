
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeContext';

const Layout = ({ children }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Students', href: '/students', icon: '👥' },
    { name: 'Schedule', href: '/schedule', icon: '📅' },
    { name: 'Syllabus', href: '/syllabus', icon: '📚' },
    { name: 'Resources', href: '/resources', icon: '📁' },
  ]

  const { theme, toggleTheme, getThemeStyles } = useTheme();

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
                src="/images/logo.png" 
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
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.name === 'Syllabus' ? '/my-annual-plan/syllabus' : `/my-annual-plan${item.href}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === `/my-annual-plan${item.href}` || 
                      (item.name === 'Syllabus' && location.pathname.startsWith('/my-annual-plan/syllabus'))
                        ? getThemeStyles(
                            'bg-primary-100 text-primary-700',
                            'bg-blackGold-gold text-blackGold-bg',
                            'bg-vibrantGradient-pink text-white shadow-lg'
                          )
                        : getThemeStyles(
                            'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                            'text-blackGold-gold hover:text-blackGold-accent hover:bg-blackGold-bg',
                            'text-vibrantGradient-coral hover:text-white hover:bg-vibrantGradient-pink/20'
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
                  'px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-900 border border-gray-300 hover:bg-primary-100 transition-colors',
                  'px-3 py-2 rounded-md text-sm font-medium bg-blackGold-gold text-blackGold-bg border border-blackGold-gold hover:bg-blackGold-accent transition-colors',
                  'px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-vibrantGradient-pink to-vibrantGradient-coral text-white border border-vibrantGradient-coral hover:from-vibrantGradient-coral hover:to-vibrantGradient-pink transition-all duration-300 shadow-lg'
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
          <div className="flex space-x-1 py-2 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  location.pathname === item.href
                    ? getThemeStyles(
                        'bg-primary-100 text-primary-700',
                        'bg-blackGold-gold text-blackGold-bg',
                        'bg-vibrantGradient-pink text-white'
                      )
                    : getThemeStyles(
                        'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                        'text-blackGold-gold hover:text-blackGold-accent hover:bg-blackGold-bg',
                        'text-vibrantGradient-coral hover:text-white hover:bg-vibrantGradient-pink/20'
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
