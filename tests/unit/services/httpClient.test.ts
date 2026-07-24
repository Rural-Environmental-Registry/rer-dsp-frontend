import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { httpGet, httpPost, resetHttpClient, resolveApiBaseUrl } from '@/services/httpClient'

describe('httpClient', () => {
  beforeEach(() => {
    resetHttpClient()
    vi.unstubAllEnvs()
    vi.stubEnv('VITE_DSP_API_URL', 'http://localhost:8080/dsp-backend')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
        url: 'http://localhost:8080/dsp-backend/state/getAll',
      }),
    )
  })

  afterEach(() => {
    resetHttpClient()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  describe('resolveApiBaseUrl', () => {
    it('should prefer VITE_DSP_API_URL when defined', async () => {
      const baseUrl = await resolveApiBaseUrl()
      expect(baseUrl).toBe('http://localhost:8080/dsp-backend')
    })

    it('should fall back to env.json when VITE_DSP_API_URL is empty', async () => {
      resetHttpClient()
      vi.stubEnv('VITE_DSP_API_URL', '')
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ urlBackend: 'http://api.from-json/dsp-backend/' }),
        }),
      )

      const baseUrl = await resolveApiBaseUrl()
      expect(baseUrl).toBe('http://api.from-json/dsp-backend')
    })

    it('should fetch env.json only once for parallel callers', async () => {
      resetHttpClient()
      vi.stubEnv('VITE_DSP_API_URL', '')

      let resolveFetch!: (value: {
        ok: boolean
        json: () => Promise<{ urlBackend: string }>
      }) => void
      const fetchMock = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve
          }),
      )
      vi.stubGlobal('fetch', fetchMock)

      const pending = Promise.all([
        resolveApiBaseUrl(),
        resolveApiBaseUrl(),
        resolveApiBaseUrl(),
      ])

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock.mock.calls[0]?.[0]).toContain('config/env.json')

      resolveFetch({
        ok: true,
        json: async () => ({ urlBackend: 'http://api.from-json/dsp-backend/' }),
      })

      const urls = await pending
      expect(urls).toEqual([
        'http://api.from-json/dsp-backend',
        'http://api.from-json/dsp-backend',
        'http://api.from-json/dsp-backend',
      ])
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('httpGet', () => {
    it('should call fetch with built URL and return JSON', async () => {
      const data = await httpGet<{ ok: boolean }>('state/getAll')

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/dsp-backend/state/getAll')
      expect(data).toEqual({ ok: true })
    })

    it('should throw when response is not ok', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          url: 'http://localhost:8080/dsp-backend/state/getAll',
        }),
      )

      await expect(httpGet('state/getAll')).rejects.toThrow('HTTP 500')
    })
  })

  describe('httpPost', () => {
    it('should post JSON body', async () => {
      const body = { level2Id: 'DF', level3Ids: [] }
      await httpPost('totalizer/getTotalizers', body)

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/dsp-backend/totalizer/getTotalizers',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
      )
    })
  })
})
