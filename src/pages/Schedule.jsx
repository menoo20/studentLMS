import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../components/ThemeContext'

const Schedule = () => {
  const { theme } = useTheme()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [weeklySchedule, setWeeklySchedule] = useState(null)
  const [loading, setLoading] = useState(true)

  // Subject color mapping for beautiful timetable design
  const subjectColors = {
    'English': 'bg-yellow-200 border-yellow-300 text-yellow-900',
    'Mathematics': 'bg-red-200 border-red-300 text-red-900',
    'Engineering': 'bg-blue-200 border-blue-300 text-blue-900',
    'Geography': 'bg-amber-200 border-amber-300 text-amber-900',
    'Music': 'bg-green-200 border-green-300 text-green-900',
    'Religious Education': 'bg-green-300 border-green-400 text-green-900',
    'Physical Education': 'bg-green-300 border-green-400 text-green-900',
    'Irish': 'bg-green-200 border-green-300 text-green-900',
    'Tutorial': 'bg-yellow-100 border-yellow-200 text-yellow-800',
    'Home Economics': 'bg-yellow-300 border-yellow-400 text-yellow-900',
    'ALFA': 'bg-purple-200 border-purple-300 text-purple-900',
    'ALFA2': 'bg-purple-200 border-purple-300 text-purple-900',
    'SAIPEM': 'bg-cyan-200 border-cyan-300 text-cyan-900',
    'NESMA': 'bg-yellow-200 border-yellow-300 text-yellow-900',
    'JP': 'bg-pink-200 border-pink-300 text-pink-900',
    'default': 'bg-gray-200 border-gray-300 text-gray-900'
  }

  // Time slots for the timetable (like in your image)
  const timeSlots = [
    '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ]
  
  const getCurrentDate = () => {
    // Use the actual current date - this will always be today
    return new Date() // This will be the real current date and time
  }

  const [currentWeek, setCurrentWeek] = useState(() => {
    // Initialize with actual current week
    const today = getCurrentDate()
    const currentDayOfWeek = today.getDay()
    const startOfCurrentWeek = new Date(today)
    startOfCurrentWeek.setDate(today.getDate() - currentDayOfWeek)
    return startOfCurrentWeek
  })
  const [viewMode, setViewMode] = useState('week') // 'week', 'daily'
  
  // Initialize selectedDay to today's day of week
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = getCurrentDate()
    return today.getDay() // 0=Sunday, 1=Monday, 2=Tuesday, etc.
  })
  
  const [highlightGroup, setHighlightGroup] = useState(null)

  // Auto-switch to daily view on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setViewMode('daily')
        // Set to today's day when switching to daily view
        const today = getCurrentDate()
        setSelectedDay(today.getDay())
      }
    }
    
    handleResize() // Check on mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    try {
      // Load weekly schedule template instead of schedule.json
      const response = await fetch('/my-annual-plan/data/weekly_schedule_template.json')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setWeeklySchedule(data)
    } catch (error) {
      console.error('Error loading weekly schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWeekDates = (startDate) => {
    const dates = []
    for (let i = 0; i < 5; i++) { // Sunday to Thursday (5 working days)
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  // Check if date is within semester dates
  const isWithinSemester = (date) => {
    if (!weeklySchedule?.schedule_info) return true
    
    const checkDate = new Date(date)
    const semesterStart = new Date(weeklySchedule.schedule_info.semester_start)
    const semesterEnd = new Date(weeklySchedule.schedule_info.semester_end)
    
    return checkDate >= semesterStart && checkDate <= semesterEnd
  }

  const getDayName = (dayIndex) => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return dayNames[dayIndex]
  }

  // Get schedule for a specific date using weekly template
  const getScheduleForDate = (date) => {
    if (!weeklySchedule?.weekly_schedule || !isWithinSemester(date)) return []
    
    const dayName = getDayName(date.getDay())
    const daySchedule = weeklySchedule.weekly_schedule[dayName] || []
    
    // Convert to format similar to old schedule for compatibility
    return daySchedule.map((item, index) => ({
      ...item,
      id: `${dayName}_${item.time}_${item.group}`,
      date: date.toISOString().split('T')[0],
      room: weeklySchedule.schedule_info.room,
      duration: weeklySchedule.schedule_info.duration
    }))
  }

  const getClassAtTime = (date, time) => {
    const daySchedule = getScheduleForDate(date)
    return daySchedule.find(item => item.time === time)
  }

  // Check if weekly schedule has data
  const hasScheduleData = () => {
    if (!weeklySchedule?.weekly_schedule) return false
    const workingDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
    return workingDays.some(day => 
      weeklySchedule.weekly_schedule[day] && 
      weeklySchedule.weekly_schedule[day].length > 0
    )
  }

  const isNesmaSpanSlot = (date, time) => {
    // Check if this is the 10:00 slot and there's a NESMA class at 09:00
    if (time === '10:00') {
      const daySchedule = getScheduleForDate(date)
      const nesmaClass = daySchedule.find(item => item.time === '09:00' && item.group === 'NESMA')
      return nesmaClass ? true : false
    }
    return false
  }

  const isClassLive = (classItem) => {
    if (!classItem || classItem.group !== 'NESMA') return false
    
    const now = new Date()
    const classDate = new Date(`${classItem.date}T${classItem.time}:00`)
    
    // Assume 2-hour duration for NESMA (spans 2 time slots)
    const classEndTime = new Date(classDate)
    classEndTime.setHours(classEndTime.getHours() + 2)
    
    // Check if current time is between class start and end time
    return now >= classDate && now <= classEndTime
  }

  const handleClassClick = (classItem) => {
    if (!classItem) return
    
    // Navigate to syllabus with date and group parameters
    const searchParams = new URLSearchParams()
    searchParams.set('date', classItem.date)
    searchParams.set('group', classItem.group)
    
    // Route to specific syllabus based on group
    if (classItem.group === 'NESMA') {
      navigate(`/syllabus/nesma-english?${searchParams.toString()}`)
    } else {
      // All other groups use jolly-phonics
      navigate(`/syllabus/jolly-phonics?${searchParams.toString()}`)
    }
  }

  const weekDates = getWeekDates(currentWeek)

  // Helper function to get subject color based on group/subject
  const getSubjectColor = (group) => {
    const groupName = group.toUpperCase()
    if (groupName.includes('ENGLISH') || groupName.includes('NESMA')) {
      return subjectColors['English']
    }
    if (groupName.includes('MATH')) {
      return subjectColors['Mathematics']
    }
    if (groupName.includes('ENGINEERING')) {
      return subjectColors['Engineering']
    }
    if (groupName.includes('GEOGRAPHY')) {
      return subjectColors['Geography']
    }
    if (groupName.includes('MUSIC')) {
      return subjectColors['Music']
    }
    if (groupName.includes('ALFA')) {
      return subjectColors['ALFA']
    }
    if (groupName.includes('SAIPEM')) {
      return subjectColors['SAIPEM']
    }
    if (groupName.includes('JP')) {
      return subjectColors['JP']
    }
    return subjectColors['default']
  }

  // Helper function to calculate end time
  const getEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const endHour = hours + 1
    return `${endHour}:${minutes.toString().padStart(2, '0')}`
  }

  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek)
    prevWeek.setDate(currentWeek.getDate() - 7)
    setCurrentWeek(prevWeek)
  }

  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek)
    nextWeek.setDate(currentWeek.getDate() + 7)
    setCurrentWeek(nextWeek)
  }

  const goToCurrentWeek = () => {
    // Calculate the actual current week based on today's date
    const today = getCurrentDate()
    const currentDayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate the start of the current week (Sunday)
    const startOfCurrentWeek = new Date(today)
    startOfCurrentWeek.setDate(today.getDate() - currentDayOfWeek)
    
    setCurrentWeek(startOfCurrentWeek)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!hasScheduleData()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Schedule Data</h3>
          <p className="text-gray-600">Weekly schedule template is not available or contains no data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Teaching Schedule</h1>
              <p className="text-gray-600">
                Your weekly teaching schedule • {timeSlots.length} time slots • Working days (Sun-Thu)
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="hidden md:flex items-center space-x-2 bg-white rounded-lg border shadow-sm">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                    viewMode === 'week'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Week View
                </button>
                <button
                  onClick={() => setViewMode('daily')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                    viewMode === 'daily'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Daily View
                </button>
              </div>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-between bg-white rounded-lg border shadow-sm p-4">
            <button
              onClick={goToPreviousWeek}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>←</span>
              <span className="hidden sm:inline">Previous Week</span>
            </button>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {weekDates[0]?.toLocaleDateString('en-US', { 
                  month: 'long',
                  day: 'numeric'
                })} - {weekDates[4]?.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={goToCurrentWeek}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
              >
                Today
              </button>
              <button
                onClick={goToNextWeek}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="hidden sm:inline">Next Week</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Weekly View - Beautiful Timetable */}
        {viewMode === 'week' && (
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
            {/* Beautiful Timetable Header - like your image */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-2 rounded">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Timetable</h2>
                    <p className="text-blue-100 text-sm">Week of {weekDates[0]?.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded text-blue-600 font-medium cursor-pointer hover:bg-blue-50 transition-colors">
                  Actions ▼
                </div>
              </div>

              {/* Enhanced Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 bg-gray-100 w-24 sticky left-0">
                        <div>Time</div>
                      </th>
                      {weekDates.map((date, index) => (
                        <th key={index} className="px-4 py-4 text-center bg-gray-50 min-w-40">
                          <div className="font-bold text-gray-800 text-base">
                            {date.toLocaleDateString('en-US', { weekday: 'long' })}
                          </div>
                          <div className="text-sm text-red-500 font-semibold mt-1">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {timeSlots.map(time => (
                      <tr key={time} className="hover:bg-gray-50/50 transition-all duration-200">
                        <td className="px-6 py-6 text-center font-bold text-gray-700 bg-gray-50 border-r border-gray-200 sticky left-0">
                          <div className="text-base">{time}</div>
                        </td>
                        {weekDates.map((date, index) => {
                          const classItem = getClassAtTime(date, time)
                          const isSpanSlot = isNesmaSpanSlot(date, time)
                          
                          // Skip rendering if this is a 10:00 slot occupied by NESMA spanning from 09:00
                          if (isSpanSlot) {
                            return null
                          }
                          
                          return (
                            <td key={index} className="px-3 py-3 relative border-r border-gray-100">
                              {classItem ? (
                                <div 
                                  onClick={() => handleClassClick(classItem)}
                                  className={`
                                    relative rounded-lg p-4 h-24 flex flex-col justify-center border-2 shadow-sm cursor-pointer
                                    transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1
                                    ${getSubjectColor(classItem.group)}
                                  `}
                                >
                                  <div className="font-bold text-sm mb-1 leading-tight">
                                    {classItem.subject || classItem.group}
                                  </div>
                                  <div className="text-xs opacity-80 leading-tight">
                                    {classItem.teacher || 'Group: ' + classItem.group}
                                  </div>
                                  <div className="text-xs opacity-70 mt-1">
                                    {classItem.time} - {getEndTime(classItem.time)}
                                  </div>
                                  {isClassLive(classItem) && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg">
                                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="h-24 flex items-center justify-center">
                                  <div className="w-full h-full bg-gray-50 rounded border border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                                    <span className="text-xs">—</span>
                                  </div>
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Daily View - Mobile Friendly */}
        {viewMode === 'daily' && (
          <div>
            {/* Day Selector */}
            <div className="flex gap-1 sm:gap-2 mb-6 pb-2 overflow-x-auto scrollbar-hide">
              {weekDates.map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-3 rounded-lg text-xs sm:text-sm font-medium transition-colors min-w-[70px] sm:min-w-[80px] ${
                    selectedDay === index
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </button>
              ))}
            </div>

            {/* Daily Schedule */}
            <div className="space-y-3">
              {timeSlots.map(time => {
                const classItem = getClassAtTime(weekDates[selectedDay], time)
                const isSpanSlot = isNesmaSpanSlot(weekDates[selectedDay], time)
                
                if (isSpanSlot) return null
                
                return (
                  <div key={time} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-16 text-sm font-semibold text-gray-900">
                        {time}
                      </div>
                      {classItem ? (
                        <div 
                          onClick={() => handleClassClick(classItem)}
                          className={`
                            flex-1 ml-4 p-4 rounded-lg border-2 cursor-pointer
                            transition-all duration-200 hover:shadow-md
                            ${getSubjectColor(classItem.group)}
                          `}
                        >
                          <div className="font-bold text-base mb-1">
                            {classItem.subject || classItem.group}
                          </div>
                          <div className="text-sm opacity-80">
                            {classItem.teacher || 'Group: ' + classItem.group}
                          </div>
                          <div className="text-xs opacity-70 mt-2">
                            {classItem.time} - {getEndTime(classItem.time)}
                          </div>
                          {isClassLive(classItem) && (
                            <div className="flex items-center mt-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                              <span className="text-xs text-red-600 font-semibold">LIVE</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex-1 ml-4 p-6 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                          <span className="text-sm">No class scheduled</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Schedule
