<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { SelectOption } from '@/config/searchHierarchy'

const props = withDefaults(
  defineProps<{
    label: string
    placeholder?: string
    id?: string
    items: SelectOption[]
    modelValue?: string[]
    disabled?: boolean
  }>(),
  {
    placeholder: 'Select',
    modelValue: () => [],
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const open = ref(false)
const filterText = ref('')
const rootRef = ref<HTMLElement | null>(null)

const selectedValues = computed(() => props.modelValue ?? [])

const selectedItems = computed(() =>
  selectedValues.value
    .map((value) => props.items.find((item) => item.value === value) ?? { value, label: value })
    .filter(Boolean),
)

const filteredItems = computed(() => {
  const query = filterText.value.trim().toLowerCase()
  if (!query) {
    return props.items
  }
  return props.items.filter((item) => item.label.toLowerCase().includes(query))
})

const summaryLabel = computed(() => {
  if (!selectedValues.value.length) {
    return props.placeholder
  }
  if (selectedValues.value.length === 1) {
    return selectedItems.value[0]?.label ?? selectedValues.value[0]
  }
  return `${selectedValues.value.length} selected`
})

function toggleOpen(): void {
  if (props.disabled) {
    return
  }
  open.value = !open.value
  if (open.value) {
    filterText.value = ''
  }
}

function isSelected(value: string): boolean {
  return selectedValues.value.includes(value)
}

function toggleValue(value: string): void {
  if (props.disabled) {
    return
  }
  if (isSelected(value)) {
    emit(
      'update:modelValue',
      selectedValues.value.filter((current) => current !== value),
    )
    return
  }
  emit('update:modelValue', [...selectedValues.value, value])
}

function removeValue(value: string): void {
  if (props.disabled) {
    return
  }
  emit(
    'update:modelValue',
    selectedValues.value.filter((current) => current !== value),
  )
}

function onDocumentClick(event: MouseEvent): void {
  const target = event.target as Node | null
  if (!rootRef.value || !target || rootRef.value.contains(target)) {
    return
  }
  open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <div ref="rootRef" class="flex flex-col w-full">
    <label class="mb-1 text-sm text-gray-500" :for="id">{{ label }}</label>

    <div class="relative">
      <div class="multi-select__trigger" :class="{ 'multi-select__trigger--disabled': disabled }">
        <span v-if="!selectedValues.length" class="multi-select__summary--placeholder">
          {{ placeholder }}
        </span>

        <div v-if="selectedItems.length" class="multi-select__chips">
          <button
            v-for="item in selectedItems"
            :key="item.value"
            type="button"
            class="multi-select__chip"
            :disabled="disabled"
            @click.stop="removeValue(item.value)"
          >
            <span>{{ item.label }}</span>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <button
          :id="id"
          type="button"
          class="multi-select__toggle"
          :disabled="disabled"
          :aria-expanded="open"
          :aria-label="summaryLabel"
          @click="toggleOpen"
        >
          <span class="multi-select__arrow" aria-hidden="true"></span>
        </button>
      </div>

      <div v-if="open" class="multi-select__dropdown">
        <input
          v-model="filterText"
          type="search"
          class="multi-select__filter"
          :placeholder="placeholder"
          :disabled="disabled"
        />
        <ul class="multi-select__list">
          <li v-if="!filteredItems.length" class="multi-select__empty">No options</li>
          <li v-for="item in filteredItems" :key="item.value">
            <label class="multi-select__option">
              <input
                type="checkbox"
                :checked="isSelected(item.value)"
                :disabled="disabled"
                @change="toggleValue(item.value)"
              />
              <span>{{ item.label }}</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.multi-select__trigger {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  min-height: 2.5rem;
  border-radius: 0.25rem;
  border: 1px solid rgb(75 85 99 / 0.8);
  background: #fff;
  padding: 0.3rem 0.4rem 0.3rem 0.6rem;
  text-align: left;
  font-size: 0.875rem;
  outline: none;
}

.multi-select__trigger:focus-within {
  border-color: #42916e;
  box-shadow: 0 0 0 1px #42916e;
}

.multi-select__trigger--disabled {
  cursor: not-allowed;
  background: #f3f4f6;
}

.multi-select__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  margin-left: auto;
  min-width: 2rem;
  min-height: 1.8rem;
  border: 0;
  background: transparent;
  padding: 0 0.25rem;
  text-align: left;
  outline: none;
}

.multi-select__arrow {
  display: block;
  width: 0.45rem;
  height: 0.45rem;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-0.12rem) rotate(45deg);
}

.multi-select__summary--placeholder {
  color: #6b7280;
}

.multi-select__dropdown {
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  border: 1px solid rgb(75 85 99 / 0.8);
  border-radius: 0.25rem;
  background: #fff;
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.08);
  overflow: hidden;
}

.multi-select__filter {
  width: 100%;
  border: 0;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
}

.multi-select__list {
  list-style: none;
  margin: 0;
  padding: 0.25rem 0;
  max-height: 220px;
  overflow: auto;
}

.multi-select__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.multi-select__option:hover {
  background: #f3f4f6;
}

.multi-select__empty {
  padding: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.multi-select__chips {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  gap: 0.4rem;
  min-width: 0;
}

.multi-select__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  background: #fff;
  padding: 0.15rem 0.55rem;
  font-size: 0.75rem;
  color: #374151;
}

.multi-select__chip:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
