import type { Day } from '~/data/plan'
import { ExerciseRow } from '~/components/ExerciseRow'
import { ChecklistItem } from '~/components/ChecklistItem'
import { useFitPlan } from '~/lib/state'

export function DayCard({ day, onLongPressSet }: { day: Day; onLongPressSet: (key: string) => void }) {
  const { state, toggleCheck, resetDay } = useFitPlan()

  return (
    <div className="glass rounded-[28px] p-5 my-3.5">
      <span className="inline-block bg-badge text-badge text-[11px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full mb-2.5">
        {day.d} · {day.t}
      </span>
      <h2 className="text-xl font-bold">{day.title}</h2>
      <p className="text-sub text-[13.5px] mt-0.5">{day.sub}</p>

      {day.type === 'lift' ? (
        day.ex.map((e, ei) => (
          <ExerciseRow key={ei} dayId={day.id} exerciseIndex={ei} exercise={e} onLongPressSet={onLongPressSet} />
        ))
      ) : (
        day.items.map((it, ii) => {
          const key = `${day.id}-c${ii}`
          return (
            <ChecklistItem key={key} label={it} checked={!!state.checks[key]} onToggle={() => toggleCheck(key)} />
          )
        })
      )}

      <div
        className="bg-glass border-l-[3px] border-accent rounded-r-[12px] py-2.5 px-3 text-[13.5px] text-sub mt-3"
        dangerouslySetInnerHTML={{ __html: day.note }}
      />

      <button
        onClick={() => resetDay(day.id)}
        className="w-full mt-4 mb-1.5 bg-transparent border-[1.5px] border-dashed border-pilloff text-sub rounded-[20px] py-3 text-sm font-semibold"
      >
        Reset today&apos;s checkmarks
      </button>
    </div>
  )
}
