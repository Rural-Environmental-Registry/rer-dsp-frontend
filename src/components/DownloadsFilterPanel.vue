<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import HierarchyChipButton from '@/components/HierarchyChipButton.vue'
import SelectInputComponent from '@/components/SelectInputComponent.vue'
import {
  MAX_DOWNLOAD_LEVEL1,
  resolveDownloadsUiConfig,
  type DownloadsUiConfig,
} from '@/config/downloadsUi'
import type { SelectOption } from '@/config/searchHierarchy'
import { getInstallationConfig } from '@/services/configService'
import { getTerritoryOptions } from '@/services/territoryService'
import { territoryOptionsToSelectOptions } from '@/adapters/selectOptionAdapters'
import type { TerritoryOption } from '@/types/territory'

export interface DownloadsFilterPayload {
  level1: string
  level2: string
  level3: string
  theme: string
}

const props = withDefaults(
  defineProps<{
    themeOptions?: SelectOption[]
  }>(),
  {
    themeOptions: () => [],
  },
)

const emit = defineEmits<{
  search: [payload: DownloadsFilterPayload]
  clear: []
  'selection-change': [payload: DownloadsFilterPayload]
}>()

const ui = ref<DownloadsUiConfig>(resolveDownloadsUiConfig())

const loadingRoot = ref(false)
const loadingChildren = ref(false)
const loadError = ref('')

const level1Options = ref<TerritoryOption[]>([])
const level2Options = ref<TerritoryOption[]>([])
const level3Options = ref<SelectOption[]>([])

const selectedLevel1Index = ref<number | null>(null)
const selectedLevel2Index = ref<number | null>(null)

const level1Id = ref('')
const level2Id = ref('')
const level3Id = ref('')
const themeId = ref('')

const hasLevel1 = computed(() => Boolean(level1Id.value))
const hasLevel2 = computed(() => Boolean(level2Id.value))

const canClearFilters = computed(
  () => Boolean(level3Id.value) || Boolean(themeId.value),
)

function currentPayload(): DownloadsFilterPayload {
  return {
    level1: level1Id.value,
    level2: level2Id.value,
    level3: level3Id.value,
    theme: themeId.value,
  }
}

function emitSelection(): void {
  emit('selection-change', currentPayload())
}

onMounted(() => {
  void bootstrap()
})

async function bootstrap(): Promise<void> {
  const installation = await getInstallationConfig()
  ui.value = resolveDownloadsUiConfig(installation)
  await loadLevel1()
}

async function loadLevel1(): Promise<void> {
  loadingRoot.value = true
  loadError.value = ''
  try {
    const data = await getTerritoryOptions('level1')
    level1Options.value = data.slice(0, MAX_DOWNLOAD_LEVEL1)
  } catch (error) {
    console.error(error)
    loadError.value = 'Could not load level 1. Check if the API is running.'
    level1Options.value = []
  } finally {
    loadingRoot.value = false
  }
}

async function selectLevel1(option: TerritoryOption, index: number): Promise<void> {
  selectedLevel1Index.value = index
  level1Id.value = option.id
  selectedLevel2Index.value = null
  level2Id.value = ''
  level3Id.value = ''
  themeId.value = ''
  level3Options.value = []

  loadingChildren.value = true
  try {
    level2Options.value = await getTerritoryOptions('level2', option.id)
  } catch (error) {
    console.error(error)
    level2Options.value = []
  } finally {
    loadingChildren.value = false
    emitSelection()
  }
}

async function selectLevel2(option: TerritoryOption, index: number): Promise<void> {
  selectedLevel2Index.value = index
  level2Id.value = option.id
  level3Id.value = ''
  themeId.value = ''

  loadingChildren.value = true
  try {
    const cities = await getTerritoryOptions('level3', option.id)
    level3Options.value = territoryOptionsToSelectOptions(cities)
  } catch (error) {
    console.error(error)
    level3Options.value = []
  } finally {
    loadingChildren.value = false
  }

  emitSelection()
  emit('search', currentPayload())
}

