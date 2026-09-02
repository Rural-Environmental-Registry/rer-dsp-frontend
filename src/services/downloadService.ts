import { httpGet, httpGetBlob, httpPost } from '@/services/httpClient'
import type {
  DownloadItemDTO,
  DownloadSearchFilterDTO,
  DownloadThemeDTO,
} from '@/types/download'

export async function getDownloadThemes(): Promise<DownloadThemeDTO[]> {
  const data = await httpGet<DownloadThemeDTO[]>('downloads/themes')
  return data ?? []
}

export async function searchDownloads(
  filter: DownloadSearchFilterDTO,
): Promise<DownloadItemDTO[]> {
  const data = await httpPost<DownloadItemDTO[]>('downloads/search', filter)
  return data ?? []
}

export async function downloadThemeFile(params: {
  level2: string
  level3?: string | null
  theme: string
  format: string
}): Promise<{ blob: Blob; fileName: string }> {
  const query = new URLSearchParams({
    level2: params.level2,
    theme: params.theme,
    format: params.format,
  })
  if (params.level3) {
    query.set('level3', params.level3)
  }

  const { blob, fileName } = await httpGetBlob(`downloads/file?${query.toString()}`)
  const fallback = params.level3
    ? `${params.level2}_${params.level3}_${params.theme}.${params.format}`
    : `${params.level2}_${params.theme}.${params.format}`

  return { blob, fileName: fileName || fallback }
}

export async function downloadFeaturesBundle(
  aoiId: string,
): Promise<{ blob: Blob; fileName: string }> {
  const query = new URLSearchParams({ aoiId })
  const { blob, fileName } = await httpGetBlob(`downloads/features-bundle?${query.toString()}`)
  return { blob, fileName: fileName || `${aoiId}_features.zip` }
}

export function triggerBrowserDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
