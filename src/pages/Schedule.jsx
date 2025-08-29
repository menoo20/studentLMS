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
        <h2 className={`text-2xl font-bold ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-900'}`}>Teaching Schedule</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousWeek}
            className="btn-secondary"
          >
            ← Previous Week
          </button>
          <button
            onClick={goToCurrentWeek}
            className="btn-primary"
          >
            Current Week
          </button>
          <button
            onClick={goToNextWeek}
            className="btn-secondary"
          >
            Next Week →
          </button>
        </div>
      </div>

      {schedule.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className={`text-xl font-semibold mb-2 ${theme === 'blackGold' ? 'text-blackGold-500' : 'text-gray-900'}`}>No Schedule Data</h3>
          <p className={`mb-6 ${theme === 'blackGold' ? 'text-white' : 'text-gray-600'}`}>
            Add your schedule.json file to the /data folder to display your teaching schedule.
          </p>
          <div className="text-left max-w-md mx-auto bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Expected format:</p>
            <pre className="text-xs text-gray-600 overflow-x-auto">
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
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Week of {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header px-4 py-3 text-left w-20">Time</th>
                  {weekDates.map((date, index) => (
                    <th key={index} className="table-header px-4 py-3 text-center min-w-32">
                      <div className="font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-xs font-normal text-gray-500">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map(time => (
                  <tr key={time} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      {time}
                    </td>
                    {weekDates.map((date, index) => {
                      const classItem = getClassAtTime(date, time)
                      return (
                        <td key={index} className="px-4 py-3 text-center">
                          {classItem ? (
                            <div className="bg-primary-100 text-primary-800 rounded-lg p-2 text-xs">
                              <div className="font-semibold">{classItem.subject}</div>
                              <div className="text-primary-600">{classItem.group}</div>
                              <div className="text-primary-600">{classItem.room}</div>
                              {classItem.type && (
                                <div className="mt-1 text-primary-500 text-xs">
                                  {classItem.type}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-300">-</div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Classes</h3>
          <div className="space-y-2">
            {schedule
              .filter(item => new Date(item.date + 'T' + item.time) > new Date())
              .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
              .slice(0, 5)
              .map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{item.subject}</div>
                    <div className="text-sm text-gray-600">{item.group} • {item.room}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(item.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-gray-600">{item.time}</div>
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
