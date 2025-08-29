
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

  const { theme, toggleTheme } = useTheme();

  return (
    <div className={theme === 'blackGold' ? 'min-h-screen bg-blackGold-bg text-blackGold-white' : 'min-h-screen bg-gray-50'}>
      {/* Header */}
      <header className={theme === 'blackGold' ? 'bg-blackGold-bg shadow-sm border-b border-blackGold-gold' : 'bg-white shadow-sm border-b border-gray-200'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/images/logo.png" 
                alt="Logo" 
                className="w-8 mr-3"
              />
              <h1 className={theme === 'blackGold' ? 'text-2xl font-bold text-blackGold-gold' : 'text-2xl font-bold text-gray-900'}>
                Student Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? (theme === 'blackGold' ? 'bg-blackGold-gold text-blackGold-bg' : 'bg-primary-100 text-primary-700')
                        : (theme === 'blackGold' ? 'text-blackGold-gold hover:text-blackGold-accent hover:bg-blackGold-bg' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
                    }`}
                  >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
                ))}
              </nav>
              <button
                onClick={toggleTheme}
                className={theme === 'blackGold'
                  ? 'px-3 py-2 rounded-md text-sm font-medium bg-blackGold-gold text-blackGold-bg border border-blackGold-gold hover:bg-blackGold-accent transition-colors'
                  : 'px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-900 border border-gray-300 hover:bg-primary-100 transition-colors'}
                aria-label="Toggle theme"
              >
                {theme === 'blackGold' ? '🌑 Black Gold' : '🌕 Light'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex space-x-1 py-2 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
