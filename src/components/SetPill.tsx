import * as React from 'react'
import { useFitPlan } from '~/lib/state'

export function SetPill({
  dayKey,
  label,
  onLongPress,
}: {
  dayKey: string
  label: string
  onLongPress: (key: string) => void
}) {
  const { state, toggleSet } = useFitPlan()
  const on = !!state.sets[dayKey]
  const log = state.logs[dayKey]
  const pressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressed = React.useRef(false)

  const startPress = () => {
    longPressed.current = false
    if (pressTimer.current) clearTimeout(pressTimer.current)
    pressTimer.current = setTimeout(() => {
      longPressed.current = true
      onLongPress(dayKey)
    }, 500)
  }
  const endPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current)
    if (!longPressed.current) toggleSet(dayKey)
  }
  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current)
  }

  const aria = `${label}${on ? ' done' : ''}${log && log.kg != null ? `, last logged ${log.kg}kg${log.reps != null ? ' for ' + log.reps + ' reps' : ''}` : ''}`

  return (
    <button
      aria-pressed={on}
      aria-label={aria}
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      className={
        'min-w-[52px] h-11 rounded-[12px] border-[1.5px] flex flex-col items-center justify-center gap-px text-sm font-semibold cursor-pointer transition-transform active:scale-95 ' +
        (on ? 'bg-done border-done text-done-contrast shadow-[0_4px_12px_rgba(47,214,117,0.3)]' : 'bg-pilloff border-pilloff text-pilloff')
      }
    >
      {label}
      {log && log.kg != null && (
        <span className="text-[10px] opacity-85 font-medium">
          {log.kg}
          {log.reps != null ? `×${log.reps}` : ''}
        </span>
      )}
    </button>
  )
}
