import { useEffect, useState } from 'react'
import App from './App'
import { InterviewApp } from './InterviewApp'

type Route = 'dashboard' | 'interview'

function getRouteFromHash(hash: string): Route {
  // Only treat exactly "#interview" (or "#interview/" etc.) as the standalone page
  if (hash === '#interview' || hash === '#interview/' ) {
    return 'interview'
  }
  return 'dashboard'
}

export function RootRouter() {
  const [route, setRoute] = useState<Route>(() => getRouteFromHash(window.location.hash))

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash(window.location.hash))
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route === 'interview') {
    return <InterviewApp />
  }

  return <App />
}
