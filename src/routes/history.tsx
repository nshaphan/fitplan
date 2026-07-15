import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Sparkline } from '~/components/Sparkline'
import { RestTimerBar } from '~/components/RestTimerBar'
import { useFitPlan } from '~/lib/state'
import { rollingAvg } from '~/lib/sparkline'
import { exportState, parseImportFile } from '~/lib/exportImport'

export const Route = createFileRoute('/history')({
  component: HistoryPage,
})

function HistoryPage() {
  const { state, upsertMetric, replaceState } = useFitPlan()
  const [bwInput, setBwInput] = React.useState('')
  const [waistInput, setWaistInput] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const today = new Date().toISOString().slice(0, 10)
  React.useEffect(() => {
    const todays = state.metrics.find((m) => m.date === today)
    setBwInput(todays && todays.bw != null ? String(todays.bw) : '')
    setWaistInput(todays && todays.waist != null ? String(todays.waist) : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.metrics])

  const bwVals = state.metrics.filter((m) => m.bw != null).map((m) => m.bw as number)
  const waistVals = state.metrics.filter((m) => m.waist != null).map((m) => m.waist as number)
  const bwAvg = rollingAvg(state.metrics, 'bw')
  const waistAvg = rollingAvg(state.metrics, 'waist')

  const logToday = () => {
    const bw = parseFloat(bwInput)
    const waist = parseFloat(waistInput)
    if (isNaN(bw) && isNaN(waist)) return
    upsertMetric(isNaN(bw) ? null : bw, isNaN(waist) ? null : waist)
  }

  const hist = state.history.slice(-8)
  const w = 280, h = 64, pad = 6, barGap = 6
  const barW = hist.length ? (w - pad * 2 - barGap * (hist.length - 1)) / hist.length : 0

  const liftNames = new Set<string>()
  hist.forEach((wk) => Object.keys(wk.lifts || {}).forEach((n) => liftNames.add(n)))
  const progressionRows = Array.from(liftNames)
    .map((name) => {
      const series = hist.map((wk) => (wk.lifts && wk.lifts[name] != null ? wk.lifts[name] : null)).filter((v): v is number => v != null)
      if (series.length < 2) return null
      const first = series[0]
      const last = series[series.length - 1]
      const delta = Math.round((last - first) * 10) / 10
      const sign = delta > 0 ? '+' : ''
      return { name, first, last, delta, sign }
    })
    .filter((r): r is NonNullable<typeof r> => r != null)

  const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const parsed = await parseImportFile(file)
    if (!parsed) {
      alert('That file could not be read as a FitPlan backup.')
      return
    }
    if (!confirm('Import this backup? It will replace your current progress.')) return
    replaceState(parsed)
  }

  return (
    <section>
      <div className="glass rounded-[28px] p-5 my-3.5">
        <span className="inline-block bg-badge text-badge text-[11px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full mb-2.5">Log weekly</span>
        <h2 className="text-xl font-bold">Body metrics</h2>
        <p className="text-sub text-[13.5px] mt-0.5">Body weight and waist (the best belly-fat proxy). Logging today overwrites today&apos;s entry.</p>
        <div className="my-2.5">
          <label className="block text-[13px] text-sub mb-1.5">Body weight (kg)</label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="e.g. 79.5"
            value={bwInput}
            onChange={(e) => setBwInput(e.target.value)}
            className="w-full bg-pilloff border-[1.5px] border-pilloff rounded-[12px] text-current text-[17px] p-3 outline-none focus:border-accent"
          />
        </div>
        <div className="my-2.5">
          <label className="block text-[13px] text-sub mb-1.5">Waist (cm)</label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="e.g. 88"
            value={waistInput}
            onChange={(e) => setWaistInput(e.target.value)}
            className="w-full bg-pilloff border-[1.5px] border-pilloff rounded-[12px] text-current text-[17px] p-3 outline-none focus:border-accent"
          />
        </div>
        <button onClick={logToday} className="w-full bg-pilloff border-[1.5px] border-accent text-accent rounded-[20px] py-3.5 text-[15px] font-bold my-1 mb-3.5">
          Log today
        </button>
        <div className="flex justify-between items-baseline mt-3.5">
          <span className="text-[13px] font-semibold">Weight trend</span>
          <span className="text-xs text-accent font-bold">{bwAvg != null ? `${bwAvg.toFixed(1)} kg avg` : 'No data yet'}</span>
        </div>
        <Sparkline values={bwVals.slice(-12)} color="var(--accent)" />
        <div className="flex justify-between items-baseline mt-3.5">
          <span className="text-[13px] font-semibold">Waist trend</span>
          <span className="text-xs text-accent font-bold">{waistAvg != null ? `${waistAvg.toFixed(1)} cm avg` : 'No data yet'}</span>
        </div>
        <Sparkline values={waistVals.slice(-12)} color="var(--info)" />
      </div>

      <div className="glass rounded-[28px] p-5 my-3.5">
        <span className="inline-block bg-badge text-badge text-[11px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full mb-2.5">Last 8 weeks</span>
        <h2 className="text-xl font-bold">Weekly completion</h2>
        <p className="text-sub text-[13.5px] mt-0.5">Fills in as weeks roll over.</p>
        {hist.length ? (
          <>
            <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
              {hist.map((wk, i) => {
                const x = pad + i * (barW + barGap)
                const barH = Math.max(2, (wk.pct / 100) * (h - pad * 2))
                const y = h - pad - barH
                const isLast = i === hist.length - 1
                return (
                  <rect
                    key={wk.week}
                    x={x.toFixed(1)}
                    y={y.toFixed(1)}
                    width={barW.toFixed(1)}
                    height={barH.toFixed(1)}
                    rx={3}
                    fill={isLast ? 'var(--accent)' : 'var(--done)'}
                  />
                )
              })}
            </svg>
            <p className="text-sub text-sm mt-1">{hist.map((wk) => `${wk.week}: ${wk.pct}%`).join(' · ')}</p>
          </>
        ) : (
          <p className="text-sub text-sm mt-2.5">Your first weekly summary appears after this week rolls over.</p>
        )}
      </div>

      <div className="glass rounded-[28px] p-5 my-3.5">
        <span className="inline-block bg-badge text-badge text-[11px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full mb-2.5">Working weight</span>
        <h2 className="text-xl font-bold">Lift progression</h2>
        <p className="text-sub text-[13.5px] mt-0.5">First vs. most recent logged weight, across weeks.</p>
        {progressionRows.length ? (
          progressionRows.map((row) => (
            <div key={row.name} className="flex justify-between items-center gap-2.5 py-2.5 border-t border-hairline first:border-t-0">
              <span className="text-sm font-semibold">{row.name}</span>
              <span className="text-[13px] font-bold text-done tabular-nums whitespace-nowrap">
                {row.first}kg → {row.last}kg ({row.sign}{row.delta}kg)
              </span>
            </div>
          ))
        ) : (
          <p className="text-sub text-sm">Log the same lift across two or more weeks to see progression.</p>
        )}
      </div>

      <div className="glass rounded-[28px] p-5 my-3.5">
        <span className="inline-block bg-badge text-badge text-[11px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full mb-2.5">Backup</span>
        <h2 className="text-xl font-bold">Your data</h2>
        <p className="text-sub text-[13.5px] mt-0.5">Export a JSON backup to move to a new device, or restore one.</p>
        <div className="flex gap-2 mt-3">
          <button onClick={() => void exportState(state)} className="flex-1 bg-pilloff border-[1.5px] border-pilloff text-current rounded-full py-3 text-sm font-bold">
            Export
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-pilloff border-[1.5px] border-pilloff text-current rounded-full py-3 text-sm font-bold">
            Import
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onImportFile} />
      </div>
      <RestTimerBar />
    </section>
  )
}
