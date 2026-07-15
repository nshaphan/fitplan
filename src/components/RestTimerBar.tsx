import * as React from 'react'

declare global {
  interface Navigator {
    wakeLock?: {
      request(type: 'screen'): Promise<{ release: () => Promise<void> }>
    }
  }
}

function fmt(s: number) {
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0')
}

export function RestTimerBar() {
  const [running, setRunning] = React.useState(false)
  const [display, setDisplay] = React.useState('0:00')
  const [go, setGo] = React.useState(false)
  const restLeft = React.useRef(0)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const wakeLockRef = React.useRef<{ release: () => Promise<void> } | null>(null)

  const requestWakeLock = React.useCallback(async () => {
    try {
      if ('wakeLock' in navigator && navigator.wakeLock) {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      }
    } catch {
      // unsupported or denied — degrade silently
    }
  }, [])

  const releaseWakeLock = React.useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {})
      wakeLockRef.current = null
    }
  }, [])

  const stopRest = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    releaseWakeLock()
    setRunning(false)
    setDisplay('0:00')
    setGo(false)
  }, [releaseWakeLock])

  const notifyRestDone = () => {
    try {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200])
    } catch {
      // unsupported — degrade silently
    }
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Rest over', { body: 'Time for your next set.', tag: 'fitplan-rest' })
      }
    } catch {
      // unsupported — degrade silently
    }
  }

  const startRest = (sec: number) => {
    stopRest()
    restLeft.current = sec
    setRunning(true)
    setDisplay(fmt(restLeft.current))
    void requestWakeLock()
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
    intervalRef.current = setInterval(() => {
      restLeft.current -= 1
      setDisplay(fmt(Math.max(0, restLeft.current)))
      if (restLeft.current <= 0) {
        stopRest()
        notifyRestDone()
        setDisplay('GO!')
        setGo(true)
        setTimeout(() => {
          setDisplay((d) => (d === 'GO!' ? '0:00' : d))
          setGo(false)
        }, 2500)
      }
    }, 1000)
  }

  React.useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && intervalRef.current) void requestWakeLock()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [requestWakeLock])

  React.useEffect(() => () => stopRest(), [stopRest])

  return (
    <div className="fixed left-4 right-4 bottom-[calc(78px+env(safe-area-inset-bottom))] mx-auto max-w-[428px] glass-strong rounded-full py-2.5 px-4.5 flex items-center gap-2.5 justify-center z-40">
      <span className="text-xs text-sub uppercase tracking-wider font-bold">Rest</span>
      {!running && (
        <>
          <button onClick={() => startRest(90)} className="bg-pilloff border border-pilloff text-current rounded-full py-2 px-3.5 text-sm font-bold">1:30</button>
          <button onClick={() => startRest(120)} className="bg-pilloff border border-pilloff text-current rounded-full py-2 px-3.5 text-sm font-bold">2:00</button>
          <button onClick={() => startRest(180)} className="bg-pilloff border border-pilloff text-current rounded-full py-2 px-3.5 text-sm font-bold">3:00</button>
        </>
      )}
      <span
        className={
          'text-[22px] font-bold min-w-[70px] text-center tabular-nums ' +
          (running ? 'text-done' : 'text-accent') +
          (go ? ' animate-pulse-go' : '')
        }
      >
        {display}
      </span>
      {running && (
        <button onClick={stopRest} className="bg-danger-bg border border-danger-border text-danger-text rounded-full py-2 px-3.5 text-sm font-bold">
          Stop
        </button>
      )}
    </div>
  )
}
