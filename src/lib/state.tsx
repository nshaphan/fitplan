import * as React from 'react'
import { loadState, saveState, storageNoticeActive } from '~/lib/storage'
import { computeWeekCompletion, isoWeekString, snapshotLifts } from '~/lib/week'

export interface SetLog {
  kg: number | null
  reps: number | null
  ts: number
}

export interface MetricEntry {
  date: string
  bw: number | null
  waist: number | null
}

export interface WeekHistoryEntry {
  week: string
  done: number
  total: number
  pct: number
  lifts: Record<string, number>
}

export interface FitPlanState {
  sets: Record<string, boolean>
  checks: Record<string, boolean>
  rules: Record<string, boolean>
  bw: string
  diet: 'train' | 'rest'
  week: string
  history: WeekHistoryEntry[]
  logs: Record<string, SetLog>
  metrics: MetricEntry[]
}

const DEFAULT_STATE: FitPlanState = {
  sets: {},
  checks: {},
  rules: {},
  bw: '',
  diet: 'train',
  week: '',
  history: [],
  logs: {},
  metrics: [],
}

interface FitPlanContextValue {
  state: FitPlanState
  loaded: boolean
  storageNotice: boolean
  toggleSet: (key: string) => void
  toggleCheck: (key: string) => void
  toggleRule: (index: number) => void
  resetDay: (dayId: string) => void
  setBw: (bw: string) => void
  setDiet: (mode: 'train' | 'rest') => void
  saveLog: (key: string, kg: number | null, reps: number | null) => void
  upsertMetric: (bw: number | null, waist: number | null) => void
  replaceState: (next: FitPlanState) => void
}

const FitPlanContext = React.createContext<FitPlanContextValue | null>(null)

export function FitPlanProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<FitPlanState>(DEFAULT_STATE)
  const [loaded, setLoaded] = React.useState(false)
  const [storageNotice, setStorageNotice] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      const loadedState = await loadState<Partial<FitPlanState>>()
      if (cancelled) return
      let next = { ...DEFAULT_STATE, ...loadedState }

      const cw = isoWeekString(new Date())
      if (!next.week) {
        next = { ...next, week: cw }
      } else if (next.week !== cw) {
        const summary = computeWeekCompletion(next)
        const entry = { week: next.week, done: summary.done, total: summary.total, pct: summary.pct, lifts: snapshotLifts(next) }
        next = {
          ...next,
          history: [...next.history, entry].slice(-26),
          sets: {},
          checks: {},
          week: cw,
        }
      }

      setState(next)
      setLoaded(true)
      void saveState(next)
      setStorageNotice(storageNoticeActive())
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const persist = React.useCallback((next: FitPlanState) => {
    setState(next)
    void saveState(next).then(() => setStorageNotice(storageNoticeActive()))
  }, [])

  const toggleSet = React.useCallback(
    (key: string) => {
      persist({ ...state, sets: { ...state.sets, [key]: !state.sets[key] } })
    },
    [state, persist],
  )

  const toggleCheck = React.useCallback(
    (key: string) => {
      persist({ ...state, checks: { ...state.checks, [key]: !state.checks[key] } })
    },
    [state, persist],
  )

  const toggleRule = React.useCallback(
    (index: number) => {
      const key = 'r' + index
      persist({ ...state, rules: { ...state.rules, [key]: !state.rules[key] } })
    },
    [state, persist],
  )

  const resetDay = React.useCallback(
    (dayId: string) => {
      const prefix = dayId + '-'
      const sets = { ...state.sets }
      const checks = { ...state.checks }
      const logs = { ...state.logs }
      Object.keys(sets).forEach((k) => { if (k.startsWith(prefix)) delete sets[k] })
      Object.keys(checks).forEach((k) => { if (k.startsWith(prefix)) delete checks[k] })
      Object.keys(logs).forEach((k) => { if (k.startsWith(prefix)) delete logs[k] })
      persist({ ...state, sets, checks, logs })
    },
    [state, persist],
  )

  const setBw = React.useCallback(
    (bw: string) => {
      persist({ ...state, bw })
    },
    [state, persist],
  )

  const setDiet = React.useCallback(
    (mode: 'train' | 'rest') => {
      persist({ ...state, diet: mode })
    },
    [state, persist],
  )

  const saveLog = React.useCallback(
    (key: string, kg: number | null, reps: number | null) => {
      persist({ ...state, logs: { ...state.logs, [key]: { kg, reps, ts: Date.now() } } })
    },
    [state, persist],
  )

  const upsertMetric = React.useCallback(
    (bw: number | null, waist: number | null) => {
      const today = new Date().toISOString().slice(0, 10)
      const metrics = [...state.metrics]
      const idx = metrics.findIndex((m) => m.date === today)
      const entry = { date: today, bw, waist }
      if (idx >= 0) metrics[idx] = entry
      else metrics.push(entry)
      metrics.sort((a, b) => a.date.localeCompare(b.date))
      persist({ ...state, metrics: metrics.slice(-90) })
    },
    [state, persist],
  )

  const replaceState = React.useCallback(
    (next: FitPlanState) => {
      persist(next)
    },
    [persist],
  )

  const value = React.useMemo<FitPlanContextValue>(
    () => ({
      state,
      loaded,
      storageNotice,
      toggleSet,
      toggleCheck,
      toggleRule,
      resetDay,
      setBw,
      setDiet,
      saveLog,
      upsertMetric,
      replaceState,
    }),
    [state, loaded, storageNotice, toggleSet, toggleCheck, toggleRule, resetDay, setBw, setDiet, saveLog, upsertMetric, replaceState],
  )

  return <FitPlanContext.Provider value={value}>{children}</FitPlanContext.Provider>
}

export function useFitPlan(): FitPlanContextValue {
  const ctx = React.useContext(FitPlanContext)
  if (!ctx) throw new Error('useFitPlan must be used within FitPlanProvider')
  return ctx
}

export { DEFAULT_STATE }
