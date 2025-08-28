# Student Management System

A modern, responsive static website for managing and displaying student information, built with React and Tailwind CSS.

## Features

### 📊 **Student Progress Tracking**
- View students organized by groups
- Display marks in a dynamic table format
- Calculate averages per student, exam, and group
- Support for unlimited exam columns (dynamically expandable)
- Color-coded performance indicators

### 📅 **Teaching Schedule**
- Weekly calendar view with time slots
- Navigate between weeks
- Display class details (subject, group, room, type)
- Upcoming classes preview
- Mobile-responsive design

### 📚 **Annual Plan & Syllabus**
- Track curriculum progress by subject
- Expandable topic details with subtopics
- Progress indicators and status tracking
- Resource links and learning objectives
- Completion tracking

### 📁 **Resource Hub**
- Categorized resource library
- Search and filter functionality
- Support for various file types (PDF, videos, links, etc.)
- Drive integration for file sharing
- Tag-based organization

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

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

## 📁 Data Structure

All data is stored in JSON files in the `/public/data/` directory:

### Required Files:
- `students.json` - Student information
- `groups.json` - Class/group definitions
- `exams.json` - Exam definitions
- `marks.json` - Student marks/scores
- `schedule.json` - Teaching schedule
- `syllabus.json` - Curriculum and syllabus data
- `resources.json` - Educational resources and files

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
