import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Set basename for GitHub Pages deployment
// In development: basename = '' (empty)
// In production: basename = '/studentLMS' (repository name)
const basename = import.meta.env.PROD ? '/studentLMS' : ''

console.log('Environment:', import.meta.env.MODE)
console.log('Router basename:', basename)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
