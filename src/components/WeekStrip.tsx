import { DAYS } from '~/data/plan'
import { dayHasProgress } from '~/lib/week'
import { useFitPlan } from '~/lib/state'

export function WeekStrip({ currentDay, onPick }: { currentDay: number; onPick: (i: number) => void }) {
  const { state } = useFitPlan()
  return (
    <div className="grid grid-cols-7 gap-1.5 my-3.5 mb-1.5">
      {DAYS.map((d, i) => {
        const active = i === currentDay
        const done = !active && dayHasProgress(state, d.id)
        return (
          <button
            key={d.id}
            onClick={() => onPick(i)}
            className={
              'rounded-[12px] border py-2 pb-1.5 text-center font-semibold ' +
              (active
                ? 'bg-accent border-accent text-accent-contrast'
                : 'bg-pilloff border-pilloff text-pilloff') +
              (done ? ' ring-1 ring-inset ring-done' : '')
            }
          >
            <span className="block text-[11px] tracking-wide">{d.d}</span>
            <span className="block text-[10px] mt-px opacity-80 font-normal">{d.t}</span>
          </button>
        )
      })}
    </div>
  )
}
