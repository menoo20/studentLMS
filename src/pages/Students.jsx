import { useState, useEffect } from 'react'

const Students = () => {
  const [students, setStudents] = useState([])
  const [groups, setGroups] = useState([])
  const [marks, setMarks] = useState([])
  const [exams, setExams] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load data from JSON files
    const loadData = async () => {
      try {
        const [studentsRes, groupsRes, marksRes, examsRes] = await Promise.all([
          fetch('/data/students.json').catch(() => ({ json: () => [] })),
          fetch('/data/groups.json').catch(() => ({ json: () => [] })),
          fetch('/data/marks.json').catch(() => ({ json: () => [] })),
          fetch('/data/exams.json').catch(() => ({ json: () => [] })),
        ])

        const studentsData = await studentsRes.json()
        const groupsData = await groupsRes.json()
        const marksData = await marksRes.json()
        const examsData = await examsRes.json()

        setStudents(studentsData)
        setGroups(groupsData)
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
    : students

  const getStudentMarks = (studentId) => {
    return marks.filter(mark => mark.studentId === studentId)
  }

  const getStudentAverage = (studentId) => {
    const studentMarks = getStudentMarks(studentId)
    if (studentMarks.length === 0) return 0
    const total = studentMarks.reduce((sum, mark) => sum + mark.score, 0)
    return (total / studentMarks.length).toFixed(1)
  }

  const getExamAverage = (examId) => {
    const examMarks = marks.filter(mark => mark.examId === examId)
    if (examMarks.length === 0) return 0
    const total = examMarks.reduce((sum, mark) => sum + mark.score, 0)
    return (total / examMarks.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading student data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Student Progress</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a Group...</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Student Data</h3>
          <p className="text-gray-600 mb-6">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Groups</h3>
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
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Select a Group to View Students</h3>
              <p className="text-lg text-gray-600 mb-6">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Student Marks - {groups.find(g => g.id === selectedGroup)?.name}
              </h3>
              
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
                              Avg: {getExamAverage(exam.id)}
                            </span>
                          </th>
                        ))}
                        <th className="table-header px-6 py-3 text-center">Average</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.position}</div>
                          </td>
                          {exams.map(exam => {
                            const mark = marks.find(m => m.studentId === student.id && m.examId === exam.id)
                            return (
                              <td key={exam.id} className="px-6 py-4 text-center">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  mark ? (
                                    mark.score >= 80 ? 'bg-green-100 text-green-800' :
                                    mark.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  ) : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {mark ? mark.score : '-'}
                                </span>
                              </td>
                            )
                          })}
                          <td className="px-6 py-4 text-center font-medium">
                            {getStudentAverage(student.id)}
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
