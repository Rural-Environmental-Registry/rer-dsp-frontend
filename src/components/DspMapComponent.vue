<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MapaDPG from '@rural-environmental-registry/map_component'
import type { MapLayers, MapOptionsConfig } from '@rural-environmental-registry/map_component/dist/types'
import { DSP_MAP_MEMORIAL, DSP_MAP_OPTIONS } from '@/config/mapOptions'
import { loadMapLayers } from '@/services/mapService'

const props = withDefaults(
  defineProps<{
    options?: MapOptionsConfig
  }>(),
  {
    options: () => DSP_MAP_OPTIONS,
  },
)

const layers = ref<MapLayers | null>(null)
const loadError = ref('')
const mapRef = ref<InstanceType<typeof MapaDPG> | null>(null)

const mapInstance = computed(() => mapRef.value?.map ?? null)
const leaflet = computed(() => mapRef.value?.leaflet ?? null)
const layerControl = computed(() => mapRef.value?.layerControl ?? null)

onMounted(async () => {
  try {
    layers.value = await loadMapLayers()
  } catch (error) {
    console.error(error)
    loadError.value =
      'Could not load map layers. Check the API (map/getBaseMaps, map/getLayers).'
  }
})

defineExpose({
  mapRef,
  map: mapInstance,
  leaflet,
  layerControl,
})
</script>

<template>
  <div class="dsp-map">
    <p v-if="loadError" class="dsp-map__error">{{ loadError }}</p>
    <MapaDPG
      v-else-if="layers"
      ref="mapRef"
      :layers="layers"
      :options="props.options"
      :descriptive-memorial="DSP_MAP_MEMORIAL"
      :show-loading="false"
      :disable-loading="true"
    />
  </div>
</template>

<style scoped>
.dsp-map {
  width: 100%;
  height: 520px;
  margin: 0 0 24px;
  border: 1px solid #d9d9d9;
  overflow: hidden;
  position: relative;
}

.dsp-map__error {
  margin: 24px;
  font-size: 14px;
  color: #b9382e;
}

.dsp-map :deep(.map-container) {
  width: 100%;
  height: 100%;
}
</style>
