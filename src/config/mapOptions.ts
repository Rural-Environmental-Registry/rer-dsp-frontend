import type {
  DescriptiveMemorial,
  MapOptionsConfig,
} from '@rural-environmental-registry/map_component/dist/types'

/** Opções padrão do mapa na Home (exibição / consulta). */
export const DSP_MAP_OPTIONS: MapOptionsConfig = {
  map: {
    config: {
      id: 'dsp-map',
      zoomControl: true,
      zoomControlPosition: 'topright',
      minZoom: 3,
      maxZoom: 17,
      center: [-15.235, -51.9253],
      zoom: 4,
      dragging: true,
      scrollWheelZoom: true,
      removeControlLayers: true,
    },
  },
  layersMenu: {
    size: 'medium',
    persist: false,
  },
  tools: {
    show: true,
    position: 'topright',
    fullscreen: { show: true, title: 'Tela cheia' },
    center: { show: true, title: 'Centralizar', target: 'initial' },
    measureArea: { show: true, title: 'Medir área' },
    measureLine: { show: true, title: 'Medir distância' },
    measurePolygon: { show: true, title: 'Medir polígono' },
    texts: {
      measureResult: 'Medição',
      measureLength: 'Distância',
      measureArea: 'Área',
      measureCancel: 'Cancelar',
      measureFinish: 'Finalizar medição',
      noGeometry: 'Nenhuma geometria para centralizar',
    },
  },
}

/** Memorial descritivo desligado na Home (mapa só de visualização). */
export const DSP_MAP_MEMORIAL: DescriptiveMemorial = {
  show: false,
}
