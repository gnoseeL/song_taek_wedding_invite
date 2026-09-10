function loadAccountSides() {
  const raw = import.meta.env.VITE_ACCOUNTS_JSON
  if (!raw) {
    console.warn('[accounts] VITE_ACCOUNTS_JSON is not set')
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('[accounts] Failed to parse VITE_ACCOUNTS_JSON', error)
    return []
  }
}

export const accountSides = loadAccountSides()
