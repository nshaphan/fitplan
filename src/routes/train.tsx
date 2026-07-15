import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { DAYS } from '~/data/plan'
import { WeekStrip } from '~/components/WeekStrip'
import { DayCard } from '~/components/DayCard'
import { RestTimerBar } from '~/components/RestTimerBar'
import { WeightLogModal } from '~/components/WeightLogModal'

function todayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

export const Route = createFileRoute('/train')({
  validateSearch: (search: Record<string, unknown>) => ({
    day: typeof search.day === 'number' ? search.day : undefined,
  }),
  component: TrainPage,
})

function TrainPage() {
  const navigate = Route.useNavigate()
  const { day } = Route.useSearch()
  const currentDay = day ?? todayIndex()
  const [logKey, setLogKey] = React.useState<string | null>(null)

  const pick = (i: number) => navigate({ search: { day: i } })

  return (
    <section>
      <WeekStrip currentDay={currentDay} onPick={pick} />
      <DayCard day={DAYS[currentDay]} onLongPressSet={setLogKey} />
      <WeightLogModal logKey={logKey} onClose={() => setLogKey(null)} />
      <RestTimerBar />
    </section>
  )
}
