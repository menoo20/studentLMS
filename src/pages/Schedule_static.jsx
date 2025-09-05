import { useState } from 'react'
import { useTheme } from '../components/ThemeContext'

const Schedule = () => {
  const { theme } = useTheme()

  // Time slots for the static yearly timetable
  const timeSlots = [
    '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ]

  // Working days (Sunday to Thursday)
  const workingDays = [
    { name: 'Sunday', short: 'Sun' },
    { name: 'Monday', short: 'Mon' }, 
    { name: 'Tuesday', short: 'Tue' },
    { name: 'Wednesday', short: 'Wed' },
    { name: 'Thursday', short: 'Thu' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Teaching Schedule</h1>
            <p className="text-gray-600">
              Yearly Weekly Template • {timeSlots.length} time slots • Working days (Sunday-Thursday)
            </p>
          </div>
        </div>

        {/* Static Yearly Timetable */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          
          {/* Beautiful Timetable Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Weekly Timetable</h2>
                <p className="text-blue-100 text-sm">Static template for the entire year</p>
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded text-blue-600 font-medium cursor-pointer hover:bg-blue-50 transition-colors">
              Actions ▼
            </div>
          </div>

          {/* Timetable Grid */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              
              {/* Table Header */}
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 bg-gray-100 w-24 sticky left-0">
                    <div>Time</div>
                  </th>
                  {workingDays.map((day, index) => (
                    <th key={index} className="px-4 py-4 text-center bg-gray-50 min-w-40">
                      <div className="font-bold text-gray-800 text-base">
                        {day.name}
                      </div>
                      <div className="text-sm text-gray-500 font-medium mt-1">
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
                    <td className="px-6 py-6 text-center font-bold text-gray-700 bg-gray-50 border-r border-gray-200 sticky left-0">
                      <div className="text-base">{time}</div>
                    </td>
                    
                    {/* Day Columns */}
                    {workingDays.map((day, dayIndex) => (
                      <td key={dayIndex} className="px-3 py-3 relative border-r border-gray-100">
                        <div className="h-24 flex items-center justify-center">
                          <div className="w-full h-full bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-gray-300 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                            <span className="text-xs font-medium">Empty Slot</span>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">Template Info:</span> {timeSlots.length} time slots × {workingDays.length} working days = {timeSlots.length * workingDays.length} total slots
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="font-medium">Duration:</span> 1 hour per slot
              </div>
            </div>
          </div>
        </div>

        {/* Legend/Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          
          {/* Time Slots Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded">
                <span className="text-lg">⏰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Time Slots</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {timeSlots.length} hourly time slots from {timeSlots[0]} to {timeSlots[timeSlots.length - 1]}
            </p>
            <div className="flex flex-wrap gap-1">
              {timeSlots.map((time) => (
                <span key={time} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                  {time}
                </span>
              ))}
            </div>
          </div>

          {/* Working Days Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded">
                <span className="text-lg">📅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Working Days</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {workingDays.length} working days per week (Sunday to Thursday)
            </p>
            <div className="flex flex-wrap gap-1">
              {workingDays.map((day) => (
                <span key={day.name} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  {day.short}
                </span>
              ))}
            </div>
          </div>

          {/* Template Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-100 p-2 rounded">
                <span className="text-lg">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Template</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Static yearly template - no dynamic dates or navigation
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Same layout all year</li>
              <li>• Ready for class scheduling</li>
              <li>• {timeSlots.length * workingDays.length} total slots available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Schedule
