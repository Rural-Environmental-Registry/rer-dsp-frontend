/**
  * Darkens a hexadecimal color by mixing it with black.
  * @param hex color in #rgb or #rrggbb format
  * @param amount fraction 0–1 (e.g., 0.3 = 30% darker)
*/
export function darkenHex(hex: string, amount = 0.3): string {
  const normalized = hex.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(normalized)) {
    return hex
  }

  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => `${c}${c}`)
          .join('')
      : normalized

  const factor = Math.min(1, Math.max(0, amount))
  const channels = [0, 2, 4].map((offset) => {
    const value = Number.parseInt(full.slice(offset, offset + 2), 16)
    return Math.round(value * (1 - factor))
  })

  return `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}
