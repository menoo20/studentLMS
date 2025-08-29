import { useState, useEffect } from 'react'

const Syllabus = () => {
  const [syllabusData, setSyllabusData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [viewMode, setViewMode] = useState('annual') // 'annual', 'units', 'weekly', 'daily'

  useEffect(() => {
    const loadSyllabus = async () => {
      try {
        const response = await fetch('/my-annual-plan/data/syllabus_jolly_phonics.json')
        const data = await response.json()
        setSyllabusData(data)
      } catch (error) {
        console.error('Error loading syllabus:', error)
        setSyllabusData(null)
      } finally {
        setLoading(false)
      }
    }

    loadSyllabus()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading syllabus...</div>
      </div>
    )
  }

  if (!syllabusData) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Syllabus Data</h3>
        <p className="text-gray-600">Add your syllabus.json file to get started.</p>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'planned': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderAnnualOverview = () => {
    // Calculate progress from units
    const completedUnits = syllabusData.units.filter(unit => unit.status === 'completed').length
    const totalUnits = syllabusData.units.length
    const percentageComplete = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0

    return (
      <div className="space-y-6">
        {/* Course Information */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{syllabusData.courseInfo.subject}</h3>
              <p className="text-gray-600">{syllabusData.courseInfo.description}</p>
              {syllabusData.courseInfo.methodology && (
                <p className="text-sm text-blue-600 mt-1">📚 {syllabusData.courseInfo.methodology}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Academic Year</div>
              <div className="font-medium">{syllabusData.courseInfo.academicYear}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{syllabusData.courseInfo.totalWeeks}</div>
              <div className="text-sm text-blue-800">Total Weeks</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedUnits}</div>
              <div className="text-sm text-green-800">Completed Units</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{totalUnits}</div>
              <div className="text-sm text-purple-800">Total Units</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{percentageComplete}%</div>
              <div className="text-sm text-orange-800">Progress</div>
            </div>
          </div>
        </div>

        {/* Units Timeline */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Units Timeline</h3>
          <div className="space-y-4">
            {syllabusData.units.map((unit, index) => (
              <div 
                key={unit.id} 
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 cursor-pointer transition-all"
                onClick={() => {
                  setSelectedUnit(unit)
                  setViewMode('units')
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{unit.title}</h4>
                      <p className="text-sm text-gray-600">{unit.description}</p>
                      {unit.phonics_groups && (
                        <div className="mt-1">
                          <span className="text-xs text-blue-600">
                            🔤 Phonics Groups: {unit.phonics_groups.map(g => g.group_id).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-4">
                    <div>
                      <div className="text-sm text-gray-500">{unit.duration}</div>
                      <div className="text-xs text-gray-400">Weeks {unit.startWeek}-{unit.endWeek}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                      {unit.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Short Courses */}
        {syllabusData.shortCourses && syllabusData.shortCourses.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Short Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {syllabusData.shortCourses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.priority === 'high' ? 'bg-red-100 text-red-800' : 
                      course.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {course.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                  <div className="text-xs text-gray-500">
                    📅 {course.schedule} • ⏱️ {course.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderUnitDetail = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setViewMode('annual')}
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          ← Back to Overview
        </button>
      </div>

      <div className="card">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{selectedUnit.title}</h3>
          <p className="text-gray-600">{selectedUnit.description}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedUnit.status)}`}>
              {selectedUnit.status}
            </span>
            <span className="text-sm text-gray-500">{selectedUnit.duration}</span>
            <span className="text-sm text-gray-500">Weeks {selectedUnit.startWeek}-{selectedUnit.endWeek}</span>
          </div>
        </div>

        {/* Learning Objectives */}
        {selectedUnit.objectives && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Learning Objectives</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {selectedUnit.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Phonics Groups */}
        {selectedUnit.phonics_groups && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Phonics Groups</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedUnit.phonics_groups.map((group) => (
                <div key={group.group_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-2">Group {group.group_id}</div>
                  <div className="text-sm text-gray-600 mb-2">{group.focus}</div>
                  <div className="flex flex-wrap gap-1">
                    {group.sounds.map((sound, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">
                        {sound}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Plan */}
        {selectedUnit.weeklyPlan && selectedUnit.weeklyPlan.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Weekly Plan</h4>
            <div className="space-y-4">
              {selectedUnit.weeklyPlan.map((week) => (
                <div 
                  key={week.week} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 cursor-pointer transition-all"
                  onClick={() => {
                    setSelectedWeek(week)
                    setViewMode('weekly')
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Week {week.week}: {week.topic}</h5>
                      <p className="text-sm text-gray-600">{week.focus}</p>
                      {week.workplace_vocabulary && (
                        <div className="mt-2">
                          <span className="text-xs text-green-600">
                            📝 Vocabulary: {week.workplace_vocabulary.slice(0, 3).join(', ')}
                            {week.workplace_vocabulary.length > 3 && ` +${week.workplace_vocabulary.length - 3} more`}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-gray-400">→</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderWeeklyDetail = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setViewMode('units')}
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          ← Back to Unit
        </button>
      </div>

      <div className="card">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Week {selectedWeek.week}: {selectedWeek.topic}</h3>
          <p className="text-gray-600">{selectedWeek.focus}</p>
        </div>

        {/* Week Overview */}
        {selectedWeek.workplace_vocabulary && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Workplace Vocabulary</h4>
            <div className="flex flex-wrap gap-2">
              {selectedWeek.workplace_vocabulary.map((word, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedWeek.tricky_words && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Tricky Words</h4>
            <div className="flex flex-wrap gap-2">
              {selectedWeek.tricky_words.map((word, index) => (
                <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Daily Plans */}
        {selectedWeek.dailyPlans && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Daily Plans</h4>
            <div className="space-y-4">
              {selectedWeek.dailyPlans.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">{day.day}</h5>
                    <div className="text-sm text-gray-500">{day.focus}</div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{day.activities}</p>
                  {day.notes && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      📝 Notes: {day.notes || "No notes yet"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Syllabus</h1>
        <p className="text-gray-600">Track your annual teaching plan and daily progress</p>
      </div>

      {viewMode === 'annual' && renderAnnualOverview()}
      {viewMode === 'units' && selectedUnit && renderUnitDetail()}
      {viewMode === 'weekly' && selectedWeek && renderWeeklyDetail()}
    </div>
  )
}

export default Syllabus
