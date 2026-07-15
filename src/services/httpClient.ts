interface RuntimeEnv {
  urlBackend?: string
}

let cachedBaseUrl: string | null = null

/**
 * Resolve a URL do backend.
 * Ordem: VITE_DSP_API_URL (build/Docker) → config/env.json (dev local).
 * Assim o localhost do env.json não sobrescreve a URL relativa no container.
 */
export async function resolveApiBaseUrl(): Promise<string> {
  if (cachedBaseUrl) {
    return cachedBaseUrl
  }

  const fromEnv = import.meta.env.VITE_DSP_API_URL
  if (fromEnv) {
    cachedBaseUrl = String(fromEnv).replace(/\/$/, '')
    return cachedBaseUrl
  }

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}config/env.json`, {
      cache: 'no-store',
    })
    if (response.ok) {
      const data = (await response.json()) as RuntimeEnv
      if (data?.urlBackend) {
        cachedBaseUrl = data.urlBackend.replace(/\/$/, '')
        return cachedBaseUrl
      }
    }
  } catch {
    // Sem env.json — erro abaixo.
  }

  throw new Error(
    'URL da API não configurada. Defina VITE_DSP_API_URL ou public/config/env.json (urlBackend).',
  )
}

async function buildUrl(path: string): Promise<string> {
  const base = await resolveApiBaseUrl()
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${base}/${normalized}`
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} em ${response.url}`)
  }
  return (await response.json()) as T
}

export async function httpGet<T>(path: string): Promise<T> {
  const url = await buildUrl(path)
  const response = await fetch(url)
  return parseJson<T>(response)
}

export async function httpPost<T>(path: string, body: unknown): Promise<T> {
  const url = await buildUrl(path)
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return parseJson<T>(response)
}

export function resetHttpClient(): void {
  cachedBaseUrl = null
}
