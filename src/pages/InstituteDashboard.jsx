import React, { useState, useEffect } from 'react'

const InstituteDashboard = () => {
  const [exams, setExams] = useState([])
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  const basePath = import.meta.env.VITE_BASE_PATH || ''

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
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

  // Institute-wide analytics
  const getInstituteAnalytics = () => {
    // Overall performance metrics
    const totalStudents = students.length
    const totalGroups = groups.length
    const totalExams = exams.length
    const totalEvaluations = marks.length

    // Average performance across all students
    const overallAverage = marks.length > 0 
      ? (marks.reduce((sum, mark) => sum + (parseFloat(mark.percentage) || 0), 0) / marks.length).toFixed(1)
      : 0

    // Group performance comparison
    const groupPerformance = groups.map(group => {
      const groupStudents = students.filter(s => s.groupId === group.id)
      const groupMarks = marks.filter(mark => 
        groupStudents.some(s => s.id === mark.studentId)
      )
      
      const avgScore = groupMarks.length > 0
        ? (groupMarks.reduce((sum, mark) => sum + (parseFloat(mark.percentage) || 0), 0) / groupMarks.length).toFixed(1)
        : 0

      const evaluationRate = groupStudents.length > 0
        ? ((groupMarks.length / (groupStudents.length * exams.length)) * 100).toFixed(1)
        : 0

      return {
        id: group.id,
        name: group.name,
        studentCount: groupStudents.length,
        avgScore: parseFloat(avgScore),
        evaluations: groupMarks.length,
        evaluationRate: parseFloat(evaluationRate)
      }
    }).sort((a, b) => b.avgScore - a.avgScore)

    // Performance distribution
    const performanceLevels = {
      excellent: marks.filter(m => parseFloat(m.percentage) >= 90).length,
      good: marks.filter(m => parseFloat(m.percentage) >= 70 && parseFloat(m.percentage) < 90).length,
      average: marks.filter(m => parseFloat(m.percentage) >= 50 && parseFloat(m.percentage) < 70).length,
      needsImprovement: marks.filter(m => parseFloat(m.percentage) < 50).length
    }

    // Exam-wise performance
    const examPerformance = exams.map(exam => {
      const examMarks = marks.filter(m => m.examId === exam.id)
      const avgScore = examMarks.length > 0
        ? (examMarks.reduce((sum, mark) => sum + (parseFloat(mark.percentage) || 0), 0) / examMarks.length).toFixed(1)
        : 0

      return {
        ...exam,
        avgScore: parseFloat(avgScore),
        participantCount: examMarks.length,
        assignedToGroups: exam.assignedGroups ? exam.assignedGroups.length : groups.length
      }
    }).sort((a, b) => b.avgScore - a.avgScore)

    return {
      totalStudents,
      totalGroups,
      totalExams,
      totalEvaluations,
      overallAverage: parseFloat(overallAverage),
      groupPerformance,
      performanceLevels,
      examPerformance
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading institute analytics...</p>
        </div>
      </div>
    )
  }

  const analytics = getInstituteAnalytics()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🏛️ Institute Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of institutional performance and trends</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{analytics.totalStudents}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{analytics.totalGroups}</div>
              <div className="text-sm text-gray-600">Active Groups</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{analytics.totalExams}</div>
              <div className="text-sm text-gray-600">Total Exams</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{analytics.totalEvaluations}</div>
              <div className="text-sm text-gray-600">Evaluations</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                analytics.overallAverage >= 70 ? 'text-green-600' :
                analytics.overallAverage >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analytics.overallAverage}%
              </div>
              <div className="text-sm text-gray-600">Institute Average</div>
            </div>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="bg-white rounded-lg shadow-sm border mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Performance Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analytics.performanceLevels.excellent}</div>
                <div className="text-sm text-green-700">Excellent (≥90%)</div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics.performanceLevels.good}</div>
                <div className="text-sm text-blue-700">Good (70-89%)</div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{analytics.performanceLevels.average}</div>
                <div className="text-sm text-yellow-700">Average (50-69%)</div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{analytics.performanceLevels.needsImprovement}</div>
                <div className="text-sm text-red-700">Needs Help (&lt;50%)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Group Performance Ranking */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🏆 Group Performance Ranking</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Group Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Score
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evaluations
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.groupPerformance.map((group, index) => (
                    <tr key={group.id} className={index < 3 ? 'bg-yellow-50' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          index === 0 ? 'bg-yellow-400 text-white' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{group.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{group.studentCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className={`text-sm font-medium ${
                          group.avgScore >= 70 ? 'text-green-600' :
                          group.avgScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {group.avgScore}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{group.evaluations}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className={`text-sm font-medium ${
                          group.evaluationRate >= 80 ? 'text-green-600' :
                          group.evaluationRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {group.evaluationRate}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Exam Performance Analysis */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📚 Exam Performance Analysis</h2>
            <div className="space-y-4">
              {analytics.examPerformance.map((exam) => (
                <div key={exam.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                      <p className="text-sm text-gray-600">
                        {exam.type} • Max: {exam.maxScore} points • Date: {exam.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        exam.avgScore >= 70 ? 'text-green-600' :
                        exam.avgScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {exam.avgScore}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {exam.participantCount} participants
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Assigned to: {exam.assignedToGroups} group(s)
                    </span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            exam.avgScore >= 70 ? 'bg-green-500' :
                            exam.avgScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(exam.avgScore, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-600">{exam.avgScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstituteDashboard
