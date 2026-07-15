import { DAYS } from '~/data/plan'
import type { FitPlanState } from '~/lib/state'

export function isoWeekString(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3)
  const weekNum = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000))
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

export function repRangeFromMeta(m: string): { lo: number; hi: number } | null {
  if (!m.includes('· rest')) return null
  const match = m.match(/×\s*(\d+)(?:[–-](\d+))?/)
  if (!match) return null
  const lo = parseInt(match[1], 10)
  const hi = match[2] ? parseInt(match[2], 10) : lo
  return { lo, hi }
}

export function isToday(ts: number | undefined): boolean {
  if (!ts) return false
  return new Date(ts).toDateString() === new Date().toDateString()
}

export function computeWeekCompletion(state: FitPlanState) {
  let done = 0
  let total = 0
  for (const d of DAYS) {
    if (d.type === 'lift') {
      d.ex.forEach((e, ei) => {
        for (let si = 0; si < e.s; si++) {
          total++
          if (state.sets[`${d.id}-${ei}-${si}`]) done++
        }
      })
    } else {
      d.items.forEach((_it, ii) => {
        total++
        if (state.checks[`${d.id}-c${ii}`]) done++
      })
    }
  }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
}

export function snapshotLifts(state: FitPlanState): Record<string, number> {
  const lifts: Record<string, number> = {}
  for (const d of DAYS) {
    if (d.type !== 'lift') continue
    d.ex.forEach((e, ei) => {
      if (!repRangeFromMeta(e.m)) return
      const log = state.logs[`${d.id}-${ei}-0`]
      if (log && log.kg != null) lifts[e.n] = log.kg
    })
  }
  return lifts
}

export function dayHasProgress(state: FitPlanState, dayId: string): boolean {
  const prefix = dayId + '-'
  return (
    Object.keys(state.sets).some((k) => k.startsWith(prefix) && state.sets[k]) ||
    Object.keys(state.checks).some((k) => k.startsWith(prefix) && state.checks[k])
  )
}
