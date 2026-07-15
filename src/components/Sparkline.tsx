import { sparklinePoints } from '~/lib/sparkline'

export function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) {
    return <p className="text-sub text-sm mt-1">Log a few entries to see a trend.</p>
  }
  const points = sparklinePoints(values)
  return (
    <svg viewBox="0 0 280 48" width="100%" height={48} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