function handleSearch(): void {
  if (!level2Id.value) return
  emit('search', currentPayload())
}

function handleClearFilters(): void {
  level3Id.value = ''
  themeId.value = ''
  emit('clear')
  emit('search', currentPayload())
}

watch(level3Id, () => emitSelection())
watch(themeId, () => emitSelection())
</script>

<template>
  <section class="filter-panel">
    <div class="filter-panel__inner">
      <p v-if="loadingRoot" class="status-msg">Loading options...</p>
      <p v-else-if="loadError" class="status-msg status-msg--error">{{ loadError }}</p>

      <div v-else class="filter-fields">
        <div class="level1-block">
          <p class="block-title">{{ ui.level1Title }}</p>
          <div class="chips-row">
            <HierarchyChipButton
              v-for="(option, index) in level1Options"
              :key="option.id"
              :label="option.name"
              :active="selectedLevel1Index === index"
              @click="selectLevel1(option, index)"
            />
          </div>
        </div>

        <div v-if="hasLevel1" class="level2-block">
          <p class="block-title">{{ ui.level2Title }}</p>
          <p v-if="loadingChildren && !hasLevel2" class="status-msg">Updating options...</p>
          <div v-else class="chips-row">
            <HierarchyChipButton
              v-for="(option, index) in level2Options"
              :key="option.id"
              :label="option.name"
              :active="selectedLevel2Index === index"
              @click="selectLevel2(option, index)"
            />
          </div>

          <div v-if="hasLevel2" class="filters-block">
            <h3 class="filter-by">{{ ui.filterByTitle }}</h3>
            <div class="filters-row">
              <div class="filter-field">
                <SelectInputComponent
                  id="download-level3"
                  v-model="level3Id"
                  :label="ui.level3Label"
                  :placeholder="ui.level3Placeholder"
                  :items="level3Options"
                  :disabled="loadingChildren"
                />
              </div>
              <div class="filter-field filter-field--theme">
                <SelectInputComponent
                  id="download-theme"
                  v-model="themeId"
                  :label="ui.themeLabel"
                  :placeholder="ui.themePlaceholder"
                  :items="themeOptions"
                />
              </div>
              <div class="filter-actions">
                <button type="button" class="br-button primary" @click="handleSearch">
                  <FontAwesomeIcon :icon="faSearch" class="mr-2" />
                  {{ ui.searchButton }}
                </button>
                <button
                  v-if="canClearFilters"
                  type="button"
                  class="br-button inverted"
                  @click="handleClearFilters"
                >
                  {{ ui.clearButton }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.filter-panel {
  width: 100%;
  background: #f2f2f2;
  margin-bottom: 25px;
  padding-bottom: 8px;
}

.filter-panel__inner {
  padding: 16px 15px 10px;
}

.filter-fields {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-top: 6px;
  background: #f5f3f3;
  padding: 16px 15px 18px;
  border-radius: 4px;
}

.block-title {
  margin: 0 0 12px;
  font-size: 18px;
  color: #0a0a0a;
}

.chips-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0;
}

.level2-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-by {
  margin: 14px 0 20px;
  font-size: 20px;
  font-weight: 400;
  color: #0a0a0a;
  font-weight: bold;
}

.filters-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 25px;
}

.filter-field {
  min-width: 220px;
  width: 260px;
  flex: 0 1 260px;
}

.filter-field--theme {
  min-width: 280px;
  width: 320px;
  flex: 1 1 320px;
  max-width: 462px;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 40px;
  padding-bottom: 2px;
}

.status-msg {
  margin: 0;
  font-size: 14px;
  color: #707070;
}

.status-msg--error {
  color: #b9382e;
}

@media screen and (max-width: 984px) {
  .chips-row {
    justify-content: center;
  }

  .filter-field,
  .filter-field--theme {
    width: 100%;
    max-width: none;
    flex: 1 1 100%;
  }
}
</style>
