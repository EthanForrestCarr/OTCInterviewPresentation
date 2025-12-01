import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { InterviewApp } from './InterviewApp'

const path = window.location.pathname

const RootComponent = path.startsWith('/interview') ? InterviewApp : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
)
