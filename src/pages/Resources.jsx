import { useState, useEffect } from 'react'
import { useTheme } from '../components/ThemeContext'

const Resources = () => {
  const { theme } = useTheme()
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
                resource.id === 'nesma-study-portal' ? 'border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50' : ''
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

                <h4 className={`font-semibold mb-2 line-clamp-2 ${
                  resource.id === 'nesma-study-portal' ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {resource.title}
                </h4>

                {resource.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {resource.description}
                  </p>
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
                          : 'btn-primary'
                      }`}
                    >
                      {resource.id === 'nesma-study-portal' ? '🚀 Open Portal' : 'Open'}
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
