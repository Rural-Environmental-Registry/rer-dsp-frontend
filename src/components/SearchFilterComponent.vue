<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import SelectInputComponent from '@/components/SelectInputComponent.vue'
import TextInputComponent from '@/components/TextInputComponent.vue'
import { territoryOptionsToSelectOptions } from '@/adapters/selectOptionAdapters'
import {
  hierarchyFieldsByKey,
  homeSearchConfig,
  resolveHierarchyFields,
  type HierarchyFieldConfig,
  type HierarchyLevelKey,
  type SearchFormConfig,
  type SelectOption,
} from '@/config/searchHierarchy'
import { getTerritoryOptions } from '@/services/territoryService'

export interface SearchFilterPayload {
  level1: string
  level2: string
  level3: string
  identifier: string
  theme: string
}

const props = withDefaults(
  defineProps<{
    config?: SearchFormConfig
    hierarchyFields?: Record<HierarchyLevelKey, HierarchyFieldConfig>
    themeOptions?: SelectOption[]
  }>(),
  {
    config: () => homeSearchConfig,
    hierarchyFields: () => hierarchyFieldsByKey,
    themeOptions: () => [],
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
  theme: '',
})

const loadingRoot = ref(false)
const loadingChildren = ref(false)
const loadError = ref('')

const level1Options = ref<SelectOption[]>([])
const level2Options = ref<SelectOption[]>([])
const level3Options = ref<SelectOption[]>([])

const visibleFields = computed(() =>
  resolveHierarchyFields(props.config.hierarchyKeys, props.hierarchyFields),
)

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

function nextKey(key: HierarchyLevelKey): HierarchyLevelKey | null {
  if (key === 'level1') return 'level2'
  if (key === 'level2') return 'level3'
  return null
}

function setOptionsForLevel(level: HierarchyLevelKey, options: SelectOption[]): void {
  if (level === 'level1') level1Options.value = options
  else if (level === 'level2') level2Options.value = options
  else level3Options.value = options
}

function clearDescendantOptions(level: HierarchyLevelKey): void {
  if (level === 'level1') {
    level2Options.value = []
    level3Options.value = []
    return
  }
  if (level === 'level2') {
    level3Options.value = []
  }
}

function isFieldDisabled(key: HierarchyLevelKey): boolean {
  const parent = parentKey(key)
  if (!parent) return false
  if (!props.config.hierarchyKeys.includes(parent)) return false
  return !form[parent]
}

async function loadRootOptions(): Promise<void> {
  loadingRoot.value = true
  loadError.value = ''
  try {
    const rootLevel = props.config.hierarchyKeys[0]
    if (!rootLevel) {
      return
    }

    const options = await getTerritoryOptions(rootLevel)
    setOptionsForLevel(rootLevel, territoryOptionsToSelectOptions(options))

    for (const key of props.config.hierarchyKeys.slice(1)) {
      setOptionsForLevel(key, [])
    }
  } catch (error) {
    console.error(error)
    loadError.value =
      'Could not load options. Check if the API is running (config/env.json).'
    level1Options.value = []
    level2Options.value = []
    level3Options.value = []
  } finally {
    loadingRoot.value = false
  }
}

async function loadChildOptions(parentLevel: HierarchyLevelKey, parentId: string): Promise<void> {
  const childLevel = nextKey(parentLevel)
  if (!childLevel || !props.config.hierarchyKeys.includes(childLevel)) {
    return
  }

  if (!parentId) {
    setOptionsForLevel(childLevel, [])
    clearDescendantOptions(childLevel)
    return
  }

  loadingChildren.value = true
  try {
    const options = await getTerritoryOptions(childLevel, parentId)
    setOptionsForLevel(childLevel, territoryOptionsToSelectOptions(options))
    clearDescendantOptions(childLevel)
  } catch (error) {
    console.error(error)
    setOptionsForLevel(childLevel, [])
  } finally {
    loadingChildren.value = false
  }
}

watch(
  () => form.level1,
  (value) => {
    if (props.config.hierarchyKeys.includes('level1')) {
      form.level2 = ''
      form.level3 = ''
      void loadChildOptions('level1', value)
    }
  },
)

watch(
  () => form.level2,
  (value) => {
    if (props.config.hierarchyKeys.includes('level3')) {
      form.level3 = ''
      void loadChildOptions('level2', value)
    }
  },
)

watch(
  () => props.config.hierarchyKeys.join(','),
  () => {
    void loadRootOptions()
  },
)

onMounted(() => {
  void loadRootOptions()
})

const canSearch = computed(() => {
  if (props.config.hierarchyKeys.includes('level1')) {
    return Boolean(form.level2)
  }
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
  form.theme = ''
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

      <p v-if="loadingRoot" class="status-msg">Loading options...</p>
      <p v-else-if="loadError" class="status-msg status-msg--error">{{ loadError }}</p>
      <p v-else-if="loadingChildren" class="status-msg">Updating options...</p>

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

        <div v-if="config.theme" class="field-slot field-slot--theme">
          <SelectInputComponent
            :id="config.theme.key"
            v-model="form.theme"
            :label="config.theme.label"
            :placeholder="config.theme.placeholder"
            :items="themeOptions"
            :disabled="loadingRoot"
          />
        </div>

        <div class="btns-container">
          <button
            type="button"
            class="br-button primary"
            :disabled="!canSearch || loadingRoot"
            @click="handleSearch"
          >
            <FontAwesomeIcon :icon="faSearch" class="mr-2" />
            Search
          </button>
          <button
            v-if="canSearch"
            type="button"
            class="br-button inverted"
            @click="handleClear"
          >
            Clear
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

.field-slot--identifier,
.field-slot--theme {
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
  .field-slot--identifier,
  .field-slot--theme {
    width: 100%;
    min-width: 100%;
    flex: 1 1 100%;
  }
}
</style>
