export function sparklinePoints(values: number[], width = 280, height = 48, pad = 4): string {
  if (values.length < 2) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = (width - pad * 2) / (values.length - 1)
  return values
    .map((v, i) => {
      const x = pad + i * stepX
      const y = height - pad - ((v - min) / range) * (height - pad * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

export function rollingAvg(metrics: { bw?: number | null; waist?: number | null }[], field: 'bw' | 'waist'): number | null {
  const vals = metrics
    .filter((m) => m[field] != null)
    .slice(-7)
    .map((m) => m[field] as number)
  if (!vals.length) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}
