import React, { useState, useEffect } from 'react'

// Reports Content Component
const ReportsContent = ({ reportData }) => {
  return (
    <div className="space-y-6">
      {/* Group Info Header */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">
          📊 {reportData.groupInfo.name} Report
        </h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Students: </span>
            <span className="font-medium">{reportData.students.length}</span>
          </div>
          <div>
            <span className="text-blue-700">Exams: </span>
            <span className="font-medium">{reportData.exams.length}</span>
          </div>
          <div>
            <span className="text-blue-700">Group Average: </span>
            <span className="font-medium">
              {reportData.students.length > 0 
                ? (reportData.students.reduce((sum, s) => sum + parseFloat(s.averagePercentage || 0), 0) / reportData.students.length).toFixed(1)
                : 0
              }%
            </span>
          </div>
        </div>
      </div>

      {/* Student Grades Table */}
      {reportData.students.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No students found in this group</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                    Student Name
                  </th>
                  {reportData.exams.map(exam => (
                    <th key={exam.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      <div>
                        <div className="font-semibold">{exam.name}</div>
                        <div className="text-xs text-gray-400">
                          {exam.type} • Max: {exam.maxScore}
                        </div>
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-yellow-50 sticky right-0">
                    Average
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.students.map((studentData, index) => (
                  <tr key={studentData.student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-inherit">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-blue-800">
                            {studentData.student.name?.split(' ').map(n => n[0]).join('') || 'ST'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {studentData.student.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {studentData.student.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    {reportData.exams.map(exam => {
                      const scoreData = studentData.examScores[exam.id]
                      return (
                        <td key={exam.id} className="px-4 py-4 text-center">
                          {scoreData ? (
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {scoreData.score}/{scoreData.maxScore}
                              </div>
                              <div className={`text-xs font-medium ${
                                parseFloat(scoreData.percentage) >= 70 ? 'text-green-600' :
                                parseFloat(scoreData.percentage) >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {scoreData.percentage}%
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">
                              Not evaluated
                            </div>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-6 py-4 text-center bg-yellow-50 sticky right-0">
                      <div>
                        <div className={`text-sm font-bold ${
                          parseFloat(studentData.averagePercentage) >= 70 ? 'text-green-600' :
                          parseFloat(studentData.averagePercentage) >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {studentData.averagePercentage}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {studentData.totalEvaluated}/{reportData.exams.length} exams
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {reportData.students.filter(s => parseFloat(s.averagePercentage) >= 70).length}
            </div>
            <div className="text-sm text-green-700">Excellent (≥70%)</div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {reportData.students.filter(s => parseFloat(s.averagePercentage) >= 50 && parseFloat(s.averagePercentage) < 70).length}
            </div>
            <div className="text-sm text-yellow-700">Good (50-69%)</div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {reportData.students.filter(s => parseFloat(s.averagePercentage) < 50 && parseFloat(s.averagePercentage) > 0).length}
            </div>
            <div className="text-sm text-red-700">Needs Help (&lt;50%)</div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {reportData.students.filter(s => s.totalEvaluated === 0).length}
            </div>
            <div className="text-sm text-gray-700">Not Evaluated</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Exams = () => {
  const [exams, setExams] = useState([])
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [selectedGroupForReport, setSelectedGroupForReport] = useState('all')

  const basePath = import.meta.env.VITE_BASE_PATH || ''

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load data from JSON files
      const [examsRes, studentsRes, marksRes, groupsRes] = await Promise.all([
        fetch(`${basePath}/data/exams.json`),
        fetch(`${basePath}/data/students.json`),
        fetch(`${basePath}/data/marks.json`),
        fetch(`${basePath}/data/groups.json`)
      ])
      
      const [examsData, studentsData, marksData, groupsData] = await Promise.all([
        examsRes.json(),
        studentsRes.json(),
        marksRes.json(),
        groupsRes.json()
      ])
      
      setExams(examsData)
      setStudents(studentsData)
      setMarks(marksData)
      setGroups(groupsData)
      
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group reporting functions
  const getGroupReportData = (groupId) => {
    // Get students in the selected group
    const groupStudents = groupId === 'all' 
      ? students 
      : students.filter(s => s.groupId === groupId)

    // Get exams for the selected group (or all exams if group is 'all')
    const groupExams = groupId === 'all' 
      ? exams 
      : exams.filter(e => !e.groupId || e.groupId === groupId)

    // Create report data for each student
    const reportData = groupStudents.map(student => {
      const studentMarks = marks.filter(mark => mark.studentId.toString() === student.id)
      
      const examScores = {}
      let totalScore = 0
      let totalMaxScore = 0
      let evaluatedExamsCount = 0

      groupExams.forEach(exam => {
        const mark = studentMarks.find(m => m.examId === exam.id)
        if (mark) {
          examScores[exam.id] = {
            score: mark.score,
            maxScore: mark.maxScore || exam.maxScore,
            percentage: mark.percentage || ((mark.score / (mark.maxScore || exam.maxScore)) * 100).toFixed(1)
          }
          totalScore += mark.score
          totalMaxScore += (mark.maxScore || exam.maxScore)
          evaluatedExamsCount++
        }
      })

      const averagePercentage = totalMaxScore > 0 
        ? ((totalScore / totalMaxScore) * 100).toFixed(1) 
        : '0'

      return {
        student: student,
        examScores: examScores,
        totalScore: totalScore,
        totalMaxScore: totalMaxScore,
        averagePercentage: averagePercentage,
        totalEvaluated: evaluatedExamsCount
      }
    })

    // Get group info
    const groupInfo = groupId === 'all' 
      ? { id: 'all', name: 'All Groups' }
      : groups.find(g => g.id === groupId) || { id: groupId, name: 'Unknown Group' }

    return {
      groupInfo: groupInfo,
      students: reportData,
      exams: groupExams
    }
  }

  const stats = {
    totalExams: exams.length,
    totalStudents: students.length,
    totalMarks: marks.length,
    averageScore: marks.length > 0 
      ? (marks.reduce((sum, mark) => sum + mark.score, 0) / marks.length).toFixed(1)
      : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Student Performance Dashboard</h1>
          <p className="text-gray-600">View exam results and student progress by group</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalExams}</div>
              <div className="text-sm text-gray-600">Total Exams</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.totalStudents}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.totalMarks}</div>
              <div className="text-sm text-gray-600">Total Evaluations</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.averageScore}</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
          </div>
        </div>

        {/* Group Filter */}
        <div className="bg-white rounded-lg shadow-sm border mb-8 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Group Performance</h2>
            <div className="flex items-center gap-4">
              <label htmlFor="groupFilter" className="text-sm font-medium text-gray-700">
                Filter by Group:
              </label>
              <select
                id="groupFilter"
                value={selectedGroupForReport}
                onChange={(e) => setSelectedGroupForReport(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Groups</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reports Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <ReportsContent reportData={getGroupReportData(selectedGroupForReport)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Exams
