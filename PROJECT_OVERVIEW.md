# Black Gold Training Institute - Student Management System

## 🎯 Project Overview
A comprehensive React-based static website for managing student progress, schedules, syllabus, and educational resources for the Black Gold Training Institute's English for Adult Vocational Learners program.

## 📋 Completed Tasks & Milestones

### ✅ Phase 1: Project Setup & Foundation
- **React + Vite application** with Tailwind CSS for styling
- **Multi-page routing** using React Router DOM
- **JSON-based data architecture** for students, groups, marks, schedule, syllabus, and resources
- **Python data processing scripts** for Excel to JSON conversion
- **Git version control** with comprehensive commit history

### ✅ Phase 2: Core Functionality
- **Student Management**: 345 students with Arabic RTL text support, grouped by departments
- **Marks & Grading System**: Exam tracking with averages and progress monitoring
- **Teaching Schedule**: Weekly calendar view with time slots and class management
- **Resource Hub**: Educational materials with categorization and search functionality
- **Course Syllabus**: Complete curriculum structure with 7 comprehensive units

### ✅ Phase 3: Curriculum Development
- **Jolly Phonics Foundation**: Structured phonics program with sound groups
- **7 Complete Units**: From basic sounds to complex grammar (Past Simple Tense)
- **Weekly Planning**: Detailed daily activities and learning objectives
- **Progress Tracking**: Unit completion status and academic year planning
- **Recycling & Review**: Built-in review sessions for knowledge retention

### ✅ Phase 4: Theme System Implementation
- **Dual Theme Support**: Light theme + Black Gold Training Institute theme
- **ThemeContext**: Global state management for theme switching
- **Custom Color Palette**: Professional black (#181818) and gold (#FFD700) branding
- **Accessibility Compliance**: Proper contrast ratios and text visibility
- **Design Consistency**: Headers use theme colors, cards maintain readability

## 🛠 Technical Architecture

### Frontend Stack
```
React 18.2.0 + Vite 4.4.5
├── React Router DOM 6.15.0 (Multi-page navigation)
├── Tailwind CSS 3.3.3 (Styling with custom theme)
├── Theme Context (Global state management)
└── Component-based architecture
```

### Data Structure
```
public/data/
├── students.json (345 students with Arabic names)
├── groups.json (Department-based grouping)
├── marks.json (Exam scores and averages)
├── schedule.json (Weekly teaching schedule)
├── syllabus_jolly_phonics.json (Main curriculum)
├── resources.json (Educational materials)
└── exams.json (Assessment structure)
```

### Key Components
- **Layout.jsx**: Header, navigation, theme switcher
- **ThemeContext.jsx**: Theme state management
- **Home.jsx**: Dashboard with statistics overview
- **Students.jsx**: Student listing with marks and progress
- **Schedule.jsx**: Weekly calendar with time slots
- **Syllabus.jsx**: Curriculum overview and unit details
- **Resources.jsx**: Educational content hub

## 🎨 Theme Implementation Details

### Color Palette
```css
blackGold: {
  bg: '#181818',        // Main background
  gold: '#FFD700',      // Primary gold
  goldDark: '#BFA100',  // Secondary gold
  accent: '#F5C542',    // Logo accent color
  white: '#fff'         // Text on dark background
}
```

### Design Principles
1. **Page Headers**: Use gold color in Black Gold theme for visibility
2. **White Cards**: Always use dark text for readability
3. **Search Inputs**: White background with dark text
4. **Navigation**: Theme-aware active states and hover effects
5. **Accessibility**: Proper contrast ratios maintained

## 📚 Curriculum Structure

### Course: English for Adult Vocational Learners
- **Total Duration**: 52 weeks (Academic Year 2024-2025)
- **Methodology**: Multi-approach combining Jolly Phonics, communicative language teaching, and vocational English
- **Target**: Adult vocational students
- **Focus**: Phonics, communication, technical vocabulary, workplace literacy

### Units Breakdown
1. **Unit 1**: Letter Sounds Foundation (s, a, t, i, p, n)
2. **Unit 2**: Building Vocabulary (c/k, e, h, r, m, d)
3. **Unit 3**: Reading Development (g, o, u, l, f, b)
4. **Unit 4**: Advanced Sounds (ai, j, oa, ie, ee, or)
5. **Unit 5**: Complex Patterns (z, w, ng, v, oo, OO)
6. **Unit 6**: Grammar Introduction (y, x, ch, sh, th, qu)
7. **Unit 7**: Past Simple Tense (ou, oi, ue, er, ar)

Each unit includes:
- **Phonics Groups**: Structured sound introduction
- **Weekly Plans**: Daily activities and objectives
- **Workplace Vocabulary**: Job-relevant terminology
- **Assessment**: Progress tracking and review sessions

## 🚀 Deployment Configuration

### Development vs Production
- **Dev Server**: `http://localhost:5173/`
- **Production Base**: `/my-annual-plan/`
- **Dynamic Path Resolution**: Automatic basePath detection
- **Build Output**: `dist/` directory for static hosting

### Git Repository
- **Branch**: master
- **Latest Commit**: 05d9861 (Complete Black Gold theme implementation)
- **Commit History**: Comprehensive progression from initial setup to full theme system

## 🔧 Development Workflow

### Running the Project
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

### File Structure
```
src/
├── components/
│   ├── Layout.jsx
│   └── ThemeContext.jsx
├── pages/
│   ├── Home.jsx
│   ├── Students.jsx
│   ├── Schedule.jsx
│   ├── Syllabus.jsx
│   └── Resources.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 📊 Data Management

### Student Data (345 records)
- Arabic names with RTL display support
- Department-based grouping
- Mark tracking and averages
- Progress monitoring

### Curriculum Data
- JSON-based syllabus structure
- Weekly planning with daily activities
- Unit progression tracking
- Assessment integration

## 🎯 Future Development Areas

### Immediate Priorities
- Additional curriculum units (Units 8+)
- Enhanced reporting features
- Mobile responsiveness optimization
- Performance improvements

### Long-term Goals
- Real-time data updates
- Student portal access
- Advanced analytics
- Multi-language support

## 🔍 Troubleshooting Guide

### Common Issues
1. **Theme not applying**: Check ThemeContext provider wrapping
2. **Data not loading**: Verify basePath configuration for deployment
3. **Routing issues**: Ensure basename matches deployment path
4. **Style conflicts**: Review Tailwind class precedence

### Key Files for Debugging
- `src/components/ThemeContext.jsx` - Theme state management
- `src/components/Layout.jsx` - Navigation and theme switcher
- `vite.config.js` - Build and deployment configuration
- `tailwind.config.js` - Custom color palette

## 📝 Notes for New Developers

1. **Theme System**: Conditional styling pattern using `theme === 'blackGold'`
2. **Data Fetching**: Dynamic basePath for development vs production
3. **Component Structure**: Functional components with hooks
4. **Styling Approach**: Utility-first with Tailwind CSS
5. **State Management**: Context API for global theme state

---

**Last Updated**: August 29, 2025
**Project Status**: Production Ready with Complete Theme System
**Next Chat Instructions**: Reference this document for full project context
