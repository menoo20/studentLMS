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
        const response = await fetch('/data/syllabus.json')
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

  const renderAnnualOverview = () => (
    <div className="space-y-6">
      {/* Course Information */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{syllabusData.courseInfo.subject} Course</h3>
            <p className="text-gray-600">{syllabusData.courseInfo.description}</p>
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
            <div className="text-2xl font-bold text-green-600">{syllabusData.progress.completedUnits}</div>
            <div className="text-sm text-green-800">Completed Units</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{syllabusData.progress.totalUnits}</div>
            <div className="text-sm text-purple-800">Total Units</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{syllabusData.progress.percentageComplete}%</div>
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
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{unit.title}</h4>
                      <p className="text-sm text-gray-600">{unit.description}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(unit.status)}`}>
                    {unit.status}
                  </span>
                  <div className="text-sm text-gray-500 mt-1">{unit.duration}</div>
                  <div className="text-xs text-gray-400">Weeks {unit.startWeek}-{unit.endWeek}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Short Courses */}
      {syllabusData.shortCourses && syllabusData.shortCourses.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Short Courses</h3>
          <div className="space-y-3">
            {syllabusData.shortCourses.map(course => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600">{course.description}</p>
                    <div className="text-xs text-gray-500 mt-1">Target: {course.target}</div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">{course.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderUnitDetail = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setViewMode('annual')}
          className="text-primary-600 hover:text-primary-700 flex items-center"
        >
          ← Back to Overview
        </button>
      </div>

      <div className="card">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{selectedUnit.title}</h3>
          <p className="text-gray-600">{selectedUnit.description}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUnit.status)}`}>
              {selectedUnit.status}
            </span>
            <span className="text-sm text-gray-500">{selectedUnit.duration}</span>
            <span className="text-sm text-gray-500">Weeks {selectedUnit.startWeek}-{selectedUnit.endWeek}</span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Learning Objectives</h4>
          <ul className="list-disc list-inside space-y-1">
            {selectedUnit.objectives.map((objective, index) => (
              <li key={index} className="text-sm text-gray-600">{objective}</li>
            ))}
          </ul>
        </div>

        {selectedUnit.weeklyPlan && selectedUnit.weeklyPlan.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Weekly Breakdown</h4>
            <div className="space-y-3">
              {selectedUnit.weeklyPlan.map(week => (
                <div 
                  key={week.week}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 cursor-pointer"
                  onClick={() => {
                    setSelectedWeek(week)
                    setViewMode('weekly')
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Week {week.week}: {week.topic}</h5>
                      <div className="text-sm text-gray-600 mt-1">
                        {week.dailyPlans ? `${week.dailyPlans.length} daily lessons` : 'No daily plan yet'}
                      </div>
                    </div>
                    <div className="text-primary-600">→</div>
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
          className="text-primary-600 hover:text-primary-700 flex items-center"
        >
          ← Back to Unit
        </button>
      </div>

      <div className="card">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Week {selectedWeek.week}: {selectedWeek.topic}</h3>
          <p className="text-gray-600">{selectedUnit.title}</p>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Daily Lesson Plans</h4>
          {selectedWeek.dailyPlans && selectedWeek.dailyPlans.map((day, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="font-medium text-gray-900">{day.day}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Focus</div>
                  <div className="text-sm font-medium">{day.focus}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Activities</div>
                  <div className="text-sm">{day.activities}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Notes</div>
                  <div className="text-sm text-gray-600">{day.notes || 'No notes'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">English Syllabus</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('annual')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'annual' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Annual Plan
          </button>
        </div>
      </div>

      {viewMode === 'annual' && renderAnnualOverview()}
      {viewMode === 'units' && selectedUnit && renderUnitDetail()}
      {viewMode === 'weekly' && selectedWeek && renderWeeklyDetail()}
    </div>
  )
}

export default Syllabus
