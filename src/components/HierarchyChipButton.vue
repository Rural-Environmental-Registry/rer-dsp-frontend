<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    active?: boolean
  }>(),
  {
    active: false,
  },
)

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="chip-btn"
    :class="{ 'chip-btn--active': active }"
    @click="$emit('click')"
  >
    <span class="chip-btn__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.chip-btn {
  width: 155px;
  min-height: 40px;
  max-height: 40px;
  margin: 0 10px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #707070;
  background: #fff;
  color: #42916e;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.4s ease, color 0.4s ease;
}

.chip-btn:hover,
.chip-btn--active {
  background: #42916e;
  color: #fff;
}

.chip-btn__label {
  font-size: 14px;
  line-height: 1.2;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>
