<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const FRAMES = ['...', '..', '.', '.', '..', '...', '..', '.', '.', '..', '...'] as const
const FRAME_INTERVAL_MS = 350

const frame = ref<string>(FRAMES[0])
let timer: ReturnType<typeof setInterval> | undefined
let frameIndex = 0

onMounted(() => {
  timer = setInterval(() => {
    frameIndex = (frameIndex + 1) % FRAMES.length
    frame.value = FRAMES[frameIndex]
  }, FRAME_INTERVAL_MS)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <span class="loading-dots" role="status" aria-label="Loading">{{ frame }}</span>
</template>

<style scoped>
.loading-dots {
  display: inline-block;
  min-width: 1.75em;
  font-weight: 600;
  letter-spacing: 0.05em;
}
</style>
