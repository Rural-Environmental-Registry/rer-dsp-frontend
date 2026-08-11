<script setup lang="ts">
import { computed } from 'vue'
import type { SelectOption } from '@/config/searchHierarchy'

const props = withDefaults(
  defineProps<{
    label: string
    placeholder?: string
    id?: string
    items: SelectOption[]
    modelValue?: string
    disabled?: boolean
    allowEmptySelection?: boolean
  }>(),
  {
    placeholder: 'Select',
    modelValue: '',
    disabled: false,
    allowEmptySelection: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="flex flex-col w-full">
    <label class="mb-1 text-sm text-gray-500" :for="id">{{ label }}</label>
    <div class="relative">
      <span
        v-if="$slots.icon"
        class="pointer-events-none absolute inset-y-0 start-0 flex items-center px-2 text-gray-500"
      >
        <slot name="icon" />
      </span>
      <select
        :id="id"
        v-model="selectedValue"
        :disabled="disabled"
        class="h-10 w-full rounded border border-gray-600/80 bg-white px-3 text-sm outline-none focus:border-[#42916e] focus:ring-1 focus:ring-[#42916e] disabled:cursor-not-allowed disabled:bg-gray-100"
        :class="{ 'pl-9': $slots.icon }"
      >
        <option :disabled="!allowEmptySelection" value="">{{ placeholder }}</option>
        <option v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </option>
      </select>
    </div>
  </div>
</template>
