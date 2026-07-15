const STORAGE_KEY = 'fitplan-state'

declare global {
  interface Window {
    storage?: {
      get(key: string): Promise<{ value?: string } | undefined>
      set(key: string, value: string): Promise<void>
    }
  }
}

const memoryStore: Record<string, string> = {}
let notice = false

export function storageNoticeActive() {
  return notice
}

export async function saveState(state: unknown): Promise<void> {
  const payload = JSON.stringify(state)
  try {
    if (typeof window !== 'undefined' && window.storage) {
      await window.storage.set(STORAGE_KEY, payload)
      return
    }
  } catch {
    // fall through to localStorage
  }
  try {
    localStorage.setItem(STORAGE_KEY, payload)
    return
  } catch {
    // fall through to memory
  }
  memoryStore[STORAGE_KEY] = payload
  notice = true
}

export async function loadState<T>(): Promise<T | null> {
  let raw: string | null = null
  try {
    if (typeof window !== 'undefined' && window.storage) {
      const r = await window.storage.get(STORAGE_KEY)
      if (r && r.value) raw = r.value
    }
  } catch {
    // fall through
  }
  if (raw === null) {
    try {
      raw = localStorage.getItem(STORAGE_KEY)
    } catch {
      raw = memoryStore[STORAGE_KEY] ?? null
      if (raw === null) notice = true
    }
  }
  if (raw) {
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }
  return null
}
