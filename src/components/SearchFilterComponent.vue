<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHashtag, faLayerGroup, faSearch } from '@fortawesome/free-solid-svg-icons'
import SelectInputComponent from '@/components/SelectInputComponent.vue'
import TextInputComponent from '@/components/TextInputComponent.vue'
import {
  citiesToSelectOptions,
  regionsToSelectOptions,
  statesToSelectOptions,
} from '@/adapters/selectOptionAdapters'
import {
  homeSearchConfig,
  resolveHierarchyFields,
  type HierarchyLevelKey,
  type SearchFormConfig,
  type SelectOption,
} from '@/config/searchHierarchy'
import {
  getCitiesByState,
  getRegionsWithStates,
  getStates,
  getStatesByRegion,
} from '@/services/locationService'
import type { RegionDTO } from '@/types/location'

export interface SearchFilterPayload {
  level1: string
  level2: string
  level3: string
  identifier: string
}

const props = withDefaults(
  defineProps<{
    config?: SearchFormConfig
  }>(),
  {
    config: () => homeSearchConfig,
  },
)

const emit = defineEmits<{
  search: [payload: SearchFilterPayload]
  clear: []
}>()

const form = reactive<SearchFilterPayload>({
  level1: '',
  level2: '',
  level3: '',
  identifier: '',
})

const loadingRoot = ref(false)
const loadingChildren = ref(false)
const loadError = ref('')

const level1Options = ref<SelectOption[]>([])
const level2Options = ref<SelectOption[]>([])
const level3Options = ref<SelectOption[]>([])

/** Cache de regiões (Downloads): estados vêm embutidos. */
const regionsCache = ref<RegionDTO[]>([])

const visibleFields = computed(() => resolveHierarchyFields(props.config.hierarchyKeys))

const optionsByLevel = computed<Record<HierarchyLevelKey, SelectOption[]>>(() => ({
  level1: level1Options.value,
  level2: level2Options.value,
  level3: level3Options.value,
}))

function parentKey(key: HierarchyLevelKey): HierarchyLevelKey | null {
  if (key === 'level1') return null
  if (key === 'level2') return 'level1'
  return 'level2'
}

function isFieldDisabled(key: HierarchyLevelKey): boolean {
  const parent = parentKey(key)
  if (!parent) return false
  if (!props.config.hierarchyKeys.includes(parent)) return false
  return !form[parent]
}

async function loadHomeRootOptions(): Promise<void> {
  // Home: nível 2 = UF (raiz), nível 3 = município
  const states = await getStates()
  level2Options.value = statesToSelectOptions(states)
  level3Options.value = []
}

async function loadDownloadsRootOptions(): Promise<void> {
  // Downloads: nível 1 = região; níveis 2/3 carregam depois
  const regions = await getRegionsWithStates()
  regionsCache.value = regions
  level1Options.value = regionsToSelectOptions(regions)
  level2Options.value = []
  level3Options.value = []
}

async function loadRootOptions(): Promise<void> {
  loadingRoot.value = true
  loadError.value = ''
  try {
    if (props.config.hierarchyKeys.includes('level1')) {
      await loadDownloadsRootOptions()
    } else {
      await loadHomeRootOptions()
    }
  } catch (error) {
    console.error(error)
    loadError.value =
      'Não foi possível carregar as opções. Verifique se a API está no ar (config/env.json).'
    level1Options.value = []
    level2Options.value = []
    level3Options.value = []
  } finally {
    loadingRoot.value = false
  }
}

async function onLevel1Change(regionId: string): Promise<void> {
  form.level2 = ''
  form.level3 = ''
  level3Options.value = []

  if (!regionId) {
    level2Options.value = []
    return
  }

  loadingChildren.value = true
  try {
    const region = regionsCache.value.find((item) => String(item.id) === regionId)
    if (region?.states?.length) {
      level2Options.value = statesToSelectOptions(region.states)
      return
    }

    // Fallback se a API de regiões não trouxer states embutidos
    const states = await getStatesByRegion(regionId)
    level2Options.value = statesToSelectOptions(states)
  } catch (error) {
    console.error(error)
    level2Options.value = []
  } finally {
    loadingChildren.value = false
  }
}

