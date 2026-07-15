import * as React from 'react'

export function ServiceWorkerRegistration() {
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/fitplan/sw.js').catch(() => {})
    }
  }, [])
  return null
}
