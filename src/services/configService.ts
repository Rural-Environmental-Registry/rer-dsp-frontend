import { httpGet } from '@/services/httpClient'
import type { InstallationConfig } from '@/types/installationConfig'
import { FALLBACK_INSTALLATION_CONFIG } from '@/config/installationConfigFallback'

let cachedConfig: InstallationConfig | null = null

export async function getInstallationConfig(): Promise<InstallationConfig> {
  if (cachedConfig) {
    return cachedConfig
  }

  try {
    cachedConfig = await httpGet<InstallationConfig>('config/installation')
    return cachedConfig
  } catch (error) {
    console.warn('Installation config unavailable — using local fallback.', error)
    cachedConfig = FALLBACK_INSTALLATION_CONFIG
    return cachedConfig
  }
}

export function resetInstallationConfigCache(): void {
  cachedConfig = null
}

export function peekInstallationConfig(): InstallationConfig {
  return cachedConfig ?? FALLBACK_INSTALLATION_CONFIG
}
