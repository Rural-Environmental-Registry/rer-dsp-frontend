/**
 * Date formatting for display (input always in the API transfer format).
 */

const TOKEN = /(yyyy|MM|dd|HH|mm|ss)/g

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function applyPattern(
  pattern: string,
  parts: { yyyy: string; MM: string; dd: string; HH: string; mm: string; ss: string },
): string {
  return pattern.replace(TOKEN, (token) => parts[token as keyof typeof parts] ?? token)
}

/**
 * Formats a date (`yyyy-MM-dd`) using the display pattern (e.g., dd/MM/yyyy).
 * Without a pattern: returns the transfer value (ISO). Invalid value: returns the original value.
 */
export function formatDate(
  isoDay: string | null | undefined,
  pattern: string | null | undefined,
): string {
  if (!isoDay) {
    return ''
  }
  const trimmed = isoDay.trim()
  const displayPattern = pattern?.trim()
  if (!displayPattern) {
    return trimmed
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!match) {
    return isoDay
  }
  return applyPattern(displayPattern, {
    yyyy: match[1],
    MM: match[2],
    dd: match[3],
    HH: '00',
    mm: '00',
    ss: '00',
  })
}

/**
 * Formats a date-time (`yyyy-MM-dd'T'HH:mm:ss` or with a fraction) using the display pattern.
 * Without a pattern: returns the transfer value (ISO).
 */
export function formatDateTime(
  isoDateTime: string | null | undefined,
  pattern: string | null | undefined,
): string {
  if (!isoDateTime) {
    return ''
  }
  const trimmed = isoDateTime.trim()
  const displayPattern = pattern?.trim()
  if (!displayPattern) {
    return trimmed
  }
  const match =
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(trimmed)
  if (!match) {
    // It might just be the day — try formatDate with the same pattern (or just the day if the pattern includes the time)
    const dayPattern = displayPattern.includes('HH') ? 'yyyy-MM-dd' : displayPattern
    return formatDate(isoDateTime, dayPattern)
  }
  return applyPattern(displayPattern, {
    yyyy: match[1],
    MM: match[2],
    dd: match[3],
    HH: match[4],
    mm: match[5],
    ss: match[6] ?? '00',
  })
}
