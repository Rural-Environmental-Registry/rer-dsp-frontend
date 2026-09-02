<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    id?: string
    type?: string
    placeholder?: string
    modelValue?: string
    maxLength?: number
  }>(),
  {
    type: 'text',
    modelValue: '',
    maxLength: 255,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const updateValue = (event: Event) => {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', input.value)
}
</script>

<template>
  <div class="br-input flex w-full flex-col">
    <label v-if="label" class="text-sm text-gray-500" :for="id">{{ label }}</label>
    <div class="relative items-center">
      <input
        :id="props.id"
        :type="props.type"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        :maxlength="props.maxLength"
        class="w-full"
        :style="$slots.icon ? 'padding-left: 35px;' : ''"
        @input="updateValue"
      />
      <span
        v-if="$slots.icon"
        class="absolute inset-y-0 start-0 flex items-center justify-center px-2"
      >
        <slot name="icon" />
      </span>
    </div>
  </div>
</template>
