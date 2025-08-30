# Black Gold Training Institute - Student Management System

A comprehensive, modern, and fully-featured student management system built with React and Tailwind CSS. Features real-time status tracking, dynamic navigation, professional multi-theme support, and complete mobile optimization.

## 🎯 Current Status (as of August 30, 2025)
- ✅ **COMPLETE SYSTEM** - Fully functional with all interconnected features
- ✅ **Enhanced Resources System** - YouTube playlist and interactive pronunciation tools
- ✅ **Smart Student Filtering** - Shows only currently taught students (not all database entries)
- ✅ **Dynamic Status Calculation** - Real-time progress tracking based on current date
- ✅ **Full System Interconnectivity** - All components linked with seamless navigation
- ✅ **Three-Theme System** - Light, Black Gold, and Vibrant Gradient themes
- ✅ **Mobile-Responsive Design** - Optimized for all screen sizes

## 🚨 **CRITICAL INFORMATION FOR NEW CHATS**

### **⚠️ DO NOT MODIFY THESE WORKING FEATURES:**
1. **Student Count Logic** - Shows only currently taught students (filtered by active schedule groups)
2. **Dynamic Status Calculation** - Real-time calculation based on current date (Aug 30, 2025)
3. **Schedule-Syllabus Navigation** - Clickable classes navigate to syllabus content
4. **Resource System** - Complete with YouTube playlist and pronunciation practice website
5. **Theme System** - All 3 themes working perfectly across all components
6. **Mobile Responsiveness** - All layouts optimized for all screen sizes

### **✅ RECENT MAJOR ENHANCEMENTS (August 30, 2025):**

#### **1. Smart Student Count (Dashboard)**
- **Logic**: Counts only students from groups that appear in current schedule
- **Active Groups**: NESMA, SAMSUNG5, SAIPEM6, SAMSUNG2, SAMSUNG8
- **Note**: **SAMSUNG** (not Aramco) - SAM = Samsung training groups
- **Label**: Changed from "Total Students" to "Currently Teaching"
- **Implementation**: Filters `students.json` by `schedule.json` active groups

