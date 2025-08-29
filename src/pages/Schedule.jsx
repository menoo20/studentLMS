import { useState, useEffect } from 'react'
import { useTheme } from '../components/ThemeContext'

const Schedule = () => {
  const { theme } = useTheme()
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(new Date())

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

  const getWeekDates = (date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day // Adjust for Sunday start (Arabic countries)
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
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
    setCurrentWeek(new Date())
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
            <h3 className={`text-xl font-semibold ${theme === 'blackGold' ? 'text-white' : 'text-gray-900'}`}>
              Week of {formatDate(weekDates[0])} — {formatDate(weekDates[6])}
            </h3>
            <p className={`text-sm mt-2 ${theme === 'blackGold' ? 'text-gray-300' : 'text-gray-600'}`}>
              Your weekly teaching schedule • {timeSlots.length} time slots • Sunday-based week
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50/80 w-24 min-w-24">Time</th>
                  {weekDates.map((date, index) => (
                    <th key={index} className="px-6 py-4 text-center min-w-48 w-48 bg-gray-50/80">
                      <div className="font-semibold text-gray-900 text-sm">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
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
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 bg-gray-50/50 border-r border-gray-100 w-24 min-w-24">
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
                          className="px-3 py-4 text-center relative w-48 min-w-48"
                          rowSpan={classItem && classItem.group === 'NESMA' ? 2 : 1}
                        >
                          {classItem ? (
                            <div className={`
                              ${classItem.group === 'NESMA' 
                                ? theme === 'blackGold' 
                                  ? 'bg-gradient-to-br from-blackGold-400 via-blackGold-500 to-blackGold-600 text-black shadow-xl shadow-blackGold-500/40 border-2 border-blackGold-300' 
                                  : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/40 border-2 border-blue-300'
                                : theme === 'blackGold'
                                  ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-lg shadow-gray-700/30'
                                  : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                              }
                              ${classItem.group === 'NESMA' 
                                ? 'rounded-2xl min-h-32 relative overflow-hidden' 
                                : 'rounded-xl min-h-24'
                              }
                              p-3 text-sm transition-all duration-200 hover:scale-105 hover:shadow-xl
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
                                    <div className={`p-2 rounded-full ${theme === 'blackGold' ? 'bg-white/10' : 'bg-white/20'}`}>
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
                                  <div className={`text-xs flex items-center justify-center gap-1 ${theme === 'blackGold' ? 'text-black/80' : 'text-white/90'}`}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                    </svg>
                                    <span className="font-semibold">Online Class</span>
                                  </div>
                                  <div className={`text-lg font-bold ${theme === 'blackGold' ? 'text-black' : 'text-white'}`}>
                                    9:00 - 11:00 AM
                                  </div>
                                  {classItem.duration && (
                                    <div className={`text-xs font-semibold px-3 py-1 rounded-full
                                      ${theme === 'blackGold' ? 'bg-black/15 text-black' : 'bg-white/25 text-white'}
                                    `}>
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
                  ${theme === 'blackGold' ? 'bg-gray-800/30 hover:bg-gray-800/50' : 'bg-gray-50 hover:bg-gray-100'}
                  border ${theme === 'blackGold' ? 'border-gray-700' : 'border-gray-200'}
                `}>
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-3 h-3 rounded-full flex-shrink-0
                      ${item.group === 'NESMA' 
                        ? theme === 'blackGold' ? 'bg-blackGold-500' : 'bg-blue-500'
                        : theme === 'blackGold' ? 'bg-gray-500' : 'bg-indigo-500'
                      }
                    `}></div>
                    <div>
                      <div className={`font-semibold ${theme === 'blackGold' ? 'text-white' : 'text-gray-900'}`}>
                        {item.subject} • {item.group}
                      </div>
                      <div className={`text-sm flex items-center gap-2 mt-1 ${theme === 'blackGold' ? 'text-gray-300' : 'text-gray-600'}`}>
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
                    <div className={`text-sm font-semibold ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-blue-600'}`}>
                      {new Date(item.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className={`text-sm font-mono ${theme === 'blackGold' ? 'text-gray-300' : 'text-gray-600'}`}>
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
