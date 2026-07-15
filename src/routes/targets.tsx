import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { RestTimerBar } from '~/components/RestTimerBar'
import { useFitPlan } from '~/lib/state'

export const Route = createFileRoute('/targets')({
  component: TargetsPage,
})

function calcTargets(bwStr: string) {
  const bw = parseFloat(bwStr)
  if (!bw || bw < 30 || bw > 300) return null
  const kcal = Math.round(bw * 32 - 400)
  const pro = Math.round(bw * 1.8)
  const fat = Math.round(bw * 0.9)
  const carb = Math.max(0, Math.round((kcal - pro * 4 - fat * 9) / 4))
  return { kcal, pro, fat, carb }
}

function TargetsPage() {
  const { state, setBw } = useFitPlan()
  const targets = calcTargets(state.bw)

  return (
    <section>
      <div className="glass rounded-[28px] p-5 my-3.5">
        <span className="inline-block bg-badge text-badge text-[11px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full mb-2.5">Calculator</span>
        <h2 className="text-xl font-bold">Your numbers</h2>
        <p className="text-sub text-[13.5px] mt-0.5">Enter body weight — targets update instantly.</p>
        <div className="my-2.5">
          <label className="block text-[13px] text-sub mb-1.5">Body weight (kg)</label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="e.g. 80"
            value={state.bw}
            onChange={(e) => setBw(e.target.value)}
            className="w-full bg-pilloff border-[1.5px] border-pilloff rounded-[12px] text-current text-[17px] p-3 outline-none focus:border-accent"
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5 mt-3.5">
          <div className="bg-pilloff border border-hairline rounded-[20px] p-3 text-center">
            <div className="text-[28px] font-bold text-accent tabular-nums">{targets ? targets.kcal : '—'}</div>
            <div className="text-xs text-sub uppercase tracking-wider">kcal / day</div>
          </div>
          <div className="bg-pilloff border border-hairline rounded-[20px] p-3 text-center">
            <div className="text-[28px] font-bold text-accent tabular-nums">{targets ? targets.pro : '—'}</div>
            <div className="text-xs text-sub uppercase tracking-wider">protein g</div>
          </div>
          <div className="bg-pilloff border border-hairline rounded-[20px] p-3 text-center">
            <div className="text-[28px] font-bold text-accent tabular-nums">{targets ? targets.fat : '—'}</div>
            <div className="text-xs text-sub uppercase tracking-wider">fat g</div>
          </div>
          <div className="bg-pilloff border border-hairline rounded-[20px] p-3 text-center">
            <div className="text-[28px] font-bold text-accent tabular-nums">{targets ? targets.carb : '—'}</div>
            <div className="text-xs text-sub uppercase tracking-wider">carbs g</div>
          </div>
        </div>
        <div className="bg-glass border-l-[3px] border-accent rounded-r-[12px] py-2.5 px-3 text-[13.5px] text-sub mt-3">
          <b className="text-current">How it&apos;s calculated:</b> maintenance ≈ weight × 32, minus a 400 kcal deficit. Protein 1.8 g/kg, fat 0.9 g/kg, carbs fill the rest. Aim to lose ~0.5% of body weight per week.
        </div>
      </div>

      <div className="glass rounded-[28px] p-5 my-3.5">
        <span className="inline-block bg-badge text-badge text-[11px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full mb-2.5">Adjust after 2 weeks</span>
        <h2 className="text-xl font-bold">Course-correct</h2>
        <p className="text-sub text-[13.5px] mt-1.5">
          Losing faster than 0.5%/week → add 100–200 kcal. Nothing moving after 3 weeks → subtract 100–200 kcal. Judge the weekly average weight, never a single day. If strength keeps dropping, the deficit is too aggressive or sleep/protein is short.
        </p>
      </div>

      <div className="glass rounded-[28px] p-5 my-3.5">
        <span className="inline-block bg-badge text-badge text-[11px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-full mb-2.5">Track weekly</span>
        <h2 className="text-xl font-bold">Progress markers</h2>
        <p className="text-sub text-[13.5px] mt-1.5">
          ① Weights lifted (log every session) · ② Same-finisher distance or rounds · ③ Waist measurement — the best belly-fat proxy · ④ Monthly photos. Visible change lands around weeks 6–10. Fat comes off body-wide; no exercise targets belly fat directly.
        </p>
      </div>
      <RestTimerBar />
    </section>
  )
}
