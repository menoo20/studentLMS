import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// For development, we don't need any basename since we start from root
// For production, you can set the basename if deploying to a subdirectory
const basename = ''

console.log('Environment:', import.meta.env.MODE)
console.log('Starting from root path (/)')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
