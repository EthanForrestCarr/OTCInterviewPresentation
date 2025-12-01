import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { InterviewApp } from './InterviewApp'

const hash = window.location.hash

const RootComponent = hash.startsWith('#interview') ? InterviewApp : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
)