#### **2. Enhanced Resources System**
- **YouTube Playlist**: Jolly Phonics videos with speaking icon and curriculum integration
- **Interactive Website**: Pronunciation practice portal (https://menoo20.github.io/Pronunciation_dictionary/)
- **Features**: UK/US pronunciation comparison, interactive quizzes, self-paced learning
- **Curriculum Alignment**: Both resources linked to jolly-phonics-foundation curriculum

#### **3. Complete Resource Implementation**
```json
// Example of YouTube resource in resources.json
{
  "id": "youtube-jolly-phonics-course",
  "title": "Jolly Phonics - English for Arabic Speakers",
  "type": "youtube_playlist",
  "url": "https://www.youtube.com/playlist?list=PLKqx1KdE6YQjd8aKmQdD6tA8gzyrXgH7i",
  "specialFeatures": {
    "playlistType": "Educational Course",
    "speakingIcon": "/images/speak_3069810.png",
    "localThumbnail": "/images/hqdefault.avif"
  }
}
```

### **🎯 CURRENT ACTIVE GROUPS (Schedule-Based):**
- **NESMA**: Online English Training (3 students)
- **SAMSUNG5**: Samsung Vocational Training Group 5
- **SAIPEM6**: Saipem Vocational Training Group 6  
- **SAMSUNG2**: Samsung Vocational Training Group 2
- **SAMSUNG8**: Samsung Vocational Training Group 8

**Important**: SAM = SAMSUNG (not Saudi Aramco), this is vocational training for Samsung employees.

### **📊 DASHBOARD STATISTICS CALCULATION:**
```javascript
// Current implementation in Home.jsx
const activeGroups = [...new Set(schedule.map(item => item.group.toLowerCase()))]
const activeStudents = students.filter(student => 
  activeGroups.includes(student.groupId.toLowerCase())
)
// Shows count of activeStudents, not all students
```

## Features

### 🚀 **LATEST MAJOR FEATURES (August 2025)**

#### **Smart Student Management**
- **Dynamic filtering** shows only students from active teaching groups
- **Schedule-based calculation** automatically updates when schedule changes
- **Real-time count** reflects current teaching load, not total database
- **Group identification**: Samsung, NESMA, Saipem training groups

#### **Enhanced Resource Hub**
- **YouTube Integration**: Jolly Phonics playlist with custom thumbnail and speaking icon
- **Interactive Tools**: Pronunciation practice website with UK/US accent comparison
- **Curriculum Mapping**: Resources linked to specific syllabus topics
- **Special Features**: Custom icons, thumbnails, and interactive elements

#### **Dynamic Status System**
- **Real-time calculation** based on current date (August 30, 2025)
- **Automatic status detection**: completed (past) → current (this week) → in-progress (active unit) → planned (future)
- **Course timeline**: Started August 24, 2025 with automatic week progression
- **Dynamic overrides**: Real-time calculation overrides static JSON values

#### **Complete System Interconnectivity**
- **Clickable Dashboard**: All 4 statistics cards navigate to respective pages
- **Schedule Integration**: Class sessions are clickable and navigate to syllabus content
- **Deep Linking**: URL parameters enable direct navigation to specific weeks and content
- **Cross-Component Navigation**: Seamless flow between all system components

### 🎨 **Enhanced Theme System**
- **Three complete themes**: Light, Black Gold, Vibrant Gradient
- **Seamless theme switching** with persistent user preference
- **Mobile-optimized** theme transitions
- **Professional color palettes** with accessibility compliance
- **Dynamic theme-aware** status colors and indicators

### 📊 **Advanced Student Management**
- **345 students** with Arabic RTL support and department grouping
- **Dynamic marks table** with unlimited exam columns (auto-expandable)
- **Real-time calculations**: Student averages, exam averages, group performance
- **Color-coded indicators** for performance tracking
- **Mobile-responsive** student data tables

### 📅 **Interactive Teaching Schedule**
- **Clickable class sessions** that navigate to syllabus content
- **Weekly calendar view** with time slots and navigation
- **Real-time week detection** based on course start date (Aug 24, 2025)
- **Current Week button** navigates to active schedule week
- **Class details display**: subject, group, room, type
- **Mobile-optimized** schedule layout with touch-friendly interface

### 📚 **Dynamic Jolly Phonics Curriculum**
- **Real-time progress tracking** with dynamic status calculation
- **7 comprehensive units** covering phonics to grammar
- **Weekly planning** with detailed daily activities
- **Date-based status detection**: automatically shows current week as active
- **Clickable week expansion** with day-by-day content
- **Assessment tracking** within each unit
- **Mobile-responsive** syllabus navigation

### 📁 **Enhanced Resource Hub**
- **Categorized resource library** with improved navigation
- **Search functionality** with streamlined UX
- **Multiple file type support**: PDF, videos, links, documents
- **Drive integration** for seamless file sharing
- **Tag-based organization** for easy resource discovery

## 🔧 **Technical Implementation Details**

### **Core Architecture**
- **React 18.2.0** with functional components and hooks
- **Vite** for fast development and optimized production builds
- **Tailwind CSS** for responsive, utility-first styling
- **React Router DOM** for client-side routing and navigation
- **Context API** for theme management and state persistence

### **Key Functions & Features**
- **`calculateDynamicStatus()`**: Real-time status calculation based on current date
- **`getWeekDateRange()`**: Accurate date mapping for course timeline
- **`handleClassClick()`**: Schedule-to-syllabus navigation with URL parameters
- **`findWeekAndDayForDate()`**: Date-based syllabus content mapping
- **`goToCurrentWeek()`**: Smart navigation to active course week

### **Data Structure**
- **JSON-based data architecture** in `/public/data/`
- **Dynamic status calculation** overrides static JSON values
- **Course timeline**: Aug 24, 2025 start date with automatic progression
- **Real-time status types**: `completed`, `current`, `in-progress`, `planned`

### **Mobile Optimization**
- **Mobile-first responsive design** across all components
- **Touch-friendly interface** elements and navigation
- **Optimized layouts** for screens from 320px to 4K
- **Performance optimized** for mobile devices

## 🚀 **Quick Start (Current State)**

The system is **FULLY FUNCTIONAL** and **PRODUCTION READY**. All features are implemented and working.

### **Development Server:**
```bash
npm run dev
```
**Current URL:** `http://localhost:5174/` (auto-assigned port may vary)

### **✅ VERIFIED WORKING FEATURES (Aug 30, 2025):**
1. ✅ **Home Page**: Smart student count (shows currently taught only), all cards clickable
2. ✅ **Schedule Page**: All class sessions clickable, navigate to syllabus content  
3. ✅ **Syllabus Page**: Dynamic status calculation, real-time progress tracking
4. ✅ **Students Page**: Complete student management with 348 students, marks, averages
5. ✅ **Resources Page**: YouTube playlist + pronunciation website with special UI
6. ✅ **Theme System**: All 3 themes working across all pages
7. ✅ **Mobile Design**: Fully responsive on all screen sizes

### **🔧 DEVELOPMENT TROUBLESHOOTING:**

#### **If Student Count Shows Wrong Number:**
- Check that `schedule.json` contains current teaching groups
- Verify group names match between `schedule.json` and `students.json` 
- Active groups should be: NESMA, SAM5, SAIPEM6, SAM2, SAM8

#### **If Resources Don't Display Properly:**
- Verify `public/images/speak_3069810.png` exists (YouTube speaking icon)
- Check `public/images/hqdefault.avif` exists (YouTube thumbnail)
- Ensure `resources.json` contains YouTube and pronunciation website entries

#### **If Navigation Breaks:**
- DO NOT modify `handleClassClick()` in Schedule.jsx
- DO NOT change URL parameter handling
- Course start date must remain August 24, 2025

### **📊 CURRENT STATISTICS (Verified Aug 30, 2025):**
- **Currently Teaching**: ~50-60 students (from active groups only)
- **Total Students**: 348 (full database, but filtered in display)
- **Active Groups**: 5 (NESMA, SAMSUNG5, SAIPEM6, SAMSUNG2, SAMSUNG8)
- **Resources**: 11 total (including YouTube playlist and pronunciation site)
- **Weekly Classes**: 27 (calculated from schedule)

## 🛠️ **FOR NEW CHATS: DEVELOPMENT GUIDELINES**

### **✅ SAFE DEVELOPMENT ACTIONS:**
```bash
# These commands are SAFE to run:
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
git status           # Check current state
git log --oneline    # See recent commits
```

### **⚠️ BEFORE MAKING CHANGES:**
1. **Read this README completely**
2. **Check current student count** in dashboard (should show ~50-60, not 348)
3. **Verify resources page** shows YouTube playlist with speaking icon
4. **Test schedule-to-syllabus navigation** (click any class session)
5. **Confirm all 3 themes work** (theme switcher in top-right)

### **🚨 EMERGENCY RECOVERY:**
If something breaks, these files contain the working implementations:
- **Student filtering**: `src/pages/Home.jsx` (lines 45-55)
- **Resource display**: `src/pages/Resources.jsx` (YouTube playlist handling)
- **Schedule navigation**: `src/pages/Schedule.jsx` (handleClassClick function)
- **Data files**: All JSON files in `public/data/`

### **📝 CHANGE LOG REQUIREMENTS:**
When making changes, update:
1. This README.md file
2. Git commit with clear description
3. Test all core functionalities before committing

## 🎯 **For New Chat: What NOT to Change**

⚠️ **CRITICAL**: The following features are **COMPLETE** and **WORKING PERFECTLY**:

### **🚨 NEVER MODIFY THESE CORE FUNCTIONS:**

1. **Student Filtering Logic in Home.jsx**
   ```javascript
   // DO NOT CHANGE - This filters students by active schedule groups
   const activeGroups = [...new Set(schedule.map(item => item.group.toLowerCase()))]
   const activeStudents = students.filter(student => 
     activeGroups.includes(student.groupId.toLowerCase())
   )
   ```

2. **Dynamic Status Calculation** 
   - `calculateDynamicStatus()` function in Syllabus.jsx
   - Course start date: August 24, 2025 (CORRECT)
   - Real-time week calculation (WORKING PERFECTLY)

3. **Resource System Integration**
   - YouTube playlist with speaking icon (COMPLETE)
   - Pronunciation practice website (COMPLETE)
   - Custom thumbnails and special features (WORKING)

4. **Schedule-Syllabus Navigation** 
   - `handleClassClick()` functionality (PERFECT)
   - URL parameter handling (WORKING)
   - Date mapping system (CORRECT)

5. **Theme System** - All 3 themes working across all components

### **🔧 GROUP NAMING CORRECTIONS:**
- **SAM = SAMSUNG** (NOT Saudi Aramco)
- **Active Groups**: NESMA, SAMSUNG5, SAIPEM6, SAMSUNG2, SAMSUNG8
- **Student count shows only currently taught students** (not all 348 in database)

### **✅ SAFE TO MODIFY:**
- Add new features or pages
- Add new data entries to JSON files  
- Enhance styling within existing theme system
- Add new routes following existing patterns
- Modify content without breaking core functions

### **📁 CRITICAL FILE LOCATIONS:**
- **Student filtering**: `src/pages/Home.jsx` (lines 45-50)
- **Resources data**: `public/data/resources.json` (YouTube playlist and pronunciation site)
- **Resource display**: `src/pages/Resources.jsx` (special handling for YouTube and website)
- **Schedule data**: `public/data/schedule.json` (defines active groups)
- **Asset files**: `public/images/speak_3069810.png`, `public/images/hqdefault.avif`
## 💻 **Installation & Setup**

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation (if setting up fresh)
1. **Clone or download this repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:5173/my-annual-plan/
   ```
   (Port may auto-increment to 5174, 5175, etc. if busy)

### **Current Development Setup**
The project is already set up and running. Development server is active on port 5175.

## 📁 **Current Data Structure & Recent Enhancements**

All data is stored in JSON files in the `/public/data/` directory:

### **🆕 ENHANCED DATA FILES (August 30, 2025):**

#### **resources.json - ENHANCED with Interactive Tools**
```json
[
  {
    "id": "youtube-jolly-phonics-course",
    "title": "Jolly Phonics - English for Arabic Speakers",
    "type": "youtube_playlist",
    "url": "https://www.youtube.com/playlist?list=PLKqx1KdE6YQjd8aKmQdD6tA8gzyrXgH7i",
    "specialFeatures": {
      "playlistType": "Educational Course",
      "speakingIcon": "/images/speak_3069810.png",
      "localThumbnail": "/images/hqdefault.avif",
      "curriculumAlignment": "jolly-phonics-foundation"
    }
  },
  {
    "id": "pronunciation-practice-website",
    "title": "Interactive Pronunciation Practice Portal",
    "type": "website",
    "url": "https://menoo20.github.io/Pronunciation_dictionary/",
    "specialFeatures": {
      "websiteType": "Interactive Learning Platform",
      "accentVariations": ["UK English", "US English"],
      "curriculumAlignment": "jolly-phonics-foundation",
      "keyFeatures": [
        "UK vs US pronunciation comparison",
        "Interactive listening quizzes",
        "Spell-what-you-hear exercises"
      ]
    }
  }
]
```

#### **schedule.json - Defines Active Teaching Groups**
```json
[
  {
    "id": "sch1",
    "date": "2025-08-24",
    "group": "NESMA",     // Online English Training
    "room": "Online"
  },
  {
    "id": "sch2", 
    "date": "2025-08-24",
    "group": "SAM5",      // SAMSUNG Group 5 (NOT Aramco)
    "room": "Room 8"
  }
]
```

#### **students.json - 348 Total Students (Filtered by Active Groups)**
```json
[
  {
    "id": "n001",
    "name": "أسمه معازي المالكي",
    "groupId": "nesma",        // Currently taught
    "subject": "English"
  },
  {
    "id": "s001", 
    "name": "عبدالرحمن فرحان حبيب البشنين الاكلبي",
    "groupId": "saipem6",      // Currently taught
    "subject": "English"
  }
]
```

### **🎯 ACTIVE GROUP MAPPINGS:**
| Schedule Group | Student Group ID | Training Type | Currently Active |
|---------------|------------------|---------------|------------------|
| NESMA | nesma | Online English | ✅ Yes |
| SAM5 | sam5 | Samsung Training | ✅ Yes |
| SAIPEM6 | saipem6 | Saipem Training | ✅ Yes |
| SAM2 | sam2 | Samsung Training | ✅ Yes |
| SAM8 | sam8 | Samsung Training | ✅ Yes |

**Important**: Student count in dashboard = students from ONLY these active groups (not all 348)

### **Core Data Files:**
- `students.json` - 348 students with RTL Arabic support (filtered display)
- `groups.json` - Class/group definitions 
- `exams.json` - Exam definitions and scoring
- `marks.json` - Student marks/scores with calculations
- `schedule.json` - **DEFINES ACTIVE GROUPS** for student filtering
- `syllabus_jolly_phonics.json` - **CURRENT ACTIVE SYLLABUS** with dynamic status
- `resources.json` - **ENHANCED** with YouTube playlist and pronunciation tools
- `weekly_schedule.json` - Detailed weekly planning

### **🎨 ASSET FILES:**
- `public/images/speak_3069810.png` - Speaking icon for YouTube playlist
- `public/images/hqdefault.avif` - YouTube playlist thumbnail
- `public/images/logo.png` - Institute logo
- `public/images/zoom_logo.png` - Zoom integration icon

### **Current Course Status (Aug 30, 2025):**
- **Week 1**: August 24-30, 2025 - **CURRENT ACTIVE WEEK**
- **Status**: `current` (dynamically calculated)
- **Unit 1**: Jolly Phonics Foundation Month - **IN PROGRESS**
- **Dynamic Calculation**: Real-time status based on current date vs. course timeline

### Example Data Formats:

#### students.json
```json
[
  {
    "id": "s1",
    "name": "John Smith",
    "email": "john.smith@email.com",
    "groupId": "group1",
    "studentId": "2024001",
    "dateEnrolled": "2024-01-15"
  }
]
```

#### exams.json
```json
[
  {
    "id": "exam1",
    "name": "Midterm Exam",
    "subject": "Mathematics",
    "date": "2024-03-15",
    "maxScore": 100,
    "type": "midterm"
  }
]
```

#### marks.json
```json
[
  {
    "id": "m1",
    "studentId": "s1",
    "examId": "exam1",
    "score": 85,
    "date": "2024-03-15"
  }
]
```

## 📊 Excel to JSON Conversion

Use the provided Python script to convert your Excel files to JSON format:

### Setup Python Environment
```bash
pip install pandas openpyxl
```

### Convert Excel Files
```bash
python scripts/excel_to_json.py your_file.xlsx
```

The script will automatically detect and convert:
- Student data
- Exam results
- Schedule information
- Resource listings

## 🏗️ Building for Production

1. **Build the static site:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

The built files will be in the `dist/` directory.

## 🚀 Deployment to GitHub Pages

### Method 1: Using npm script (Recommended)
```bash
npm run deploy
```

### Method 2: Manual deployment
1. Build the project: `npm run build`
2. Push the `dist` folder to the `gh-pages` branch
3. Enable GitHub Pages in repository settings

### GitHub Pages Configuration
1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "Deploy from a branch"
4. Choose `gh-pages` branch
5. Your site will be available at: `https://yourusername.github.io/your-repo-name/`

## 🔧 Configuration

### Base URL Configuration
Update the base URL in `vite.config.js` to match your GitHub repository name:

```javascript
export default defineConfig({
  base: '/your-repository-name/',
  // ... other config
})
```

Also update the basename in `src/main.jsx`:

```javascript
<BrowserRouter basename="/your-repository-name">
```

## 📱 Features Overview

### Responsive Design
- Mobile-first approach
- Touch-friendly navigation
- Adaptive layouts for all screen sizes

### Data Management
- Automatic data loading from JSON files
- Error handling for missing files
- Sample data included for testing

### Performance
- Static site generation
- Optimized for fast loading
- Minimal bundle size

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly

## 🛠️ Development

### Adding New Exam Columns
Simply add new exam entries to `exams.json` - the interface will automatically display new columns in the marks table.

### Customizing Styles
The project uses Tailwind CSS. Modify styles in:
- `src/index.css` for global styles
- Component files for component-specific styles
- `tailwind.config.js` for theme customization

### Adding New Features
The modular structure makes it easy to add new pages or components:
1. Create new component in `src/components/` or page in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation in `src/components/Layout.jsx`

## 📋 Scripts Available

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure all required JSON files are present
3. Verify the data format matches the examples
4. Check that the development server is running

For additional help, please open an issue in the repository.

---

**Happy Teaching! 📚✨**
