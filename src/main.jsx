import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CoachingProvider } from './contexts/CoachingContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { ToastProvider } from './components/Toast.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <CoachingProvider>
          <App />
        </CoachingProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
