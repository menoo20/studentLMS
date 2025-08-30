import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTheme } from '../components/ThemeContext'

const Resources = () => {
  const { theme } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadResources = async () => {
      try {
        const basePath = import.meta.env.PROD ? '/my-annual-plan' : ''
        const response = await fetch(`${basePath}/data/resources.json`)
        const data = await response.json()
        setResources(data)
      } catch (error) {
        console.error('Error loading resources:', error)
        setResources([])
      } finally {
        setLoading(false)
      }
    }

    loadResources()
  }, [])

  // Handle URL parameters for group filtering
  useEffect(() => {
    const groupParam = searchParams.get('group')
    if (groupParam) {
      // If NESMA group is specified, filter to show NESMA-related resources
      if (groupParam.toLowerCase().includes('nesma')) {
        setSearchTerm('nesma')
      }
    }
  }, [searchParams])

  const categories = [...new Set(resources.map(item => item.category))]
  
  const filteredResources = resources.filter(resource => {
    const matchesCategory = !selectedCategory || resource.category === selectedCategory
    const matchesSearch = !searchTerm || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const getResourceIcon = (type) => {
    const icons = {
      'pdf': '📄',
      'video': '🎥',
      'link': '🔗',
      'book': '📚',
      'document': '📝',
      'presentation': '📊',
      'image': '🖼️',
      'audio': '🎵',
      'folder': '📁',
      'drive': '💾',
      'portal': '🌐'
    }
    return icons[type] || '📎'
  }

  const getResourceTypeColor = (type) => {
    const colors = {
      'pdf': 'bg-red-100 text-red-800',
      'video': 'bg-purple-100 text-purple-800',
      'link': 'bg-blue-100 text-blue-800',
      'book': 'bg-green-100 text-green-800',
      'document': 'bg-gray-100 text-gray-800',
      'presentation': 'bg-orange-100 text-orange-800',
      'image': 'bg-pink-100 text-pink-800',
      'audio': 'bg-yellow-100 text-yellow-800',
      'folder': 'bg-indigo-100 text-indigo-800',
      'drive': 'bg-cyan-100 text-cyan-800',
      'portal': 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className={`text-lg ${theme === 'blackGold' ? 'text-white' : 'text-gray-600'}`}>Loading resources...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className={`text-2xl font-bold ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-900'}`}>Resources & Content Hub</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      {resources.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">No Resources Data</h3>
          <p className={`mb-6 ${theme === 'blackGold' ? 'text-gray-600' : 'text-gray-600'}`}>
            Add your resources.json file to the /data folder to display your educational resources.
          </p>
          <div className="text-left max-w-md mx-auto bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Expected format:</p>
            <pre className="text-xs text-gray-600 overflow-x-auto">
{`[
  {
    "id": "1",
    "title": "Curriculum Guide",
    "description": "Official curriculum guide",
    "category": "Curriculum",
    "type": "pdf",
    "url": "https://drive.google.com/...",
    "tags": ["official", "guide"],
    "dateAdded": "2024-01-15",
    "size": "2.5 MB"
  }
]`}
            </pre>
          </div>
        </div>
      ) : (
        <>
          {/* Categories Overview */}
          {categories.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {categories.map(category => {
                  const categoryCount = resources.filter(r => r.category === category).length
                  return (
                    <div
                      key={category}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                        selectedCategory === category
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                    >
                      <div className="font-medium text-gray-900 text-sm">{category}</div>
                      <div className="text-xs text-gray-600">{categoryCount} items</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Search Results Info */}
          <div className="flex items-center justify-between">
            <div className={`text-sm ${theme === 'blackGold' ? 'text-white' : 'text-gray-600'}`}>
              Showing {filteredResources.length} of {resources.length} resources
              {selectedCategory && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
            {(selectedCategory || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setSearchTerm('')
                }}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <div key={resource.id} className={`card hover:shadow-lg transition-shadow ${
                resource.id === 'nesma-study-portal' ? 'border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50' : 
                resource.id === 'jolly-phonics-youtube' ? 'border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-red-50' : 
                resource.id === 'pronunciation-practice-website' ? 'border-2 border-green-300 bg-gradient-to-br from-green-50 to-blue-50' : ''
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResourceTypeColor(resource.type)}`}>
                      {resource.type.toUpperCase()}
                    </span>
                    {resource.accessLevel === 'restricted' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        🔒 RESTRICTED
                      </span>
                    )}
                  </div>
                  {resource.size && (
                    <span className="text-xs text-gray-500">{resource.size}</span>
                  )}
                </div>

                <h4 className={`font-semibold mb-2 line-clamp-2 flex items-center gap-2 ${
                  resource.id === 'nesma-study-portal' ? 'text-blue-900' : 
                  resource.id === 'jolly-phonics-youtube' ? 'text-purple-900' : 'text-gray-900'
                }`}>
                  {resource.id === 'jolly-phonics-youtube' && (
                    <img 
                      src={`${import.meta.env.PROD ? '/my-annual-plan' : ''}/images/speak_3069810.png`}
                      alt="Speaking icon"
                      className="w-5 h-5"
                    />
                  )}
                  {resource.title}
                </h4>

                {resource.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {resource.description}
                  </p>
                )}

                {/* YouTube Playlist Thumbnail and Features */}
                {resource.id === 'jolly-phonics-youtube' && (
                  <div className="mb-4 space-y-3">
                    {/* Clickable Thumbnail */}
                    <a 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-red-50 to-purple-50 border border-red-200 cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gray-200 relative overflow-hidden">
                          <img 
                            src={`${import.meta.env.PROD ? '/my-annual-plan' : ''}/images/hqdefault.avif`}
                            alt="Jolly Phonics YouTube Playlist Thumbnail"
                            className="w-full h-full object-cover"
                          />
                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity">
                            <div className="bg-red-600 rounded-full p-3 shadow-lg">
                              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                          YouTube
                        </div>
                      </div>
                    </a>
                    
                    {/* Curriculum Connection */}
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 text-center">
                      <p className="text-sm font-medium text-purple-900 mb-2">📚 Jolly Phonics Foundation Month</p>
                      <Link 
                        to="/syllabus" 
                        className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        📖 View in Syllabus (Weeks 1-4) →
                      </Link>
                    </div>
                  </div>
                )}

                {/* New Headway Complete Package Features */}
                {resource.id === 'new-headway-complete-package' && (
                  <div className="mb-4 space-y-3">
                    {/* Package Thumbnail */}
                    <a 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gray-200 relative overflow-hidden">
                          <img 
                            src={`${import.meta.env.PROD ? '/my-annual-plan' : ''}/images/curriculum.jpg`}
                            alt="New Headway Complete Learning Package"
                            className="w-full h-full object-cover"
                          />
                          {/* Download overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                            <div className="bg-blue-600 rounded-full p-3 shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                          Google Drive
                        </div>
                      </div>
                    </a>
                    
                    {/* Package Contents */}
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-2">📦 Complete Package Includes:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                        <div className="flex items-center gap-1">
                          <span>📖</span> Student Book
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📝</span> Workbook
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🎵</span> Audio Files
                        </div>
                        <div className="flex items-center gap-1">
                          <span>💻</span> iTutor Program
                        </div>
                      </div>
                    </div>
                    
                    {/* Curriculum Connection */}
                    <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 text-center">
                      <p className="text-sm font-medium text-green-900 mb-2">📚 Primary Materials for Foundational English</p>
                      <Link 
                        to="/syllabus/jolly-phonics" 
                        className="inline-block bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        📖 View Course Syllabus (52 weeks) →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Special Pronunciation Practice Website Features */}
                {resource.id === 'pronunciation-practice-website' && resource.specialFeatures && (
                  <div className="mb-4 space-y-3">
                    {/* Website Preview */}
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block relative overflow-hidden rounded-lg border-2 border-green-300 hover:border-green-400 transition-colors group"
                    >
                      <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <span className="text-3xl mr-2">🎙️</span>
                          <span className="text-lg font-bold text-green-800">Interactive Pronunciation Practice</span>
                        </div>
                        <p className="text-sm text-green-700 mb-2">UK & US English • Voice Recognition • Interactive Quizzes</p>
                        <div className="inline-flex items-center justify-center bg-green-600 group-hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                          🌐 Practice Now
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2m8 0h2a2 2 0 012 2v2M9 12h6m-3-3v6" />
                          </svg>
                        </div>
                        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                          Interactive
                        </div>
                      </div>
                    </a>
                    
                    {/* Accent Variations */}
                    <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <h5 className="text-sm font-semibold text-green-900 mb-2">🗣️ Accent Variations</h5>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {resource.specialFeatures.accentVariations.map((accent, index) => (
                          <span key={index} className="bg-white border border-green-300 text-green-800 px-2 py-1 rounded-full font-medium">
                            {accent}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Learning Features */}
                    <div className="p-3 bg-white rounded-lg border border-blue-200">
                      <h5 className="text-sm font-semibold text-blue-900 mb-2">✨ Learning Features</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-50 p-2 rounded">
                          <span className="font-medium text-blue-800">🎯 Voice Recognition</span>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <span className="font-medium text-green-800">📊 Progress Tracking</span>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <span className="font-medium text-purple-800">🎮 Interactive Quizzes</span>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <span className="font-medium text-yellow-800">🔄 Repeat Practice</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Special NESMA Portal Features */}
                {resource.id === 'nesma-study-portal' && resource.specialFeatures && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200">
                    <h5 className="text-sm font-semibold text-blue-900 mb-2">📊 Placement Test Results</h5>
                    <div className="space-y-2 text-xs">
                      {Object.entries(resource.specialFeatures.placementTestResults).map(([student, data]) => (
                        <div key={student} className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">{student}</span>
                          <span className={`px-2 py-1 rounded-full font-medium ${
                            parseFloat(data.percentage) >= 50 ? 'bg-green-100 text-green-800' : 
                            parseFloat(data.percentage) >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {data.score} ({data.percentage})
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-blue-100">
                      <p className="text-xs text-blue-700">
                        ✨ Includes: Analysis, corrections, and personalized study plans
                      </p>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                    resource.category === 'Student Portal' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {resource.category}
                  </span>
                </div>

                {resource.tags && resource.tags.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{resource.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Show eligible students for restricted access */}
                {resource.eligibleStudents && (
                  <div className="mb-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs font-medium text-yellow-800 mb-1">👥 Eligible Students:</p>
                    <div className="text-xs text-yellow-700">
                      {resource.eligibleStudents.slice(0, 2).map((student, index) => (
                        <span key={index}>{student}{index < Math.min(1, resource.eligibleStudents.length - 1) ? ', ' : ''}</span>
                      ))}
                      {resource.eligibleStudents.length > 2 && (
                        <span> +{resource.eligibleStudents.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {resource.dateAdded && new Date(resource.dateAdded).toLocaleDateString()}
                  </div>
                  
                  {resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs py-1 px-3 rounded ${
                        resource.id === 'nesma-study-portal' 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                          : resource.id === 'jolly-phonics-youtube'
                          ? 'bg-gradient-to-r from-red-500 to-purple-500 text-white hover:from-red-600 hover:to-purple-600 flex items-center gap-1'
                          : 'btn-primary'
                      }`}
                    >
                      {resource.id === 'nesma-study-portal' ? '🚀 Open Portal' : 
                       resource.id === 'jolly-phonics-youtube' ? '▶️ Watch Playlist' : 'Open'}
                    </a>
                  ) : (
                    <button className="btn-secondary text-xs py-1 px-3" disabled>
                      No Link
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or browse different categories.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Resources
