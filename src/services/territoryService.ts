import { httpGet } from '@/services/httpClient'
import type { HierarchyLevelKey } from '@/types/hierarchy'
import type { TerritoryOption } from '@/types/territory'

export async function getTerritoryOptions(
  level: HierarchyLevelKey,
  parentId?: string | null,
): Promise<TerritoryOption[]> {
  const params = new URLSearchParams({ level })
  if (parentId) {
    params.set('parentId', parentId)
  }
  const data = await httpGet<TerritoryOption[]>(`territory/options?${params.toString()}`)
  return data ?? []
}
