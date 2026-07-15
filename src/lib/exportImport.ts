import type { FitPlanState } from '~/lib/state'
import { DEFAULT_STATE } from '~/lib/state'
import { isoWeekString } from '~/lib/week'

declare global {
  interface Navigator {
    canShare?: (data?: ShareData) => boolean
  }
}

export async function exportState(state: FitPlanState): Promise<void> {
  const payload = JSON.stringify(state, null, 2)
  const filename = `fitplan-backup-${new Date().toISOString().slice(0, 10)}.json`
  const blob = new Blob([payload], { type: 'application/json' })
  try {
    const file = new File([blob], filename, { type: 'application/json' })
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'FitPlan backup' })
      return
    }
  } catch {
    // fall through to download
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export async function parseImportFile(file: File): Promise<FitPlanState | null> {
  const text = await file.text()
  try {
    const parsed = JSON.parse(text) as Partial<FitPlanState>
    return { ...DEFAULT_STATE, ...parsed, week: isoWeekString(new Date()) }
  } catch {
    return null
  }
}