async function onLevel2Change(stateId: string): Promise<void> {
  form.level3 = ''

  if (!stateId) {
    level3Options.value = []
    return
  }

  loadingChildren.value = true
  try {
    const cities = await getCitiesByState(stateId)
    level3Options.value = citiesToSelectOptions(cities)
  } catch (error) {
    console.error(error)
    level3Options.value = []
  } finally {
    loadingChildren.value = false
  }
}

watch(
  () => form.level1,
  (value) => {
    if (props.config.hierarchyKeys.includes('level1')) {
      void onLevel1Change(value)
    }
  },
)

watch(
  () => form.level2,
  (value) => {
    if (props.config.hierarchyKeys.includes('level3')) {
      void onLevel2Change(value)
    }
  },
)

onMounted(() => {
  void loadRootOptions()
})

const canSearch = computed(() => {
  const hasHierarchy = props.config.hierarchyKeys.some((key) => Boolean(form[key]))
  const hasIdentifier = Boolean(props.config.identifier && form.identifier.trim())
  return hasHierarchy || hasIdentifier
})

const handleSearch = () => emit('search', { ...form })

const handleClear = () => {
  form.level1 = ''
  form.level2 = ''
  form.level3 = ''
  form.identifier = ''
  level3Options.value = []
  if (props.config.hierarchyKeys.includes('level1')) {
    level2Options.value = []
  }
  emit('clear')
}
</script>

<template>
  <section class="filter-container">
    <div class="filter-container-margin">
      <span class="title-checkRegistered">{{ config.title }}</span>

      <p v-if="loadingRoot" class="status-msg">Carregando opções...</p>
      <p v-else-if="loadError" class="status-msg status-msg--error">{{ loadError }}</p>
      <p v-else-if="loadingChildren" class="status-msg">Atualizando opções...</p>

      <div class="filter-fields-container">
        <div
          v-for="field in visibleFields"
          :key="field.key"
          class="field-slot"
          :class="`field-slot--${field.key}`"
        >
          <SelectInputComponent
            :id="field.key"
            v-model="form[field.key]"
            :label="field.label"
            :placeholder="field.placeholder"
            :items="optionsByLevel[field.key]"
            :disabled="isFieldDisabled(field.key) || loadingRoot"
          >
          </SelectInputComponent>
        </div>

        <div v-if="config.identifier" class="field-slot field-slot--identifier">
          <TextInputComponent
            :id="config.identifier.key"
            v-model="form.identifier"
            :label="config.identifier.label"
            :placeholder="config.identifier.placeholder"
          >
          </TextInputComponent>
        </div>

        <div class="btns-container">
          <button
            type="button"
            class="br-button primary"
            :disabled="!canSearch || loadingRoot"
            @click="handleSearch"
          >
            <FontAwesomeIcon :icon="faSearch" class="mr-2" />
            Buscar
          </button>
          <button
            v-if="canSearch"
            type="button"
            class="br-button inverted"
            @click="handleClear"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.filter-container {
  width: 100%;
  background: #f2f2f2;
  margin-bottom: 25px;
}

.filter-container-margin {
  margin-inline: min(26px, 3vw);
  padding-top: 16px;
  padding-bottom: 16px;
}

.title-checkRegistered {
  display: block;
  font-size: 20px;
  color: #333;
  font-weight: 400;
}

.status-msg {
  margin: 12px 0 0;
  font-size: 14px;
  color: #707070;
}

.status-msg--error {
  color: #b9382e;
}

.filter-fields-container {
  display: flex;
  flex-direction: row;
  gap: 24px;
  flex-wrap: wrap;
  padding-top: 22px;
  align-items: flex-end;
}

.field-slot--level2 {
  width: 13%;
  min-width: 140px;
  flex: 0 1 160px;
}

.field-slot--level3,
.field-slot--level1 {
  min-width: 220px;
  width: 30%;
  flex: 1 1 240px;
}

.field-slot--identifier {
  width: 25%;
  min-width: 240px;
  flex: 1 1 260px;
}

.btns-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 16px;
  min-width: 200px;
  padding-bottom: 2px;
}

@media screen and (max-width: 950px) {
  .field-slot--level2,
  .field-slot--level3,
  .field-slot--level1,
  .field-slot--identifier {
    width: 100%;
    min-width: 100%;
    flex: 1 1 100%;
  }
}
</style>
