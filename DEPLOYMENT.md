# Deployment Guide

This guide provides step-by-step instructions for deploying your Student Management System to GitHub Pages.

## 📋 Prerequisites

1. GitHub account
2. Git installed on your computer
3. Your project code ready

## 🚀 Quick Deployment (Recommended)

### Step 1: Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Student Management System"
```

### Step 2: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it (e.g., "my-annual-plan")
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### Step 3: Connect Local to Remote
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy to GitHub Pages
```bash
npm run deploy
```

That's it! Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## 🔧 Manual Deployment

If the automatic deployment doesn't work, follow these steps:

### Step 1: Build the Project
```bash
npm run build
```

### Step 2: Deploy to gh-pages Branch
```bash
# Install gh-pages if not already installed
npm install -g gh-pages

# Deploy the dist folder
gh-pages -d dist
```

### Step 3: Configure GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll down to "Pages"
4. Under "Source", select "Deploy from a branch"
5. Choose "gh-pages" branch
6. Click "Save"

## ⚙️ Configuration

### Update Base URL
Before deploying, make sure to update the base URL in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/YOUR_REPO_NAME/',  // Replace with your actual repo name
  build: {
    outDir: 'dist',
  },
})
```

### Update Router Base
Also update the basename in `src/main.jsx`:

```javascript
<BrowserRouter basename="/YOUR_REPO_NAME">
  <App />
</BrowserRouter>
```

## 📊 Adding Your Data

### Method 1: Using Excel (Recommended)
1. Create Excel file with your data
2. Use the provided Python script:
   ```bash
   cd scripts
   pip install -r requirements.txt
   python excel_to_json.py your_data.xlsx
   ```

### Method 2: Manual JSON Editing
1. Edit files in `public/data/`:
   - `students.json`
   - `groups.json`
   - `exams.json`
   - `marks.json`
   - `schedule.json`
   - `syllabus.json`
   - `resources.json`

### Method 3: Google Sheets
1. Export sheets as Excel files
2. Use the Python conversion script

## 🔄 Updating Your Site

After making changes to your data:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Update data"
   git push
   ```

2. **Redeploy:**
   ```bash
   npm run deploy
   ```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Site Shows 404 Error
- Check that GitHub Pages is enabled in repository settings
- Verify the base URL in `vite.config.js` matches your repository name
- Ensure the `gh-pages` branch exists

#### 2. Styles Not Loading
- Make sure the base URL is correct in configuration files
- Check browser console for 404 errors

#### 3. Data Not Displaying
- Verify JSON files are in `public/data/` directory
- Check JSON syntax is valid (use online JSON validator)
- Check browser console for error messages

#### 4. Deployment Fails
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try deploying again
npm run deploy
```

### Debugging Steps

1. **Test Locally First:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Check Build Output:**
   - Verify `dist` folder is created
   - Check that data files are included

3. **Validate Data Files:**
   - Use online JSON validator
   - Check file encoding (should be UTF-8)

## 📱 Mobile Optimization

The site is already mobile-responsive, but you can:

1. Test on different devices
2. Use browser dev tools to simulate mobile
3. Check loading speeds on mobile networks

## 🔒 Security Notes

- This is a static site with no server-side processing
- All data is public (don't include sensitive information)
- Student data should be anonymized if sharing publicly

## 📈 Analytics (Optional)

To add Google Analytics:

1. Get tracking ID from Google Analytics
2. Add to `index.html` in the `<head>` section:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_TRACKING_ID');
   </script>
   ```

## 🎨 Customization

### Colors and Branding
Edit `tailwind.config.js` to change colors:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#your-color',
        500: '#your-color',
        // ... more shades
      }
    }
  }
}
```

### Logo and Favicon
1. Replace `public/vite.svg` with your logo
2. Update favicon in `index.html`

## 📞 Support

If you need help:
1. Check the README.md for detailed documentation
2. Look at the browser console for error messages
3. Verify all file paths and configurations
4. Test with sample data first

---

**Happy Teaching! 🎓**
