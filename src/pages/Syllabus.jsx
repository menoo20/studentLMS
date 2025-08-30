import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../components/ThemeContext'
import { getGroupSyllabusConfig } from '../utils/groupSyllabusMapping'

const Syllabus = () => {
  const { theme } = useTheme()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [syllabusData, setSyllabusData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [viewMode, setViewMode] = useState('selector') // 'selector', 'syllabus', 'units', 'weekly', 'daily'
  const [currentSyllabusType, setCurrentSyllabusType] = useState(null)
  const [highlightedDate, setHighlightedDate] = useState(null)
  const [highlightedGroup, setHighlightedGroup] = useState(null)

  // Available syllabi configuration
  const availableSyllabi = [
    {
      id: 'jolly-phonics',
      title: 'Foundational English',
      description: 'Comprehensive annual English program using Jolly Phonics methodology for adult ESL learners',
      file: 'syllabus_jolly_phonics.json',
      type: 'long-course',
      duration: '52 weeks',
      target: 'SAIPEM Groups, SAM Groups',
      color: 'blue'
    },
    {
      id: 'nesma-english',
      title: 'English Communication - NESMA',
      description: 'Comprehensive English language training for vocational students',
      file: 'syllabus_new.json',
      type: 'regular-course',
      duration: '32+ weeks',
      target: 'NESMA Group',
      color: 'green'
    }
  ]

  // Week mapping configuration - starting from Aug 24, 2025 (Sunday)
  const COURSE_START_DATE = new Date('2025-08-24') // Sunday, Aug 24
  
  // Helper function to get the date range for a specific syllabus week
  const getWeekDateRange = (weekNumber) => {
    const startDate = new Date(COURSE_START_DATE)
    startDate.setDate(COURSE_START_DATE.getDate() + (weekNumber - 1) * 7)
    
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6) // Sunday to Saturday (7 days)
    
    return { startDate, endDate }
  }

  // Helper function to get specific day date within a week
  const getDayDateInWeek = (weekNumber, dayName) => {
    const { startDate } = getWeekDateRange(weekNumber)
    const dayIndex = {
      'Sunday': 0,
      'Monday': 1, 
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6
    }[dayName]
    
    if (dayIndex === undefined) return null
    
    const dayDate = new Date(startDate)
    dayDate.setDate(startDate.getDate() + dayIndex)
    return dayDate
  }

  // Helper function to find which syllabus week and day a given date falls into
  const findWeekAndDayForDate = (targetDate) => {
    const target = new Date(targetDate)
    
    if (!syllabusData?.units) return null
    
    // Search through all units and their weekly plans
    for (const unit of syllabusData.units) {
      if (unit.weeklyPlan) {
        for (const weekPlan of unit.weeklyPlan) {
          const { startDate, endDate } = getWeekDateRange(weekPlan.week)
          
          // Check if target date falls within this week
          if (target >= startDate && target <= endDate) {
            // Find the specific day
            const dayName = target.toLocaleDateString('en-US', { weekday: 'long' })
            const dayPlan = weekPlan.dailyPlans?.find(day => day.day === dayName)
            
            return {
              unit,
              weekPlan,
              dayPlan,
              weekNumber: weekPlan.week,
              dayName
            }
          }
        }
      }
    }
    return null
  }

  // Helper function to calculate dynamic status based on current date
  const calculateDynamicStatus = (item, type = 'week') => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
    
    if (type === 'week' && item.week) {
      const { startDate, endDate } = getWeekDateRange(item.week)
      
      if (today > endDate) {
        return 'completed'
      } else if (today >= startDate && today <= endDate) {
        return 'current'
      } else {
        return 'planned'
      }
    } else if (type === 'unit' && item.weeklyPlan) {
      // For units, check the date range of all weeks within the unit
      const firstWeek = item.weeklyPlan[0]?.week
      const lastWeek = item.weeklyPlan[item.weeklyPlan.length - 1]?.week
      
      if (firstWeek && lastWeek) {
        const { startDate } = getWeekDateRange(firstWeek)
        const { endDate } = getWeekDateRange(lastWeek)
        
        if (today > endDate) {
          return 'completed'
        } else if (today >= startDate && today <= endDate) {
          return 'in-progress'
        } else {
          return 'planned'
        }
      }
    }
    
    // Fallback to original status
    return item.status || 'planned'
  }

  useEffect(() => {
    const initializePage = async () => {
      const courseId = searchParams.get('course')
      const group = searchParams.get('group')
      const syllabusId = searchParams.get('syllabus')
      
      // Extract syllabus ID from URL path (e.g., /syllabus/jolly-phonics -> jolly-phonics)
      const pathParts = location.pathname.split('/')
      const pathSyllabusId = pathParts.length > 2 ? pathParts[2] : null
      
      console.log('Initializing Syllabus page with:', { 
        path: location.pathname, 
        pathSyllabusId, 
        courseId, 
        group, 
        syllabusId 
      })
      
      // Priority: URL path > URL parameter > group mapping
      const targetSyllabusId = pathSyllabusId || syllabusId
      
      // If specific syllabus is requested (from path or parameter), load it directly
      if (targetSyllabusId) {
        const syllabus = availableSyllabi.find(s => s.id === targetSyllabusId)
        if (syllabus) {
          await loadSpecificSyllabus(syllabus)
          setViewMode('syllabus')
        } else {
          console.warn(`No syllabus found for ID ${targetSyllabusId}, falling back to selector`)
          setViewMode('selector')
        }
      }
      // If coming from schedule with group, auto-select appropriate syllabus
      else if (group && !courseId) {
        const groupConfig = getGroupSyllabusConfig(group)
        const syllabus = availableSyllabi.find(s => s.id === groupConfig.syllabusId)
        
        if (syllabus) {
          await loadSpecificSyllabus(syllabus)
          setViewMode('syllabus')
        } else {
          console.warn(`No syllabus found for group ${group}, falling back to selector`)
          setViewMode('selector')
        }
      }
      // Default to selector view (handles menu navigation to /syllabus)
      else {
        console.log('No specific parameters, showing selector')
        setViewMode('selector')
        setSyllabusData(null)
        setCurrentSyllabusType(null)
        setSelectedUnit(null)
        setSelectedWeek(null)
        setHighlightedDate(null)
        setHighlightedGroup(null)
      }
      
      setLoading(false)
    }

    initializePage()
  }, [searchParams, location.pathname])

  const loadSpecificSyllabus = async (syllabusConfig) => {
    try {
      const basePath = import.meta.env.PROD ? '/my-annual-plan' : ''
      const response = await fetch(`${basePath}/data/${syllabusConfig.file}?t=${Date.now()}`)
      const data = await response.json()
      
      setSyllabusData(data)
      setCurrentSyllabusType(syllabusConfig)
      
      // Handle URL parameters from schedule clicks for day/week highlighting
      const date = searchParams.get('date')
      const group = searchParams.get('group')
      
      if (date && group) {
        setHighlightedDate(date)
        setHighlightedGroup(group)
        
        // Find the exact week and day for this date and auto-navigate
        const weekDayInfo = findWeekAndDayForDate(date)
        if (weekDayInfo) {
          setSelectedUnit(weekDayInfo.unit)
          setSelectedWeek(weekDayInfo.weekPlan)
          setViewMode('daily')
        }
      }
    } catch (error) {
      console.error('Error loading syllabus:', error)
      setSyllabusData(null)
    }
  }

  // Handle URL parameters from schedule clicks
  useEffect(() => {
    const date = searchParams.get('date')
    const group = searchParams.get('group')
    
    if (date && group && syllabusData) {
      setHighlightedDate(date)
      setHighlightedGroup(group)
      
      // Find the exact week and day for this date
      const weekDayInfo = findWeekAndDayForDate(date)
      
      if (weekDayInfo) {
        // Auto-expand to show the relevant content
        setSelectedUnit(weekDayInfo.unit.id)
        setSelectedWeek(weekDayInfo.weekPlan)
        
        // Show daily detail view for specific day content
        setViewMode('daily')
      }
    }
  }, [searchParams, syllabusData])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className={`text-lg ${theme === 'blackGold' ? 'text-white' : 'text-gray-600'}`}>Loading syllabus...</div>
      </div>
    )
  }

  // Only show "No Syllabus Data" if we're not in selector mode and have no data
  if (!syllabusData && viewMode !== 'selector') {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className={`text-xl font-semibold mb-2 ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-900'}`}>No Syllabus Data</h3>
        <p className={`${theme === 'blackGold' ? 'text-white' : 'text-gray-600'}`}>Add your syllabus.json file to get started.</p>
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

  const renderSyllabusSelector = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className={`text-3xl font-bold mb-4 ${theme === 'blackGold' ? 'text-white' : 'text-gray-900'}`}>
            Course Syllabi
          </h2>
          <p className={`text-lg ${theme === 'blackGold' ? 'text-gray-300' : 'text-gray-600'}`}>
            Select a syllabus to view its detailed content, weekly plans, and daily lesson plans
          </p>
        </div>

        {/* Syllabus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableSyllabi.map((syllabus) => (
            <div
              key={syllabus.id}
              className={`card hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-300`}
              onClick={() => {
                navigate(`/syllabus/${syllabus.id}`)
              }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-2 ${theme === 'blackGold' ? 'text-white' : 'text-gray-900'}`}>
                      {syllabus.title}
                    </h3>
                    <p className={`text-sm ${theme === 'blackGold' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {syllabus.description}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 ml-4`}>
                    <svg className={`w-6 h-6 text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${theme === 'blackGold' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Duration:
                    </span>
                    <span className={`text-sm font-semibold ${theme === 'blackGold' ? 'text-white' : 'text-gray-900'}`}>
                      {syllabus.duration}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${theme === 'blackGold' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Target Groups:
                    </span>
                    <span className={`text-sm font-semibold ${theme === 'blackGold' ? 'text-white' : 'text-gray-900'}`}>
                      {syllabus.target}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${theme === 'blackGold' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Course Type:
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      syllabus.type === 'long-course' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {syllabus.type === 'long-course' ? 'Annual Course' : 'Regular Course'}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-6 flex items-center justify-between">
                  <span className={`text-sm ${theme === 'blackGold' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Click to explore
                  </span>
                  <svg className={`w-5 h-5 text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access from Schedule */}
        <div className="card">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📅</div>
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'blackGold' ? 'text-white' : 'text-gray-900'}`}>
              Quick Access
            </h3>
            <p className={`text-sm ${theme === 'blackGold' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              You can also access syllabi directly from the Schedule page by clicking on any class session
            </p>
            <button
              onClick={() => navigate('/schedule')}
              className="btn-primary"
            >
              Go to Schedule
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderAnnualOverview = () => {
    // Check if this is a short course view
    if (syllabusData.isShortCourseView) {
      return renderShortCourseView()
    }
    
    // Calculate progress from units
    const completedUnits = syllabusData.units.filter(unit => unit.status === 'completed').length
    const totalUnits = syllabusData.units.length
    const percentageComplete = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0

    return (
      <div className="space-y-6">
        {/* Course Information */}
        <div className="card">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{syllabusData.courseInfo.subject}</h3>
              <p className="mt-2 text-gray-600">{syllabusData.courseInfo.description}</p>
              {syllabusData.courseInfo.methodology && (
                <p className="text-sm text-blue-600 mt-3">📚 {syllabusData.courseInfo.methodology}</p>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-r-4 border-blue-400 text-center">
                <div className="text-sm text-gray-500 mb-1">Academic Year</div>
                <div className="font-semibold text-lg text-gray-900">{syllabusData.courseInfo.academicYear}</div>
              </div>
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
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Units Timeline</h3>
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
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium text-gray-900">{unit.title}</h4>
                        {unit.weeklyPlan && unit.weeklyPlan.length > 0 && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            {(() => {
                              const firstWeek = unit.weeklyPlan[0].week
                              const lastWeek = unit.weeklyPlan[unit.weeklyPlan.length - 1].week
                              const { startDate } = getWeekDateRange(firstWeek)
                              const { endDate } = getWeekDateRange(lastWeek)
                              return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            })()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{unit.description}</p>
                      {unit.phonics_groups && (
                        <div className="mt-1">
                          <span className="text-xs text-blue-600">
                            🔤 Phonics Groups: {unit.phonics_groups.map(g => g.group_id).join(', ')}
                          </span>
                        </div>
                      )}
                      {unit.grammar_focus && (
                        <div className="mt-1">
                          <span className="text-xs text-green-600">
                            📝 Grammar Focus: {unit.grammar_focus.main_concepts.join(' • ')}
                          </span>
                        </div>
                      )}
                      {unit.key_highlights && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {unit.key_highlights.slice(0, 2).map((highlight, idx) => (
                            <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {highlight.split(' ')[0]} {/* Show just the emoji and first word */}
                            </span>
                          ))}
                          {unit.key_highlights.length > 2 && (
                            <span className="text-xs text-gray-500">+{unit.key_highlights.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-4">
                    <div>
                      <div className="text-sm text-gray-500">{unit.duration}</div>
                      <div className="text-xs text-gray-400">Weeks {unit.startWeek}-{unit.endWeek}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(calculateDynamicStatus(unit, 'unit'))}`}>
                      {calculateDynamicStatus(unit, 'unit')}
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
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'blackGold' ? 'text-white' : 'text-gray-900'}`}>Short Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {syllabusData.shortCourses.map((course) => {
                console.log('Rendering short course:', course.id, course.title)
                return (
                <div 
                  key={course.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 cursor-pointer transition-all hover:shadow-md"
                  onClick={() => {
                    // Navigate to dedicated short course syllabus page
                    console.log('Navigating to short course:', course.id, 'group:', highlightedGroup || 'NESMA')
                    navigate(`/my-annual-plan/syllabus?course=${course.id}&group=${highlightedGroup || 'NESMA'}`)
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-medium ${theme === 'blackGold' ? 'text-white' : 'text-gray-900'}`}>{course.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        course.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {course.status || 'planned'}
                      </span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <p className={`text-sm mb-2 ${theme === 'blackGold' ? 'text-gray-300' : 'text-gray-600'}`}>{course.description}</p>
                  <div className={`text-xs ${theme === 'blackGold' ? 'text-gray-400' : 'text-gray-500'}`}>
                    📅 {course.startDate && course.endDate ? `${course.startDate} to ${course.endDate}` : 'Schedule TBD'} • ⏱️ {course.duration}
                    {course.target && <span> • 🎯 {course.target}</span>}
                  </div>
                  
                  {/* Learning Objectives Preview */}
                  {course.objectives && (
                    <div className="mt-3">
                      <div className={`text-xs font-medium mb-1 ${theme === 'blackGold' ? 'text-gray-300' : 'text-gray-700'}`}>Key Objectives:</div>
                      <div className="flex flex-wrap gap-1">
                        {course.objectives.slice(0, 2).map((objective, index) => (
                          <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {objective.split(' ').slice(0, 3).join(' ')}...
                          </span>
                        ))}
                        {course.objectives.length > 2 && (
                          <span className="text-xs text-gray-500">+{course.objectives.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderShortCourseView = () => {
    const shortCourse = syllabusData.shortCourse
    
    return (
      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => {
              const group = searchParams.get('group') || 'NESMA'
              navigate(`/my-annual-plan/syllabus?group=${group}`)
            }}
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            ← Back to Main Syllabus
          </button>
        </div>

        {/* Course Information */}
        <div className="card">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{syllabusData.courseInfo.subject}</h3>
              <p className="mt-2 text-gray-600">{syllabusData.courseInfo.description}</p>
              {syllabusData.courseInfo.target && (
                <p className="text-sm text-blue-600 mt-3">🎯 Target: {syllabusData.courseInfo.target}</p>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-r-4 border-blue-400 text-center">
                <div className="text-sm text-gray-500 mb-1">Course Type</div>
                <div className="font-semibold text-lg text-gray-900">Short Course</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{syllabusData.courseInfo.duration}</div>
              <div className="text-sm text-blue-800">Duration</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-bold text-green-600">
                {syllabusData.courseInfo.startDate || 'TBD'}
              </div>
              <div className="text-sm text-green-800">Start Date</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm font-bold text-purple-600">
                {syllabusData.courseInfo.endDate || 'TBD'}
              </div>
              <div className="text-sm text-purple-800">End Date</div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        {shortCourse.objectives && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Learning Objectives</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {shortCourse.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Units/Weeks Timeline */}
        {syllabusData.units && syllabusData.units.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Course Timeline</h3>
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
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium text-gray-900">{unit.title}</h4>
                          {unit.weeklyPlan && unit.weeklyPlan.length > 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              {unit.weeklyPlan.length} {unit.weeklyPlan.length === 1 ? 'week' : 'weeks'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{unit.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-4">
                      <div>
                        <div className="text-sm text-gray-500">{unit.duration}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(calculateDynamicStatus(unit, 'unit'))}`}>
                        {calculateDynamicStatus(unit, 'unit')}
                      </span>
                    </div>
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
          onClick={() => setViewMode('syllabus')}
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
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(calculateDynamicStatus(selectedUnit, 'unit'))}`}>
              {calculateDynamicStatus(selectedUnit, 'unit')}
            </span>
            <span className="text-sm text-gray-500">{selectedUnit.duration}</span>
            <span className="text-sm text-gray-500">Weeks {selectedUnit.startWeek}-{selectedUnit.endWeek}</span>
          </div>
        </div>

        {/* Key Highlights */}
        {selectedUnit.key_highlights && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Key Learning Highlights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedUnit.key_highlights.map((highlight, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
                  <span className="text-sm font-medium text-blue-800">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Grammar Groups */}
        {selectedUnit.grammar_groups && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Grammar Components</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedUnit.grammar_groups.map((group) => (
                <div key={group.group_id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="font-medium text-green-900 mb-2">{group.title}</div>
                  <div className="text-sm text-green-700 mb-2">{group.focus}</div>
                  <div className="space-y-2">
                    {group.forms && (
                      <div className="flex flex-wrap gap-1">
                        {group.forms.map((form, index) => (
                          <span key={index} className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm font-bold">
                            {form}
                          </span>
                        ))}
                      </div>
                    )}
                    {group.components && (
                      <div className="space-y-1">
                        {group.components.map((component, index) => (
                          <div key={index} className="text-xs text-green-600 bg-white px-2 py-1 rounded">
                            {component}
                          </div>
                        ))}
                      </div>
                    )}
                    {group.patterns && (
                      <div className="space-y-1">
                        {group.patterns.map((pattern, index) => (
                          <div key={index} className="text-xs text-green-600 bg-white px-2 py-1 rounded font-mono">
                            {pattern}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-green-600 border-t border-green-200 pt-2">
                    💼 {group.workplace_usage}
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
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-medium text-gray-900">Week {week.week}: {week.topic}</h5>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          {(() => {
                            const { startDate, endDate } = getWeekDateRange(week.week)
                            return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          })()}
                        </span>
                      </div>
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
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">Week {selectedWeek.week}: {selectedWeek.topic}</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
              {(() => {
                const { startDate, endDate } = getWeekDateRange(selectedWeek.week)
                return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              })()}
            </span>
          </div>
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
              {selectedWeek.dailyPlans.map((day, index) => {
                const dayDate = getDayDateInWeek(selectedWeek.week, day.day)
                return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h5 className="font-medium text-gray-900">{day.day}</h5>
                      {dayDate && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                          {dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{day.focus}</div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{day.activities}</p>
                  {day.notes && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      📝 Notes: {day.notes || "No notes yet"}
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderDayDetail = () => {
    if (!highlightedDate) return null
    
    const weekDayInfo = findWeekAndDayForDate(highlightedDate)
    if (!weekDayInfo) return null

    const { unit, weekPlan, dayPlan, dayName } = weekDayInfo
    const dayDate = getDayDateInWeek(weekPlan.week, dayName)

    return (
      <div className="space-y-6">
        {/* Day Header */}
        <div className="card">
          <div className="border-l-4 border-blue-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {dayName} Class Content
            </h2>
            <p className="text-gray-600 mb-4">
              {dayDate?.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • Week {weekPlan.week} • {highlightedGroup}
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Week Topic</h3>
              <p className="text-blue-800">{weekPlan.topic}</p>
            </div>
          </div>
        </div>

        {/* Day Content */}
        {dayPlan ? (
          <div className="card">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Today's Learning Content</h3>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">📚 Focus Area</h4>
                <p className="text-green-800">{dayPlan.focus}</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">🎯 Activities</h4>
                <p className="text-amber-800">{dayPlan.activities}</p>
              </div>

              {dayPlan.notes && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📝 Notes</h4>
                  <p className="text-gray-700">{dayPlan.notes}</p>
                </div>
              )}

              {dayPlan.assessment && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">✅ Assessment</h4>
                  <p className="text-purple-800">{dayPlan.assessment}</p>
                </div>
              )}
            </div>

            {/* Week Context */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Week Context</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Unit: {unit.title}</h5>
                  <p className="text-sm text-gray-600">{unit.description}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Week Focus</h5>
                  <p className="text-sm text-gray-600">{weekPlan.focus}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={() => setViewMode('weekly')}
                className="btn-primary"
              >
                📅 View Full Week
              </button>
              <button
                onClick={() => {
                  setSelectedUnit(unit)
                  setViewMode('units')
                }}
                className="btn-secondary"
              >
                📚 View Unit
              </button>
              <button
                onClick={() => window.history.back()}
                className="btn-secondary"
              >
                ← Back to Schedule
              </button>
            </div>
          </div>
        ) : (
          <div className="card text-center py-8">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No Specific Content</h3>
            <p className="text-gray-600 mb-4">
              No detailed daily plan found for {dayName}, {dayDate?.toLocaleDateString()}
            </p>
            <button
              onClick={() => setViewMode('weekly')}
              className="btn-primary"
            >
              View Week Overview
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Class Context Banner - shown when coming from schedule (but not in daily view) */}
      {highlightedDate && highlightedGroup && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white p-2 rounded-full">
              📅
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">
                Class Content for {highlightedGroup}
              </h3>
              <p className="text-blue-700 text-sm">
                Showing syllabus content for {new Date(highlightedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setHighlightedDate(null)
              setHighlightedGroup(null)
              setViewMode('syllabus')
              // Clear URL parameters
              window.history.replaceState({}, '', window.location.pathname)
            }}
            className="text-blue-500 hover:text-blue-700 p-1"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-900'}`}>
          {viewMode === 'selector' ? 'Course Syllabi' : 
           currentSyllabusType ? currentSyllabusType.title : 'Course Syllabus'}
        </h1>
        <p className={`${theme === 'blackGold' ? 'text-white' : 'text-gray-600'}`}>
          {viewMode === 'selector' ? 'Choose a syllabus to explore' : 'Track your annual teaching plan and daily progress'}
        </p>
        
        {/* Back to Selector Button */}
        {viewMode !== 'selector' && (
          <button
            onClick={() => {
              navigate('/syllabus')
            }}
            className="mt-3 text-blue-600 hover:text-blue-700 flex items-center text-sm"
          >
            ← Back to Syllabus Selection
          </button>
        )}
      </div>

      {viewMode === 'selector' && renderSyllabusSelector()}
      {viewMode === 'syllabus' && renderAnnualOverview()}
      {viewMode === 'units' && selectedUnit && renderUnitDetail()}
      {viewMode === 'weekly' && selectedWeek && renderWeeklyDetail()}
      {viewMode === 'daily' && renderDayDetail()}
    </div>
  )
}

export default Syllabus
