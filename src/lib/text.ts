export function splitSummary(summary: string | null | undefined): { main: string; note: string } {
  if (!summary) return { main: '', note: '' }
  const trimmed = summary.trim()

  if (trimmed.includes('\n')) {
    const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length > 1) {
      return {
        main: lines.slice(0, -1).join(' '),
        note: lines[lines.length - 1] || ''
      }
    }
  }

  const matches = trimmed.match(/[^.!?]+[.!?]+(?:\s+|$)/g)
  if (matches && matches.length > 1) {
    const last = matches[matches.length - 1]
    const note = last ? last.trim() : ''
    const main = matches.slice(0, -1).join('').trim()
    return { main, note }
  }

  return { main: trimmed, note: '' }
}
