import { useState, useEffect } from 'react'

const Syllabus = () => {
  const [syllabus, setSyllabus] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [expandedTopics, setExpandedTopics] = useState(new Set())

  useEffect(() => {
    const loadSyllabus = async () => {
      try {
        const response = await fetch('/data/syllabus.json')
        const data = await response.json()
        setSyllabus(data)
      } catch (error) {
        console.error('Error loading syllabus:', error)
        setSyllabus([])
      } finally {
        setLoading(false)
      }
    }

    loadSyllabus()
  }, [])

  const subjects = [...new Set(syllabus.map(item => item.subject))]
  const filteredSyllabus = selectedSubject 
    ? syllabus.filter(item => item.subject === selectedSubject)
    : syllabus

  const toggleTopic = (topicId) => {
    const newExpanded = new Set(expandedTopics)
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId)
    } else {
      newExpanded.add(topicId)
    }
    setExpandedTopics(newExpanded)
  }

  const getProgressColor = (completed, total) => {
    const percentage = (completed / total) * 100
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    if (percentage >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { color: 'bg-green-100 text-green-800', icon: '✓' },
      'in-progress': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'planned': { color: 'bg-blue-100 text-blue-800', icon: '📅' },
      'not-started': { color: 'bg-gray-100 text-gray-800', icon: '⏸️' }
    }

    const config = statusConfig[status] || statusConfig['not-started']
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading syllabus...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Annual Plan & Syllabus</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {syllabus.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Syllabus Data</h3>
          <p className="text-gray-600 mb-6">
            Add your syllabus.json file to the /data folder to display your annual plan.
          </p>
          <div className="text-left max-w-md mx-auto bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Expected format:</p>
            <pre className="text-xs text-gray-600 overflow-x-auto">
{`[
  {
    "id": "1",
    "subject": "Mathematics",
    "unit": "Algebra",
    "topic": "Linear Equations",
    "description": "Solving linear equations...",
    "duration": "2 weeks",
    "status": "completed",
    "startDate": "2024-01-15",
    "endDate": "2024-01-29",
    "resources": ["textbook.pdf"],
    "subtopics": [
      {
        "name": "One Variable",
        "completed": true
      }
    ]
  }
]`}
            </pre>
          </div>
        </div>
      ) : (
        <>
          {/* Progress Overview */}
          {subjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map(subject => {
                const subjectTopics = syllabus.filter(item => item.subject === subject)
                const completedTopics = subjectTopics.filter(item => item.status === 'completed').length
                const totalTopics = subjectTopics.length
                const progressPercentage = (completedTopics / totalTopics) * 100

                return (
                  <div key={subject} className="card">
                    <h3 className="font-semibold text-gray-900 mb-3">{subject}</h3>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{completedTopics} of {totalTopics} topics</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(completedTopics, totalTopics)}`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {subjectTopics.filter(item => item.status === 'in-progress').length} in progress
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Syllabus Timeline */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Syllabus Timeline {selectedSubject && `- ${selectedSubject}`}
            </h3>
            
            <div className="space-y-4">
              {filteredSyllabus.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg">
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleTopic(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">{item.topic}</h4>
                          {getStatusBadge(item.status)}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {item.unit} • {item.duration}
                          {item.startDate && item.endDate && (
                            <span className="ml-2">
                              ({new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="text-gray-400">
                          {expandedTopics.has(item.id) ? '−' : '+'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {expandedTopics.has(item.id) && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="pt-4 space-y-4">
                        {item.description && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                          </div>
                        )}

                        {item.subtopics && item.subtopics.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Subtopics</h5>
                            <ul className="space-y-1">
                              {item.subtopics.map((subtopic, index) => (
                                <li key={index} className="flex items-center text-sm">
                                  <span className={`mr-2 ${subtopic.completed ? 'text-green-500' : 'text-gray-400'}`}>
                                    {subtopic.completed ? '✓' : '○'}
                                  </span>
                                  <span className={subtopic.completed ? 'text-gray-600' : 'text-gray-500'}>
                                    {subtopic.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item.resources && item.resources.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Resources</h5>
                            <ul className="space-y-1">
                              {item.resources.map((resource, index) => (
                                <li key={index} className="flex items-center text-sm text-primary-600">
                                  <span className="mr-2">📎</span>
                                  {resource}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item.objectives && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Learning Objectives</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {item.objectives.map((objective, index) => (
                                <li key={index}>{objective}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Syllabus
