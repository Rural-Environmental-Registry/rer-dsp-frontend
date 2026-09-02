import type { LayerData, MapLayers } from '@rural-environmental-registry/map_component/dist/types'

export const AOI_LAYER_KEY = 'ird_aoi'
export const AOI_TYPE_NAME = 'dsp:area-of-interest'
export const TERRITORY_LEVEL_2_LAYER_KEY = 'dt_l2'
export const TERRITORY_LEVEL_3_LAYER_KEY = 'dt_l3'
export const TERRITORY_LEVEL_2_TYPE_NAME = 'dsp:territory-level-2'
export const TERRITORY_LEVEL_3_TYPE_NAME = 'dsp:territory-level-3'

export type AoiHighlightStyle = {
  color: string
  fillColor: string
  weight?: number
  fillOpacity?: number
  opacity?: number
}

export function findLayerByKey(
  mapLayers: MapLayers | null | undefined,
  key: string,
): LayerData | null {
  if (!mapLayers?.customLayers) {
    return null
  }
  for (const group of mapLayers.customLayers) {
    const found = group.layers.find((layer) => layer.key === key)
    if (found) {
      return found
    }
  }
  return null
}

export function findAoiLayer(mapLayers: MapLayers | null | undefined): LayerData | null {
  const byKey = findLayerByKey(mapLayers, AOI_LAYER_KEY)
  if (byKey) {
    return byKey
  }
  if (!mapLayers?.customLayers) {
    return null
  }
  for (const group of mapLayers.customLayers) {
    const found = group.layers.find(
      (layer) =>
        layer.layers === AOI_TYPE_NAME || layer.layers?.includes('area-of-interest'),
    )
    if (found) {
      return found
    }
  }
  return null
}

export function wmsBaseUrlToWfs(baseUrl: string): string {
  return baseUrl.replace(/\/wms\/?$/i, '/wfs')
}

export function buildFeatureWfsUrl(
  wfsBaseUrl: string,
  typeName: string,
  featureId: string,
): string {
  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeNames: typeName,
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    CQL_FILTER: `id='${featureId.replaceAll("'", "''")}'`,
  })
  const base = wfsBaseUrl.replace(/\/$/, '')
  return `${base}?${params.toString()}`
}

export function buildAoiWfsUrl(wfsBaseUrl: string, aoiId: string): string {
  return buildFeatureWfsUrl(wfsBaseUrl, AOI_TYPE_NAME, aoiId)
}

export async function fetchFeatureGeometryById(options: {
  typeName: string
  id: string
  wfsBaseUrl: string
}): Promise<GeoJSON.FeatureCollection | null> {
  const url = buildFeatureWfsUrl(options.wfsBaseUrl, options.typeName, options.id)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} at ${url}`)
  }
  const data = (await response.json()) as GeoJSON.FeatureCollection
  if (!data?.features?.length) {
    return null
  }
  return data
}

export async function fetchAoiGeometryById(
  aoiId: string,
  wfsBaseUrl: string,
): Promise<GeoJSON.FeatureCollection | null> {
  return fetchFeatureGeometryById({
    typeName: AOI_TYPE_NAME,
    id: aoiId,
    wfsBaseUrl,
  })
}
