import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTheme } from '../components/ThemeContext'

const Schedule = () => {
  const { theme } = useTheme()
  const [searchParams] = useSearchParams()
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(new Date('2025-08-24')) // Start with the week containing our schedule data
  const [viewMode, setViewMode] = useState('week') // 'week', 'daily'
  const [selectedDay, setSelectedDay] = useState(0)
  const [highlightGroup, setHighlightGroup] = useState(null)

  // Auto-switch to daily view on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setViewMode('daily')
        // Set to Sunday (day 0) when switching to daily view
        setSelectedDay(0)
      }
    }
    
    handleResize() // Check on mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const basePath = import.meta.env.PROD ? '/my-annual-plan' : ''
        const response = await fetch(`${basePath}/data/schedule.json`)
        const data = await response.json()
        setSchedule(data)
      } catch (error) {
        console.error('Error loading schedule:', error)
        setSchedule([])
      } finally {
        setLoading(false)
      }
    }

    loadSchedule()
  }, [])

  // Handle URL parameters for group highlighting
  useEffect(() => {
    const highlightParam = searchParams.get('highlight')
    if (highlightParam) {
      setHighlightGroup(highlightParam.toLowerCase())
    }
  }, [searchParams])

  // Reset to Sunday when week changes
  useEffect(() => {
    setSelectedDay(0)
  }, [currentWeek])

  const getWeekDates = (date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    
    // Calculate Sunday as start of week (day 0)
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)

    // Only add Sunday through Thursday (5 working days)
    for (let i = 0; i < 5; i++) {
      const workDay = new Date(startOfWeek)
      workDay.setDate(startOfWeek.getDate() + i)
      week.push(workDay)
    }
    return week
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getScheduleForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return schedule.filter(item => item.date === dateStr)
  }

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00'
  ]

  const getClassAtTime = (date, time) => {
    const daySchedule = getScheduleForDate(date)
    return daySchedule.find(item => item.time === time)
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
    const classDate = new Date(classItem.date + 'T' + classItem.time)
    const classEndTime = new Date(classDate.getTime() + 120 * 60000) // Add 120 minutes (2 hours)
    
    // Check if current time is between class start and end time
    return now >= classDate && now <= classEndTime
  }

  const weekDates = getWeekDates(currentWeek)

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
    // Go to the week containing our main schedule data (Aug 24-28, 2025)
    setCurrentWeek(new Date('2025-08-24'))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className={`text-lg ${theme === 'blackGold' ? 'text-white' : 'text-gray-600'}`}>Loading schedule...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-3xl font-bold ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-900'}`}>Teaching Schedule</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={goToPreviousWeek}
            className={`
              px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200
              ${theme === 'blackGold' 
                ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }
              hover:scale-105 hover:shadow-lg flex items-center gap-2
            `}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            Previous Week
          </button>
          <button
            onClick={goToCurrentWeek}
            className={`
              px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-200
              ${theme === 'blackGold' 
                ? 'bg-blackGold-500 text-black hover:bg-blackGold-400 shadow-lg shadow-blackGold-500/30' 
                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30'
              }
              hover:scale-105 hover:shadow-xl
            `}
          >
            Current Week
          </button>
          <button
            onClick={goToNextWeek}
            className={`
              px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200
              ${theme === 'blackGold' 
                ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }
              hover:scale-105 hover:shadow-lg flex items-center gap-2
            `}
          >
            Next Week
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      {schedule.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-8xl mb-6">📅</div>
          <h3 className={`text-2xl font-bold mb-4 ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-900'}`}>
            No Schedule Data
          </h3>
          <p className={`text-lg mb-8 ${theme === 'blackGold' ? 'text-white' : 'text-gray-600'}`}>
            Add your schedule.json file to the /data folder to display your teaching schedule.
          </p>
          <div className={`text-left max-w-lg mx-auto rounded-xl p-6 ${theme === 'blackGold' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
            <p className={`text-sm font-semibold mb-3 ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-700'}`}>
              Expected JSON format:
            </p>
            <pre className={`text-xs overflow-x-auto font-mono p-3 rounded-lg ${theme === 'blackGold' ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-600'}`}>
{`[
  {
    "id": "1",
    "date": "2024-01-15",
    "time": "09:00",
    "subject": "Mathematics",
    "group": "Group A",
    "room": "Room 101",
    "type": "Lecture"
  }
]`}
            </pre>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h3 className={`text-xl font-semibold text-gray-900`}>
                  Week of {formatDate(weekDates[0])} — {formatDate(weekDates[4])}
                </h3>
                <p className={`text-sm mt-2 text-gray-600`}>
                  Your weekly teaching schedule • {timeSlots.length} time slots • Working days (Sun-Thu)
                </p>
              </div>
              
              {/* View Mode Controls - Hidden on mobile (auto-switches) */}
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'week'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📅 Week View
                </button>
                <button
                  onClick={() => setViewMode('daily')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'daily'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📱 Daily View
                </button>
              </div>
            </div>
          </div>

          {/* Week View - Responsive Table Layout */}
          {viewMode === 'week' && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50/80 w-16 min-w-16">Time</th>
                    {weekDates.map((date, index) => (
                      <th key={index} className="px-3 py-4 text-center min-w-40 w-40 bg-gray-50/80">
                        <div className="font-semibold text-gray-900 text-xs sm:text-sm">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-xs font-normal text-gray-500 mt-1">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {timeSlots.map(time => (
                  <tr key={time} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="px-3 py-4 text-sm font-semibold text-gray-900 bg-gray-50/50 border-r border-gray-100 w-16 min-w-16">
                      <div className="font-mono text-sm">{time}</div>
                    </td>
                    {weekDates.map((date, index) => {
                      const classItem = getClassAtTime(date, time)
                      const isSpanSlot = isNesmaSpanSlot(date, time)
                      
                      // Skip rendering if this is a 10:00 slot occupied by NESMA spanning from 09:00
                      if (isSpanSlot) {
                        return null
                      }
                      
                      return (
                        <td 
                          key={index} 
                          className="px-3 py-4 text-center relative w-40 min-w-40"
                          rowSpan={classItem && classItem.group === 'NESMA' ? 2 : 1}
                        >
                          {classItem ? (
                            <div className={`
                              ${classItem.group === 'NESMA' 
                                ?  'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/40 border-2 border-blue-300'
                                :  'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                              }
                              ${classItem.group === 'NESMA' 
                                ? 'rounded-xl min-h-28 relative overflow-hidden' 
                                : 'rounded-lg min-h-20'
                              }
                              ${highlightGroup && classItem.group.toLowerCase().includes(highlightGroup) 
                                ? 'ring-4 ring-yellow-300 ring-opacity-60 transform scale-105 shadow-2xl' 
                                : ''
                              }
                              p-2 text-xs transition-all duration-200 hover:scale-105 hover:shadow-xl
                              border border-white/20 w-full
                            `}>
                              {/* NESMA Online Class Special Design */}
                              {classItem.group === 'NESMA' && (
                                <>
                                  {/* Live indicator badge - only show during class time */}
                                  {isClassLive(classItem) && (
                                    <div className={`absolute top-2 right-2 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold
                                      ${theme === 'blackGold' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}
                                      shadow-lg animate-pulse
                                    `}>
                                      {/* Red live indicator dot */}
                                      <div className="w-2 h-2 bg-red-300 rounded-full animate-ping"></div>
                                      <span>LIVE</span>
                                    </div>
                                  )}
                                  
                                  {/* Zoom logo */}
                                  <div className="flex items-center justify-center mb-2">
                                    <div className={`p-2 rounded-full bg-white/20`}>
                                      <img 
                                        src={`${import.meta.env.PROD ? '/my-annual-plan' : ''}/images/zoom_logo.png`}
                                        alt="Zoom"
                                        className="w-6 h-6 object-contain"
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                              
                              <div className={`font-semibold text-sm leading-tight mb-1 ${classItem.group === 'NESMA' ? 'text-center' : ''}`}>
                                {classItem.subject}
                              </div>
                              <div className={`opacity-90 text-xs font-medium mb-2 ${classItem.group === 'NESMA' ? 'text-center font-bold' : ''}`}>
                                {classItem.group}
                              </div>
                              
                              {classItem.group === 'NESMA' ? (
                                <div className="text-center space-y-2">
                                  <div className={`text-xs flex items-center justify-center gap-1 text-white/90`}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                    </svg>
                                    <span className="font-semibold">Online Class</span>
                                  </div>
                                  <div className={`text-lg font-bold text-white`}>
                                    9:00 - 11:00 AM
                                  </div>
                                  {classItem.duration && (
                                    <div className={`text-xs font-semibold px-3 py-1 rounded-full bg-white/25 text-white`}>                               
                                      {classItem.duration}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <div className="opacity-75 text-xs flex items-center justify-center gap-1 mb-2">
                                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="truncate">{classItem.room}</span>
                                  </div>
                                  {classItem.duration && (
                                    <div className="opacity-60 text-xs font-normal bg-black/10 px-2 py-1 rounded-full">
                                      {classItem.duration}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="h-24 flex items-center justify-center">
                              <div className="text-gray-300 text-xs">—</div>
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
          )}

          {/* Daily View - Mobile Friendly */}
          {viewMode === 'daily' && (
            <div>
              {/* Day Selector */}
              <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                {weekDates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`flex-shrink-0 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
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
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {weekDates[selectedDay].toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                
                {timeSlots.map(time => {
                  const classItem = getClassAtTime(weekDates[selectedDay], time)
                  return (
                    <div key={time} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-20">
                        <div className="font-mono text-sm font-semibold text-gray-900">{time}</div>
                      </div>
                      <div className="flex-1">
                        {classItem ? (
                          <div className={`
                            ${classItem.group === 'NESMA' 
                              ?  'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/40 border-2 border-blue-300'
                              :  'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                            }
                            ${highlightGroup && classItem.group.toLowerCase().includes(highlightGroup) 
                              ? 'ring-4 ring-yellow-300 ring-opacity-60 transform scale-105 shadow-2xl' 
                              : ''
                            }
                            p-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl
                            border border-white/20
                          `}>
                            <div className="font-semibold text-sm mb-1">{classItem.subject}</div>
                            <div className="opacity-90 text-xs font-medium mb-2">{classItem.group}</div>
                            
                            {classItem.group === 'NESMA' ? (
                              <div className="text-xs text-white/90 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                </svg>
                                <span>Online Class</span>
                              </div>
                            ) : (
                              <>
                                <div className="text-xs text-white/80 mb-1">📍 {classItem.location}</div>
                                <div className="text-xs text-white/80">{classItem.duration}</div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm italic">No class scheduled</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Upcoming Classes */}
      {schedule.length > 0 && (
        <div className="card">
          <h3 className={`text-xl font-semibold mb-6 ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-900'}`}>
            📅 Upcoming Classes
          </h3>
          <div className="space-y-3">
            {schedule
              .filter(item => new Date(item.date + 'T' + item.time) > new Date())
              .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
              .slice(0, 5)
              .map(item => (
                <div key={item.id} className={`
                  flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]
                  ${theme === 'blackGold' 
                    ? 'bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg border border-gray-200' 
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }
                `}>
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-3 h-3 rounded-full flex-shrink-0
                      ${item.group === 'NESMA' 
                        ? theme === 'blackGold' ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg' : 'bg-blue-500'
                        : theme === 'blackGold' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' : 'bg-indigo-500'
                      }
                    `}></div>
                    <div>
                      <div className={`font-semibold ${theme === 'blackGold' ? 'text-gray-900' : 'text-gray-900'}`}>
                        {item.subject} • {item.group}
                      </div>
                      <div className={`text-sm flex items-center gap-2 mt-1 ${theme === 'blackGold' ? 'text-gray-600' : 'text-gray-600'}`}>
                        {item.room === 'Online' ? (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                            </svg>
                            Online Class
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                            </svg>
                            {item.room}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-sm font-semibold ${theme === 'blackGold' ? 'text-blue-600' : 'text-blue-600'}`}>
                      {new Date(item.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className={`text-sm font-mono ${theme === 'blackGold' ? 'text-gray-700' : 'text-gray-600'}`}>
                      {item.time}
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

export default Schedule
