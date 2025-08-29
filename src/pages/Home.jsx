import { useState, useEffect } from 'react'
import { useTheme } from '../components/ThemeContext';
import { Link } from 'react-router-dom'

const Home = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalExams: 0,
    scheduledClasses: 0,
    totalResources: 0,
    averageGrade: 0,
    completedTopics: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const basePath = import.meta.env.PROD ? '/my-annual-plan' : ''
      const [studentsRes, examsRes, scheduleRes, resourcesRes, marksRes, syllabusRes] = await Promise.all([
        fetch(`${basePath}/data/students.json`).catch(() => ({ json: () => [] })),
        fetch(`${basePath}/data/exams.json`).catch(() => ({ json: () => [] })),
        fetch(`${basePath}/data/schedule.json`).catch(() => ({ json: () => [] })),
        fetch(`${basePath}/data/resources.json`).catch(() => ({ json: () => [] })),
        fetch(`${basePath}/data/marks.json`).catch(() => ({ json: () => [] })),
        fetch(`${basePath}/data/syllabus.json`).catch(() => ({ json: () => ({}) })),
      ])

      const students = await studentsRes.json()
      const exams = await examsRes.json()
      const schedule = await scheduleRes.json()
      const resources = await resourcesRes.json()
      const marks = await marksRes.json()
      const syllabusData = await syllabusRes.json()

      // Calculate average grade
      const totalMarks = marks.reduce((sum, mark) => sum + mark.score, 0)
      const avgGrade = marks.length > 0 ? (totalMarks / marks.length).toFixed(1) : 0

      // Count completed syllabus topics from the new structure
      let completed = 0
      if (syllabusData.units && Array.isArray(syllabusData.units)) {
        syllabusData.units.forEach(unit => {
          if (unit.weeks && Array.isArray(unit.weeks)) {
            unit.weeks.forEach(week => {
              if (week.status === 'completed') completed++
            })
          }
        })
      }

      // Count upcoming classes (today and future)
      const today = new Date().toISOString().split('T')[0]
      const upcomingClasses = schedule.filter(item => item.date >= today).length

      setStats({
        totalStudents: students.length,
        totalExams: exams.length,
        scheduledClasses: upcomingClasses,
        totalResources: resources.length,
        averageGrade: avgGrade,
        completedTopics: completed
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const { theme } = useTheme();
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className={`text-3xl font-bold mb-4 ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-900'}`}>
          Welcome to Student Management System
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${theme === 'blackGold' ? 'text-blackGold-500/80' : 'text-gray-600'}`}>
          Manage your students' progress, schedules, and academic resources all in one place.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-gray-900">
            {loading ? '...' : stats.totalStudents}
          </div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-gray-900">
            {loading ? '...' : stats.totalExams}
          </div>
          <div className="text-sm text-gray-600">Exams Available</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">📅</div>
          <div className="text-2xl font-bold text-gray-900">
            {loading ? '...' : stats.scheduledClasses}
          </div>
          <div className="text-sm text-gray-600">Upcoming Classes</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-2xl font-bold text-gray-900">
            {loading ? '...' : stats.totalResources}
          </div>
          <div className="text-sm text-gray-600">Resources Available</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card text-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold text-primary-600">
            {loading ? '...' : stats.averageGrade}%
          </div>
          <div className="text-sm text-gray-600">Average Grade</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">
            {loading ? '...' : stats.completedTopics}
          </div>
          <div className="text-sm text-gray-600">Completed Topics</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/students" className="btn-primary text-center">
            👥 View Students
          </Link>
          <Link to="/students" className="btn-primary text-center">
            📊 Check Marks
          </Link>
          <Link to="/schedule" className="btn-primary text-center">
            📅 View Schedule
          </Link>
          <Link to="/resources" className="btn-primary text-center">
            📁 Browse Resources
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="space-y-3">
          {loading ? (
            <div className="text-gray-500 text-center py-4">Loading system status...</div>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  <span className="text-gray-700">Student data loaded</span>
                </div>
                <span className="text-sm text-gray-500">{stats.totalStudents} students</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-blue-500 mr-3">📊</span>
                  <span className="text-gray-700">Exam system ready</span>
                </div>
                <span className="text-sm text-gray-500">{stats.totalExams} exams configured</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-purple-500 mr-3">📚</span>
                  <span className="text-gray-700">Resources available</span>
                </div>
                <span className="text-sm text-gray-500">{stats.totalResources} items</span>
              </div>
              
              {stats.scheduledClasses > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-3">⏰</span>
                    <span className="text-gray-700">Upcoming classes</span>
                  </div>
                  <span className="text-sm text-gray-500">{stats.scheduledClasses} scheduled</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
