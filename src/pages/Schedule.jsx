import { useState, useEffect } from 'react'
import { useTheme } from '../components/ThemeContext'

const Schedule = () => {
  const { theme } = useTheme()
  const [weeklySchedule, setWeeklySchedule] = useState(null)
  const [loading, setLoading] = useState(true)

  // Subject color mapping for beautiful timetable design
  const subjectColors = {
    'DABAL': 'bg-orange-200 border-orange-300 text-orange-900',
    'SAIPEM': 'bg-cyan-200 border-cyan-300 text-cyan-900',
    'SAM': 'bg-blue-200 border-blue-300 text-blue-900',
    'NESMA': 'bg-yellow-200 border-yellow-300 text-yellow-900',
    'ALFA': 'bg-purple-200 border-purple-300 text-purple-900',
    'DEYE': 'bg-green-200 border-green-300 text-green-900',
    'default': 'bg-gray-200 border-gray-300 text-gray-900'
  }

  // Time slots for the static yearly timetable
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
  ]

  // Working days (Sunday to Thursday)
  const workingDays = [
    { name: 'Sunday', short: 'Sun', key: 'sunday' },
    { name: 'Monday', short: 'Mon', key: 'monday' }, 
    { name: 'Tuesday', short: 'Tue', key: 'tuesday' },
    { name: 'Wednesday', short: 'Wed', key: 'wednesday' },
    { name: 'Thursday', short: 'Thu', key: 'thursday' }
  ]

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    try {
      const response = await fetch('/data/weekly_schedule_template.json')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setWeeklySchedule(data)
    } catch (error) {
      console.error('Error loading weekly schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get class for a specific day and time
  const getClassAtTime = (dayKey, time) => {
    if (!weeklySchedule?.weekly_schedule?.[dayKey]) return null
    return weeklySchedule.weekly_schedule[dayKey].find(item => item.time === time)
  }

  // Helper function to get subject color based on group
  const getSubjectColor = (group) => {
    const groupName = group.toUpperCase()
    if (groupName.includes('DABAL')) return subjectColors['DABAL']
    if (groupName.includes('SAIPEM')) return subjectColors['SAIPEM']
    if (groupName.includes('SAM')) return subjectColors['SAM']
    if (groupName.includes('NESMA')) return subjectColors['NESMA']
    if (groupName.includes('ALFA')) return subjectColors['ALFA']
    if (groupName.includes('DEYE')) return subjectColors['DEYE']
    return subjectColors['default']
  }

  // Helper function to calculate end time
  const getEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const endHour = hours + 1
    return `${endHour}:${minutes.toString().padStart(2, '0')}`
  }

  // Helper function to check if a class is currently active
  const isClassActive = (startTime) => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute
    
    const [classHour, classMinute] = startTime.split(':').map(Number)
    const classStartInMinutes = classHour * 60 + classMinute
    const classEndInMinutes = classStartInMinutes + 60 // 1 hour duration
    
    return currentTimeInMinutes >= classStartInMinutes && currentTimeInMinutes < classEndInMinutes
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Teaching Schedule</h1>
          </div>
        </div>

        {/* Static Yearly Timetable */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          
          {/* Beautiful Timetable Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white p-1 sm:p-2 rounded">
                <span className="text-lg sm:text-2xl">📅</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Weekly Timetable</h2>
              </div>
            </div>
          </div>

          {/* Timetable Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px] sm:min-w-[900px] transform scale-75 sm:scale-90 md:scale-100 origin-top-left">
              <table className="w-full">
                
                {/* Table Header */}
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold text-gray-700 bg-gray-100 w-16 sm:w-24 sticky left-0">
                      <div className="text-xs sm:text-sm">Time</div>
                    </th>
                    {workingDays.map((day, index) => (
                      <th key={index} className="px-2 sm:px-4 py-3 sm:py-4 text-center bg-gray-50 min-w-32 sm:min-w-40">
                        <div className="font-bold text-gray-800 text-sm sm:text-base">
                          {day.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                          {day.short}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
              
              {/* Table Body - Time Slots */}
              <tbody className="divide-y divide-gray-100">
                {timeSlots.map((time, timeIndex) => (
                  <tr key={time} className="hover:bg-gray-50/50 transition-all duration-200">
                    
                    {/* Time Column */}
                    <td className="px-2 sm:px-6 py-4 sm:py-6 text-center font-bold text-gray-700 bg-gray-50 border-r border-gray-200 sticky left-0">
                      <div className="text-xs sm:text-base">{time}</div>
                    </td>
                    
                    {/* Day Columns */}
                    {workingDays.map((day, dayIndex) => {
                      const classItem = getClassAtTime(day.key, time)
                      
                      return (
                        <td key={dayIndex} className="px-1 sm:px-3 py-2 sm:py-3 relative border-r border-gray-100">
                          <div className="h-16 sm:h-24 flex items-center justify-center">
                            {classItem ? (
                              <div className={`
                                w-full h-full rounded-lg p-2 sm:p-3 flex flex-col justify-center border-2 shadow-sm
                                transition-all duration-200 hover:shadow-md hover:scale-105 relative
                                ${getSubjectColor(classItem.group)}
                              `}>
                                {/* Online indicator for NESMA */}
                                {classItem.group.toUpperCase().includes('NESMA') && (
                                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex items-center space-x-1">
                                    {/* Pulsing green dot when class is active */}
                                    {isClassActive(classItem.time) && (
                                      <div className="relative">
                                        <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <div className="absolute top-0 left-0 w-2 sm:w-3 h-2 sm:h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
                                      </div>
                                    )}
                                    <div className="bg-red-500 text-white text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium shadow-sm">
                                      ONLINE
                                    </div>
                                  </div>
                                )}
                                <div className="font-bold text-xs sm:text-sm mb-1 leading-tight">
                                  {classItem.group}
                                </div>
                                <div className="text-[10px] sm:text-xs opacity-80 leading-tight">
                                  {classItem.subject || 'English'}
                                </div>
                                <div className="text-[10px] sm:text-xs opacity-70 mt-1">
                                  {classItem.time} - {getEndTime(classItem.time)}
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-gray-300 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                                <span className="text-[10px] sm:text-xs font-medium">Empty Slot</span>
                              </div>
                            )}
                          </div>
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
      </div>
    </div>
  )
}

export default Schedule
