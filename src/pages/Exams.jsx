import React, { useState, useEffect } from 'react'

// Marks Protection System - prevents data loss
class MarksProtectionSystem {
  constructor() {
    this.backupPrefix = 'marks_backup_';
    this.maxBackups = 50;
    this.isUpdating = false;
  }

  createBackup(data, action = 'save') {
    try {
      const timestamp = new Date().toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .substring(0, 19);
      const backupName = `${this.backupPrefix}${action}_${timestamp}`;
      
      localStorage.setItem(backupName, JSON.stringify(data, null, 2));
      console.log(`📦 Created backup: ${backupName}`);
      return backupName;
    } catch (error) {
      console.error('Failed to create backup:', error);
      return null;
    }
  }

  async safeUpdateMarks(newMark) {
    if (this.isUpdating) {
      console.warn('⚠️ Another update is in progress, waiting...');
      while (this.isUpdating) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    this.isUpdating = true;
    
    try {
      console.log('🛡️ Starting safe mark update for student:', newMark.studentId);
      
      // Load current marks
      const currentMarks = JSON.parse(localStorage.getItem('marks') || '[]');
      console.log(`📊 Current marks count: ${currentMarks.length}`);
      
      // Create backup before changes
      const backupName = this.createBackup(currentMarks, 'before_update');
      if (!backupName) {
        throw new Error('Failed to create backup');
      }
      
      // Check for existing mark
      const existingMarkIndex = currentMarks.findIndex(mark => 
        mark.studentId === newMark.studentId && mark.examId === newMark.examId
      );
      
      let updatedMarks;
      if (existingMarkIndex >= 0) {
        updatedMarks = [...currentMarks];
        updatedMarks[existingMarkIndex] = { ...updatedMarks[existingMarkIndex], ...newMark };
        console.log(`🔄 Updated existing mark for student ${newMark.studentId}`);
      } else {
        updatedMarks = [...currentMarks, newMark];
        console.log(`➕ Added new mark for student ${newMark.studentId}`);
      }
      
      // Atomic write with verification
      const serializedData = JSON.stringify(updatedMarks, null, 2);
      localStorage.setItem('marks_temp', serializedData);
      
      // Verify temp write
      if (localStorage.getItem('marks_temp') !== serializedData) {
        throw new Error('Temp write verification failed');
      }
      
      // Move to main location
      localStorage.setItem('marks', serializedData);
      
      // Verify main write
      if (localStorage.getItem('marks') !== serializedData) {
        throw new Error('Main write verification failed');
      }
      
      localStorage.removeItem('marks_temp');
      
      // Create success backup
      this.createBackup(updatedMarks, 'after_update');
      
      console.log(`✅ Successfully saved ${updatedMarks.length} marks with protection`);
      
      return { success: true, count: updatedMarks.length, action: existingMarkIndex >= 0 ? 'updated' : 'added' };
      
    } catch (error) {
      console.error('❌ Protected update failed:', error);
      return { success: false, error: error.message };
    } finally {
      this.isUpdating = false;
    }
  }
}

// Global protection instance
const marksProtection = new MarksProtectionSystem();

// Reports Content Component
const ReportsContent = ({ reportData, selectedExamFilter, hideNonEvaluated, allExams, groups }) => {
  // Sorting state
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'desc' })
  
  // Get current exam name if filtering by specific exam
  const currentExamName = selectedExamFilter !== 'all' 
    ? allExams.find(e => e.id === selectedExamFilter)?.name || 'Unknown Exam'
    : 'All Exams'

  // Sort function
  const handleSort = (key) => {
    let direction = 'desc'
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc'
    }
    setSortConfig({ key, direction })
  }

  // Apply sorting to student data
  const sortedStudents = React.useMemo(() => {
    if (!sortConfig.key) return reportData.students

    return [...reportData.students].sort((a, b) => {
      let aValue, bValue

      if (sortConfig.key === 'name') {
        aValue = a.student.name
        bValue = b.student.name
        // For names, use alphabetical sorting
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue, 'ar')
          : bValue.localeCompare(aValue, 'ar')
      } else if (sortConfig.key === 'average') {
        aValue = parseFloat(a.averagePercentage || 0)
        bValue = parseFloat(b.averagePercentage || 0)
      } else {
        // Exam scores
        const aExamData = a.examScores[sortConfig.key]
        const bExamData = b.examScores[sortConfig.key]
        aValue = aExamData ? parseFloat(aExamData.percentage || 0) : 0
        bValue = bExamData ? parseFloat(bExamData.percentage || 0) : 0
      }

      if (sortConfig.direction === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })
  }, [reportData.students, sortConfig])

  // Sort arrow component
  const SortArrow = ({ column, currentSort }) => {
    if (currentSort.key !== column) {
      return (
        <span className="inline-flex flex-col ml-1 opacity-30">
          <svg className="w-3 h-3 -mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
          <svg className="w-3 h-3 rotate-180" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </span>
      )
    }

    return (
      <span className="inline-flex ml-1">
        <svg 
          className={`w-3 h-3 ${currentSort.direction === 'desc' ? 'text-blue-600' : 'opacity-30'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
        <svg 
          className={`w-3 h-3 -ml-1 rotate-180 ${currentSort.direction === 'asc' ? 'text-blue-600' : 'opacity-30'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Group Info Header */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">
          📊 {reportData.groupInfo.name} Report
          {selectedExamFilter !== 'all' && (
            <span className="text-sm font-normal text-blue-700 ml-2">
              (Showing: {currentExamName})
            </span>
          )}
        </h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Students: </span>
            <span className="font-medium">
              {reportData.students.length}
              {hideNonEvaluated && (
                <span className="text-xs text-blue-600 ml-1">(evaluated only)</span>
              )}
            </span>
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
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      Student Name
                      <SortArrow column="name" currentSort={sortConfig} />
                    </button>
                  </th>
                  {reportData.exams.map(exam => (
                    <th key={exam.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      <button
                        onClick={() => handleSort(exam.id)}
                        className="flex flex-col items-center hover:text-gray-700 transition-colors cursor-pointer w-full"
                      >
                        <div className="flex items-center">
                          <span className="font-semibold">{exam.name}</span>
                          <SortArrow column={exam.id} currentSort={sortConfig} />
                        </div>
                        <div className="text-xs text-gray-400">
                          {exam.type} • Max: {exam.maxScore}
                        </div>
                      </button>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-yellow-50 sticky right-0">
                    <button
                      onClick={() => handleSort('average')}
                      className="flex items-center justify-center hover:text-gray-700 transition-colors cursor-pointer w-full"
                    >
                      Average
                      <SortArrow column="average" currentSort={sortConfig} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStudents.map((studentData, index) => (
                  <tr key={studentData.student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-inherit">
                      <div className="flex items-center">
                        <div className="w-9 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-blue-800">
                            {(() => {
                              const group = groups?.find(g => g.id === studentData.student.groupId);
                              const groupName = group?.name || studentData.student.groupId || 'N/A';
                              
                              // Smart abbreviation: first 3 letters + number
                              // Extract number from group name (sam1, sam2, saipem3, etc.)
                              const numberMatch = groupName.match(/(\d+)$/);
                              const number = numberMatch ? numberMatch[1] : '';
                              
                              // Get first 3 letters of the base name (without number)
                              const baseName = groupName.replace(/\d+$/, '').toLowerCase();
                              const shortName = baseName.substring(0, 3);
                              
                              // Return abbreviated form: sam1, sai3, alf2, dab, etc.
                              return shortName + number;
                            })()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {studentData.student.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {studentData.student.id} • Group: {(() => {
                              const group = groups?.find(g => g.id === studentData.student.groupId);
                              return group?.name || studentData.student.groupId || 'Unknown';
                            })()}
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
  const [selectedExamFilter, setSelectedExamFilter] = useState('all')
  const [hideNonEvaluated, setHideNonEvaluated] = useState(false)

  const basePath = import.meta.env.PROD ? '/studentLMS' : ''

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
    let groupStudents = groupId === 'all' 
      ? students 
      : students.filter(s => s.groupId === groupId)

    // Get exams for the selected group (or all exams if group is 'all')
    let groupExams = groupId === 'all' 
      ? exams 
      : exams.filter(e => {
          // Exam is available if:
          // 1. It has no assignedGroups (available to all), OR
          // 2. It has assignedGroups and includes this groupId, OR  
          // 3. Legacy: it has groupId that matches (backward compatibility)
          return !e.assignedGroups || 
                 (e.assignedGroups && e.assignedGroups.includes(groupId)) ||
                 (!e.assignedGroups && !e.groupId) ||
                 (e.groupId === groupId)
        })

    // Filter exams by specific exam if selected
    if (selectedExamFilter !== 'all') {
      groupExams = groupExams.filter(e => e.id === selectedExamFilter)
    }

    // Create report data for each student
    let reportData = groupStudents.map(student => {
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

    // Filter out non-evaluated students if hideNonEvaluated is true
    if (hideNonEvaluated) {
      reportData = reportData.filter(studentData => studentData.totalEvaluated > 0)
    }

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
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-gray-900">Filters & Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Group Filter */}
              <div className="flex items-center gap-3">
                <label htmlFor="groupFilter" className="text-sm font-medium text-gray-700 min-w-fit">
                  Group:
                </label>
                <select
                  id="groupFilter"
                  value={selectedGroupForReport}
                  onChange={(e) => setSelectedGroupForReport(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Groups</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>

              {/* Exam Filter */}
              <div className="flex items-center gap-3">
                <label htmlFor="examFilter" className="text-sm font-medium text-gray-700 min-w-fit">
                  Exam:
                </label>
                <select
                  id="examFilter"
                  value={selectedExamFilter}
                  onChange={(e) => setSelectedExamFilter(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Exams</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name} ({exam.type})</option>
                  ))}
                </select>
              </div>

              {/* Hide Non-Evaluated Toggle */}
              <div className="flex items-center gap-3">
                <label htmlFor="hideNonEvaluated" className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="hideNonEvaluated"
                    checked={hideNonEvaluated}
                    onChange={(e) => setHideNonEvaluated(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Hide non-evaluated students
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <ReportsContent 
              reportData={getGroupReportData(selectedGroupForReport)} 
              selectedExamFilter={selectedExamFilter}
              hideNonEvaluated={hideNonEvaluated}
              allExams={exams}
              groups={groups}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Exams
