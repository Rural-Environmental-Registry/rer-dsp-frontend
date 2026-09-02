import { httpGet } from '@/services/httpClient'
import type { LayersConfig, MapLayers } from '@rural-environmental-registry/map_component/dist/types'

export type BaseMapsResponse = {
  baseMap: MapLayers['mapLayers']
}

export type LayersResponse = {
  groups: LayersConfig
}

export async function getBaseMaps(): Promise<BaseMapsResponse> {
  return httpGet<BaseMapsResponse>('map/getBaseMaps')
}

export async function getLayers(): Promise<LayersResponse> {
  return httpGet<LayersResponse>('map/getLayers')
}

export function toMapLayers(baseMaps: BaseMapsResponse, layers: LayersResponse): MapLayers {
  return {
    mapLayers: baseMaps.baseMap,
    customLayers: layers.groups,
  }
}

export async function loadMapLayers(): Promise<MapLayers> {
  const [baseMaps, layers] = await Promise.all([getBaseMaps(), getLayers()])
  return toMapLayers(baseMaps, layers)
}
