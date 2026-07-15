import * as React from 'react'
import { useFitPlan } from '~/lib/state'

export function WeightLogModal({ logKey, onClose }: { logKey: string | null; onClose: () => void }) {
  const { state, saveLog } = useFitPlan()
  const [kg, setKg] = React.useState('')
  const [reps, setReps] = React.useState('')
  const kgRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!logKey) return
    const existing = state.logs[logKey]
    setKg(existing && existing.kg != null ? String(existing.kg) : '')
    setReps(existing && existing.reps != null ? String(existing.reps) : '')
    setTimeout(() => kgRef.current?.focus(), 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logKey])

  if (!logKey) return null

  const save = () => {
    const kgNum = parseFloat(kg)
    const repsNum = parseInt(reps, 10)
    if (!isNaN(kgNum) || !isNaN(repsNum)) {
      saveLog(logKey, isNaN(kgNum) ? null : kgNum, isNaN(repsNum) ? null : repsNum)
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/55 flex items-center justify-center z-[70] p-5"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="glass-modal rounded-[28px] p-5.5 w-full max-w-[320px]">
        <h3 className="text-lg font-bold mb-3.5">Log set</h3>
        <div className="my-2.5">
          <label className="block text-[13px] text-sub mb-1.5">Weight (kg)</label>
          <input
            ref={kgRef}
            type="number"
            inputMode="decimal"
            step={0.5}
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            className="w-full bg-pilloff border-[1.5px] border-pilloff rounded-[12px] text-current text-[17px] p-3 outline-none focus:border-accent"
          />
        </div>
        <div className="my-2.5">
          <label className="block text-[13px] text-sub mb-1.5">Reps</label>
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full bg-pilloff border-[1.5px] border-pilloff rounded-[12px] text-current text-[17px] p-3 outline-none focus:border-accent"
          />
        </div>
        <div className="flex gap-2.5 mt-4">
          <button onClick={onClose} className="flex-1 rounded-full py-3 text-[15px] font-bold border-[1.5px] border-pilloff bg-pilloff text-sub">
            Cancel
          </button>
          <button onClick={save} className="flex-1 rounded-full py-3 text-[15px] font-bold border-[1.5px] border-accent bg-accent text-accent-contrast shadow-[0_8px_22px_rgba(255,91,46,0.3)]">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
