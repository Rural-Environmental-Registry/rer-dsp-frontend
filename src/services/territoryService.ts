import { httpGet } from '@/services/httpClient'
import type { HierarchyLevelKey } from '@/types/hierarchy'
import type { TerritoryBoundaryBox, TerritoryOption } from '@/types/territory'

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

export async function getTerritoryBoundaryBox(options: {
  level1Ids?: string[] | null
  level2Ids?: string[] | null
  level3Ids?: string[] | null
} = {}): Promise<TerritoryBoundaryBox> {
  const params = new URLSearchParams()
  for (const id of options.level1Ids ?? []) {
    const trimmed = id?.trim()
    if (trimmed) {
      params.append('level1Ids', trimmed)
    }
  }
  for (const id of options.level2Ids ?? []) {
    const trimmed = id?.trim()
    if (trimmed) {
      params.append('level2Ids', trimmed)
    }
  }
  for (const id of options.level3Ids ?? []) {
    const trimmed = id?.trim()
    if (trimmed) {
      params.append('level3Ids', trimmed)
    }
  }
  const query = params.toString()
  return httpGet<TerritoryBoundaryBox>(
    query ? `territory/boundary-box?${query}` : 'territory/boundary-box',
  )
}
