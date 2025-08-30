# Black Gold Training Institute - Student Management System

A comprehensive, modern, and fully-featured student management system built with React and Tailwind CSS. Features real-time status tracking, dynamic navigation, and professional multi-theme support with complete mobile optimization.

## 🎯 Current Status (as of August 30, 2025)
- ✅ **COMPLETE SYSTEM** - Fully functional with all interconnected features
- ✅ **Dynamic Status Calculation** - Real-time progress tracking based on current date
- ✅ **Full System Interconnectivity** - All components linked with seamless navigation
- ✅ **Three-Theme System** - Light, Black Gold, and Vibrant Gradient themes
- ✅ **Mobile-Responsive Design** - Optimized for all screen sizes
- ✅ **Clickable Dashboard** - All statistics cards navigate to respective sections
- ✅ **Schedule-Syllabus Integration** - Class sessions link directly to syllabus content
- ✅ **URL Parameter Navigation** - Deep linking support throughout the system
- ✅ **Real-Time Course Progress** - Course started Aug 24, 2025 with dynamic week calculation

## Features

### 🚀 **LATEST MAJOR FEATURES (August 2025)**

#### **Dynamic Status System**
- **Real-time calculation** based on current date (August 30, 2025)
- **Automatic status detection**: completed (past) → current (this week) → in-progress (active unit) → planned (future)
- **Course timeline**: Started August 24, 2025 with automatic week progression
- **Dynamic overrides**: Real-time calculation overrides static JSON values

#### **Complete System Interconnectivity**
- **Clickable Dashboard**: All 4 statistics cards (Students, Exams, Classes, Resources) navigate to respective pages
- **Schedule Integration**: Class sessions are clickable and navigate directly to corresponding syllabus content
- **Deep Linking**: URL parameters enable direct navigation to specific weeks, days, and syllabus sections
- **Cross-Component Navigation**: Seamless flow between Home → Schedule → Syllabus → Resources

#### **Advanced Navigation Features**
- **Schedule-to-Syllabus Mapping**: Click any class session to jump to exact syllabus content for that day
- **Date-Based Navigation**: System calculates correct week and day based on course start date
- **Current Week Detection**: Automatically highlights and navigates to current week (Aug 24-30)
- **URL State Management**: Browser back/forward buttons work correctly with all navigation

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
**Current URL:** `http://localhost:5175/` (auto-assigned port)

### **What's Working Right Now:**
1. ✅ **Home Page**: All 4 dashboard cards clickable and navigate correctly
2. ✅ **Schedule Page**: All class sessions clickable, navigate to syllabus content
3. ✅ **Syllabus Page**: Dynamic status calculation, real-time progress tracking
4. ✅ **Students Page**: Complete student management with marks and averages
5. ✅ **Resources Page**: Full resource library with categorization
6. ✅ **Theme System**: All 3 themes working across all pages
7. ✅ **Mobile Design**: Fully responsive on all screen sizes

### **Current Tasks Running:**
- `dev-server` task is **ACTIVE** and running
- Development server on port 5175
- Hot module reloading working for all components

### **Git Status:**
- All changes committed successfully
- Latest commit: "feat: Complete student management system with dynamic status and full interconnectivity"
- 4 files modified: Home.jsx, Schedule.jsx, Syllabus.jsx, syllabus_jolly_phonics.json

## 🎯 **For New Chat: What NOT to Change**

⚠️ **CRITICAL**: The following features are **COMPLETE** and **WORKING PERFECTLY**:

1. **Dynamic Status Calculation** - Do NOT modify `calculateDynamicStatus()` function
2. **Schedule-Syllabus Navigation** - Do NOT change `handleClassClick()` functionality
3. **Date Mapping System** - Course start date Aug 24, 2025 is CORRECT
4. **Theme System** - All 3 themes are working perfectly
5. **Mobile Responsiveness** - All layouts are optimized
6. **URL Parameter Handling** - Deep linking is working correctly

### **What You CAN Safely Modify:**
- Add new features or pages
- Modify styling within existing theme system
- Add new data entries to JSON files
- Enhance existing functionality without breaking core features
- Add new routes or components following existing patterns
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

## 📁 **Current Data Structure**

All data is stored in JSON files in the `/public/data/` directory:

### **Core Data Files:**
- `students.json` - 345 students with RTL Arabic support
- `groups.json` - Class/group definitions with scheduling
- `exams.json` - Exam definitions and scoring
- `marks.json` - Student marks/scores with calculations
- `schedule.json` - Weekly teaching schedule (Aug 24-30, 2025 active week)
- `syllabus_jolly_phonics.json` - **CURRENT ACTIVE SYLLABUS** with dynamic status
- `syllabus.json`, `syllabus_new.json`, `syllabus_old.json` - Alternative syllabi
- `resources.json` - Educational resources and file library
- `weekly_schedule.json` - Detailed weekly planning
- `topics_library.json` - Topic-based content organization

### **Current Course Status (Aug 30, 2025):**
- **Week 1**: August 24-30, 2025 - **CURRENT ACTIVE WEEK**
- **Status**: `current` (dynamically calculated)
- **Unit 1**: Jolly Phonics Foundation Month - **IN PROGRESS**
- **Dynamic Calculation**: Real-time status based on current date vs. course timeline

### **Key Data Features:**
- **Dynamic status calculation** overrides static JSON `status` fields
- **Date-based mapping** from course start (Aug 24, 2025)
- **Real-time week progression** with automatic status updates
- **URL parameter support** for deep linking to specific content

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
