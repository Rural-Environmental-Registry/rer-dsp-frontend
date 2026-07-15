/** Formata número com separadores pt-BR. */
export function formatValue(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') {
    return '—'
  }

  const numeric = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(numeric)) {
    return String(value)
  }

  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
  }).format(numeric)
}

export function formatValueInt(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') {
    return '—'
  }

  const numeric = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(numeric)) {
    return String(value)
  }

  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 0,
  }).format(numeric)
}
