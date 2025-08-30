// Centralized group to syllabus mapping utility
// This is the single source of truth for which groups use which syllabi

export const GROUP_SYLLABUS_MAPPING = {
  // NESMA uses the intensive 4-week English communication program
  'NESMA': {
    file: 'syllabus_new.json',
    syllabusId: 'nesma-english',
    type: 'intensive-communication',
    title: 'NESMA English Communication',
    description: 'Intensive 4-week program advancing from Level 1 to Level 2'
  },
  // All SAIPEM groups use the foundational annual program
  'SAIPEM6': {
    file: 'syllabus_jolly_phonics.json',
    syllabusId: 'jolly-phonics',
    type: 'foundational-annual',
    title: 'Foundational English',
    description: 'Annual program building from Level 0 to Level 1-2'
  },
  'SAIPEM5': {
    file: 'syllabus_jolly_phonics.json',
    syllabusId: 'jolly-phonics',
    type: 'foundational-annual',
    title: 'Foundational English',
    description: 'Annual program building from Level 0 to Level 1-2'
  },
  'SAIPEM4': {
    file: 'syllabus_jolly_phonics.json',
    syllabusId: 'jolly-phonics',
    type: 'foundational-annual',
    title: 'Foundational English',
    description: 'Annual program building from Level 0 to Level 1-2'
  },
  'SAIPEM3': {
    file: 'syllabus_jolly_phonics.json',
    syllabusId: 'jolly-phonics',
    type: 'foundational-annual',
    title: 'Foundational English',
    description: 'Annual program building from Level 0 to Level 1-2'
  },
  'SAIPEM2': {
    file: 'syllabus_jolly_phonics.json',
    syllabusId: 'jolly-phonics',
    type: 'foundational-annual',
    title: 'Foundational English',
    description: 'Annual program building from Level 0 to Level 1-2'
  },
  // All SAM groups use the foundational annual program
  'SAM5': {
    file: 'syllabus_jolly_phonics.json',
    syllabusId: 'jolly-phonics',
    type: 'foundational-annual',
    title: 'Foundational English',
    description: 'Annual program building from Level 0 to Level 1-2'
  },
  'SAM8': {
    file: 'syllabus_jolly_phonics.json',
    syllabusId: 'jolly-phonics',
    type: 'foundational-annual',
    title: 'Foundational English',
    description: 'Annual program building from Level 0 to Level 1-2'
  },
  'SAM2': {
    file: 'syllabus_jolly_phonics.json',
    syllabusId: 'jolly-phonics',
    type: 'foundational-annual',
    title: 'Foundational English',
    description: 'Annual program building from Level 0 to Level 1-2'
  }
}

// Default configuration for unknown groups
export const DEFAULT_SYLLABUS_CONFIG = {
  file: 'syllabus_jolly_phonics.json',
  syllabusId: 'jolly-phonics',
  type: 'foundational-annual',
  title: 'Foundational English',
  description: 'Annual program building from Level 0 to Level 1-2'
}

/**
 * Get syllabus configuration for a specific group
 * @param {string} groupName - The group name (case-insensitive)
 * @returns {object} Syllabus configuration object
 */
export const getGroupSyllabusConfig = (groupName) => {
  if (!groupName) return DEFAULT_SYLLABUS_CONFIG
  
  const normalizedGroup = groupName.toUpperCase().trim()
  return GROUP_SYLLABUS_MAPPING[normalizedGroup] || DEFAULT_SYLLABUS_CONFIG
}

/**
 * Get syllabus file name for a specific group
 * @param {string} groupName - The group name (case-insensitive)
 * @returns {string} Syllabus file name
 */
export const getGroupSyllabusFile = (groupName) => {
  return getGroupSyllabusConfig(groupName).file
}

/**
 * Get all available syllabi configurations
 * @returns {array} Array of unique syllabus configurations
 */
export const getAvailableSyllabi = () => {
  const uniqueSyllabi = new Map()
  
  Object.values(GROUP_SYLLABUS_MAPPING).forEach(config => {
    if (!uniqueSyllabi.has(config.syllabusId)) {
      uniqueSyllabi.set(config.syllabusId, config)
    }
  })
  
  return Array.from(uniqueSyllabi.values())
}

/**
 * Get groups that use a specific syllabus
 * @param {string} syllabusId - The syllabus ID
 * @returns {array} Array of group names
 */
export const getGroupsForSyllabus = (syllabusId) => {
  return Object.entries(GROUP_SYLLABUS_MAPPING)
    .filter(([group, config]) => config.syllabusId === syllabusId)
    .map(([group, config]) => group)
}

/**
 * Validate if a group has access to a specific syllabus
 * @param {string} groupName - The group name
 * @param {string} syllabusId - The syllabus ID
 * @returns {boolean} True if the group has access
 */
export const hasGroupAccessToSyllabus = (groupName, syllabusId) => {
  const config = getGroupSyllabusConfig(groupName)
  return config.syllabusId === syllabusId
}
