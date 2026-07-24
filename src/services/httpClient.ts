interface RuntimeEnv {
  urlBackend?: string
}

let cachedBaseUrl: string | null = null
let resolveBaseUrlPromise: Promise<string> | null = null

async function loadApiBaseUrl(): Promise<string> {
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
    // fall through
  }

  throw new Error(
    'API URL is not configured. Set VITE_DSP_API_URL or public/config/env.json (urlBackend).',
  )
}

export async function resolveApiBaseUrl(): Promise<string> {
  if (cachedBaseUrl) {
    return cachedBaseUrl
  }
  if (resolveBaseUrlPromise) {
    return resolveBaseUrlPromise
  }

  resolveBaseUrlPromise = loadApiBaseUrl().catch((error) => {
    resolveBaseUrlPromise = null
    throw error
  })

  return resolveBaseUrlPromise
}

async function buildUrl(path: string): Promise<string> {
  const base = await resolveApiBaseUrl()
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${base}/${normalized}`
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} at ${response.url}`)
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

export async function httpGetBlob(
  path: string,
): Promise<{ blob: Blob; fileName: string | null }> {
  const url = await buildUrl(path)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} at ${response.url}`)
  }

  const disposition = response.headers.get('Content-Disposition')
  let fileName: string | null = null
  if (disposition) {
    const match = /filename="?([^"]+)"?/i.exec(disposition)
    fileName = match?.[1] ?? null
  }

  return { blob: await response.blob(), fileName }
}

export function resetHttpClient(): void {
  cachedBaseUrl = null
  resolveBaseUrlPromise = null
}
