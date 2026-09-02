import { httpGet } from '@/services/httpClient'
import type { CityDTO, RegionDTO, StateDTO } from '@/types/location'

export async function getStates(): Promise<StateDTO[]> {
  const data = await httpGet<StateDTO[]>('state/getAll')
  return [...(data ?? [])].sort((a, b) =>
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }),
  )
}

export async function getCitiesByState(stateId: string): Promise<CityDTO[]> {
  const data = await httpGet<CityDTO[]>(`state/getCitiesByUf/${stateId}`)
  return [...(data ?? [])].sort((a, b) =>
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }),
  )
}

export async function getStatesByRegion(region: string): Promise<StateDTO[]> {
  const data = await httpGet<StateDTO[]>(`state/getUfsByRegion/${region}`)
  return [...(data ?? [])].sort((a, b) =>
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }),
  )
}

export async function getRegionsWithStates(): Promise<RegionDTO[]> {
  const data = await httpGet<RegionDTO[]>('geoServices/getRegions')
  return data ?? []
}
