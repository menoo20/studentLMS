import { useState, useEffect } from 'react'

const Resources = () => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await fetch('/data/resources.json')
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
      'drive': '💾'
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
      'drive': 'bg-cyan-100 text-cyan-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading resources...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Resources & Content Hub</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {resources.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resources Data</h3>
          <p className="text-gray-600 mb-6">
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
            <div className="text-sm text-gray-600">
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
              <div key={resource.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResourceTypeColor(resource.type)}`}>
                      {resource.type.toUpperCase()}
                    </span>
                  </div>
                  {resource.size && (
                    <span className="text-xs text-gray-500">{resource.size}</span>
                  )}
                </div>

                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {resource.title}
                </h4>

                {resource.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {resource.description}
                  </p>
                )}

                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
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

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {resource.dateAdded && new Date(resource.dateAdded).toLocaleDateString()}
                  </div>
                  
                  {resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs py-1 px-3"
                    >
                      Open
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
