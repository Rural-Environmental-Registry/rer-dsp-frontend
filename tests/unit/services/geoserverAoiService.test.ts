import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildAoiWfsUrl,
  buildFeatureWfsUrl,
  fetchAoiGeometryById,
  fetchFeatureGeometryById,
  findAoiLayer,
  findLayerByKey,
  wmsBaseUrlToWfs,
} from '@/services/geoserverAoiService'
import type { MapLayers } from '@rural-environmental-registry/map_component/dist/types'

const sampleMapLayers = {
  mapLayers: [],
  customLayers: [
    {
      name: 'Territorial division',
      key: 'dt',
      toggle: { active: 'On', inactive: 'Off' },
      layers: [
        {
          baseUrl: 'http://localhost:22668/geoserver/dsp/wms',
          layers: 'dsp:territory-level-2',
          format: 'image/png',
          transparent: true,
          name: 'Country',
          activeDefault: true,
          active: true,
          key: 'dt_l2',
          toggle: { active: 'On', inactive: 'Off' },
          style: { color: '#DB2777', fillColor: 'transparent' },
        },
        {
          baseUrl: 'http://localhost:22668/geoserver/dsp/wms',
          layers: 'dsp:territory-level-3',
          format: 'image/png',
          transparent: true,
          name: 'Administrative area',
          activeDefault: false,
          active: false,
          key: 'dt_l3',
          toggle: { active: 'On', inactive: 'Off' },
          style: { color: '#701A3A', fillColor: 'transparent' },
        },
      ],
    },
    {
      name: 'Declared areas of interest',
      key: 'ird',
      toggle: { active: 'On', inactive: 'Off' },
      layers: [
        {
          baseUrl: 'http://localhost:22668/geoserver/dsp/wms',
          layers: 'dsp:area-of-interest',
          format: 'image/png',
          transparent: true,
          name: 'Area of interest',
          activeDefault: true,
          active: true,
          key: 'ird_aoi',
          toggle: { active: 'On', inactive: 'Off' },
          style: { color: '#cccc00', fillColor: '#ffff00' },
        },
      ],
    },
  ],
} as MapLayers

describe('geoserverAoiService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should convert WMS base URL to WFS', () => {
    expect(wmsBaseUrlToWfs('http://localhost:22668/geoserver/dsp/wms')).toBe(
      'http://localhost:22668/geoserver/dsp/wfs',
    )
  })

  it('should build GetFeature URL with CQL filter for AOI', () => {
    const url = buildAoiWfsUrl('http://localhost:22668/geoserver/dsp/wfs', "DF-1'2")
    expect(url).toContain('service=WFS')
    expect(url).toContain('request=GetFeature')
    expect(url).toContain('typeNames=dsp%3Aarea-of-interest')
    expect(url).toContain("CQL_FILTER=id%3D%27DF-1%27%272%27")
  })

  it('should build GetFeature URL for territory-level-3', () => {
    const url = buildFeatureWfsUrl(
      'http://localhost:22668/geoserver/dsp/wfs',
      'dsp:territory-level-3',
      '5300108',
    )
    expect(url).toContain('typeNames=dsp%3Aterritory-level-3')
    expect(url).toContain("CQL_FILTER=id%3D%275300108%27")
  })

  it('should find layers by key', () => {
    expect(findLayerByKey(sampleMapLayers, 'dt_l3')?.layers).toBe('dsp:territory-level-3')
    expect(findAoiLayer(sampleMapLayers)?.key).toBe('ird_aoi')
  })

  it('should fetch AOI geometry by id', async () => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'Polygon', coordinates: [] }, properties: {} }],
    }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => featureCollection,
      }),
    )

    const result = await fetchAoiGeometryById(
      'DF-123',
      'http://localhost:22668/geoserver/dsp/wfs',
    )

    expect(result).toEqual(featureCollection)
    expect(fetch).toHaveBeenCalled()
  })

  it('should fetch territory geometry by id', async () => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'MultiPolygon', coordinates: [] }, properties: {} }],
    }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => featureCollection,
      }),
    )

    const result = await fetchFeatureGeometryById({
      typeName: 'dsp:territory-level-3',
      id: '5300108',
      wfsBaseUrl: 'http://localhost:22668/geoserver/dsp/wfs',
    })

    expect(result).toEqual(featureCollection)
    expect(String(vi.mocked(fetch).mock.calls[0]?.[0])).toContain('territory-level-3')
  })

  it('should return null when feature collection is empty', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ type: 'FeatureCollection', features: [] }),
      }),
    )

    await expect(
      fetchAoiGeometryById('DF-123', 'http://localhost:22668/geoserver/dsp/wfs'),
    ).resolves.toBeNull()
  })
})
