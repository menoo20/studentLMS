import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Only use basename in production
// In development, the app runs from root (localhost:5173/)
// In production, it will run from /my-annual-plan/ subdirectory
const basename = import.meta.env.PROD ? '/my-annual-plan' : ''

console.log('Environment:', import.meta.env.MODE)
console.log('Using basename:', basename || '(root)')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
