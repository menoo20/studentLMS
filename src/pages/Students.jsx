import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../components/ThemeContext'

const Students = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [groups, setGroups] = useState([])
  const [allGroups, setAllGroups] = useState([]) // Store all groups for future use
  const [marks, setMarks] = useState([])
  const [exams, setExams] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load data from JSON files
    const loadData = async () => {
      try {
        const basePath = import.meta.env.PROD ? '/my-annual-plan' : ''
        const [studentsRes, groupsRes, marksRes, examsRes, configRes] = await Promise.all([
          fetch(`${basePath}/data/students.json`).catch(() => ({ json: () => [] })),
          fetch(`${basePath}/data/groups.json`).catch(() => ({ json: () => [] })),
          fetch(`${basePath}/data/marks.json`).catch(() => ({ json: () => [] })),
          fetch(`${basePath}/data/exams.json`).catch(() => ({ json: () => [] })),
          fetch(`${basePath}/data/teaching_config.json`).catch(() => ({ json: () => ({ activeGroups: [] }) })),
        ])

        const studentsData = await studentsRes.json()
        const groupsData = await groupsRes.json()
        const marksData = await marksRes.json()
        const examsData = await examsRes.json()
        const configData = await configRes.json()

        // Filter groups to show only active ones
        const activeGroupIds = configData.activeGroups || []
        const activeGroups = groupsData.filter(group => activeGroupIds.includes(group.id))

        setStudents(studentsData)
        setAllGroups(groupsData) // Store all groups for future use
        setGroups(activeGroups) // Show only active groups
        setMarks(marksData)
        setExams(examsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredStudents = selectedGroup
    ? students.filter(student => student.groupId === selectedGroup)
    : students.filter(student => {
        // Only show students from active groups
        const activeGroupIds = groups.map(g => g.id)
        return activeGroupIds.includes(student.groupId)
      })

  const handlePlacementTestClick = (student) => {
    // Navigate to Resources page with NESMA group filter
    navigate('/resources?group=nesma')
  }

  const getStudentMarks = (studentId) => {
    return marks.filter(mark => mark.studentId === studentId)
  }

  const getStudentAverage = (studentId) => {
    const studentMarks = getStudentMarks(studentId)
    if (studentMarks.length === 0) return 0
    
    // Calculate percentage-based average
    const percentages = studentMarks.map(mark => {
      const exam = exams.find(e => e.id === mark.examId)
      return exam ? (mark.score / exam.maxScore) * 100 : 0
    })
    
    const total = percentages.reduce((sum, percentage) => sum + percentage, 0)
    return (total / percentages.length).toFixed(1)
  }

  const getExamAverage = (examId) => {
    const examMarks = marks.filter(mark => mark.examId === examId)
    if (examMarks.length === 0) return 0
    
    const exam = exams.find(e => e.id === examId)
    if (!exam) return 0
    
    // Calculate percentage-based average
    const percentages = examMarks.map(mark => (mark.score / exam.maxScore) * 100)
    const total = percentages.reduce((sum, percentage) => sum + percentage, 0)
    return (total / percentages.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className={`text-lg ${theme === 'blackGold' ? 'text-white' : 'text-gray-600'}`}>Loading student data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-900'}`}>Student Progress</h2>
      </div>

      {students.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className={`text-xl font-semibold mb-2 ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-900'}`}>No Student Data</h3>
          <p className={`mb-6 ${theme === 'blackGold' ? 'text-blackGold-500/80' : 'text-gray-600'}`}>
            Add your students.json file to the /data folder to get started.
          </p>
          <div className="text-left max-w-md mx-auto bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Expected format:</p>
            <pre className="text-xs text-gray-600 overflow-x-auto">
{`[
  {
    "id": "1",
    "name": "John Doe",
    "groupId": "group1",
    "email": "john@example.com"
  }
]`}
            </pre>
          </div>
        </div>
      ) : (
        <>
          {/* Groups Overview */}
          {groups.length > 0 && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Currently Taught Groups</h3>
                <div className="flex items-center text-sm text-blue-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Showing {groups.length} active groups
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groups.map(group => {
                  const groupStudents = students.filter(s => s.groupId === group.id)
                  return (
                    <div
                      key={group.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedGroup === group.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedGroup(selectedGroup === group.id ? '' : group.id)}
                    >
                      <div className="font-medium text-gray-900">{group.name}</div>
                      <div className="text-sm text-blue-600 font-medium">{group.position}</div>
                      <div className="text-sm text-gray-600">{groupStudents.length} students</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Student Marks Section */}
          {!selectedGroup ? (
            /* Guidance Message when no group is selected */
            <div className="card text-center py-16">
              <div className="text-6xl mb-6">👆</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Select a Group to View Students</h3>
              <p className="text-lg mb-6 text-gray-600">
                Click on any group above to see the students and their marks
              </p>
              <div className="flex justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                  Selected Group
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>
                  Available Groups
                </div>
              </div>
            </div>
          ) : (
            /* Marks Table when group is selected */
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${theme === 'blackGold' ? 'text-white' : 'text-gray-900'}`}>
                  Student Marks - {groups.find(g => g.id === selectedGroup)?.name}
                </h3>
              </div>

              {/* Quick Access Buttons for Selected Group */}
              {selectedGroup && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">📚 Quick Access</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        const groupName = groups.find(g => g.id === selectedGroup)?.name || selectedGroup
                        navigate(`/resources?group=${encodeURIComponent(groupName)}`)
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                    >
                      <span className="text-lg">📚</span>
                      <span className="font-medium">My Resources</span>
                      <span className="text-xs opacity-75">Study materials & portal</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        const groupName = groups.find(g => g.id === selectedGroup)?.name || selectedGroup
                        navigate(`/schedule?highlight=${encodeURIComponent(groupName)}`)
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                    >
                      <span className="text-lg">📅</span>
                      <span className="font-medium">My Schedule</span>
                      <span className="text-xs opacity-75">Classes & progress</span>
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    💡 Access your personalized content and track your course progress
                  </p>
                </div>
              )}
              
              {exams.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No exams data available. Add exams.json to display marks.</p>
                </div>
              ) : (
                <div className="overflow-x-auto" dir="rtl">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="table-header px-6 py-3 text-right">Student</th>
                        {exams.map(exam => (
                          <th key={exam.id} className="table-header px-6 py-3 text-center">
                            {exam.name}
                            <br />
                            <span className="text-xs font-normal text-gray-500">
                              Max: {exam.maxScore} | Avg: {getExamAverage(exam.id)}%
                            </span>
                          </th>
                        ))}
                        <th className="table-header px-6 py-3 text-center">Average (%)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="font-medium text-gray-900">{student.name}</div>
                          </td>
                          {exams.map(exam => {
                            const mark = marks.find(m => m.studentId === student.id && m.examId === exam.id)
                            const percentage = mark ? Math.round((mark.score / exam.maxScore) * 100) : 0
                            
                            // Check if this is a placement test mark for a NESMA student
                            const isNESMAPlacementTest = exam.type === 'placement' && student.groupId === 'nesma' && mark
                            
                            return (
                              <td key={exam.id} className="px-6 py-4 text-center">
                                <span 
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    mark ? (
                                      percentage >= 80 ? 'bg-green-100 text-green-800' :
                                      percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    ) : 'bg-gray-100 text-gray-800'
                                  } ${isNESMAPlacementTest ? 'cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 border-2 border-blue-300 hover:border-blue-500' : ''}`}
                                  onClick={isNESMAPlacementTest ? () => handlePlacementTestClick(student) : undefined}
                                  title={isNESMAPlacementTest ? 'Click to view NESMA Study Portal with placement test analysis' : undefined}
                                >
                                  {mark ? `${mark.score}/${exam.maxScore}` : '-'}
                                  {isNESMAPlacementTest && (
                                    <span className="ml-1 text-blue-600">🔗</span>
                                  )}
                                </span>
                                {mark && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {percentage}%
                                    {isNESMAPlacementTest && (
                                      <div className="text-xs text-blue-600 font-medium">
                                        Click for Study Portal
                                      </div>
                                    )}
                                  </div>
                                )}
                              </td>
                            )
                          })}
                          <td className="px-6 py-4 text-center font-medium">
                            {getStudentAverage(student.id)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Students
