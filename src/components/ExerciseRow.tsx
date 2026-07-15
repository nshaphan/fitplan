import type { Exercise } from '~/data/plan'
import { SetPill } from '~/components/SetPill'
import { isToday, repRangeFromMeta } from '~/lib/week'
import { useFitPlan } from '~/lib/state'

export function ExerciseRow({
  dayId,
  exerciseIndex,
  exercise,
  onLongPressSet,
}: {
  dayId: string
  exerciseIndex: number
  exercise: Exercise
  onLongPressSet: (key: string) => void
}) {
  const { state } = useFitPlan()
  const range = repRangeFromMeta(exercise.m)
  let hint: string | null = null
  if (range) {
    const keys = Array.from({ length: exercise.s }, (_, si) => `${dayId}-${exerciseIndex}-${si}`)
    const logs = keys.map((k) => state.logs[k])
    const allHitToday = logs.every((l) => l && l.reps != null && l.reps >= range.hi && isToday(l.ts))
    if (allHitToday) {
      const lower = /squat|deadlift|leg press|lunge|split squat/i.test(exercise.n)
      hint = `+${lower ? 5 : 2.5} kg`
    }
  }

  return (
    <div className="py-3 border-t border-hairline first:border-t-0 first:mt-1.5">
      <div className="font-semibold text-[15.5px]">{exercise.n}</div>
      <div className="text-sub text-[12.5px] my-px mb-2">{exercise.m}</div>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: exercise.s }, (_, si) => {
          const key = `${dayId}-${exerciseIndex}-${si}`
          const label = exercise.s === 1 ? '✓ done' : `Set ${si + 1}`
          return <SetPill key={key} dayKey={key} label={label} onLongPress={onLongPressSet} />
        })}
      </div>
      <div className="text-[11px] text-sub2 mt-2">Long-press a set to log weight</div>
      {hint && (
        <div className="bg-glass border-l-[3px] border-accent rounded-r-[12px] py-2 px-2.5 text-[13px] text-sub mt-2">
          💪 Top of range on all sets — try <b className="text-done">{hint}</b> next session.
        </div>
      )}
    </div>
  )
}
