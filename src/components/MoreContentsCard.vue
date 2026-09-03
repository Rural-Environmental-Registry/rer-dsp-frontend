<script setup lang="ts">
defineProps<{
  description: string
  namePage: string
  routerTo?: string
  openExternalLink?: string
}>()

function openExternalUrl(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="more-contents-card-container">
    <label>{{ description }}</label>
    <div class="title">
      <RouterLink v-if="!openExternalLink && routerTo" class="custom-link" :to="routerTo">
        <strong>{{ namePage }}</strong>
      </RouterLink>
      <strong
        v-else-if="openExternalLink"
        class="external-link"
        role="link"
        tabindex="0"
        @click="openExternalUrl(openExternalLink)"
        @keydown.enter.prevent="openExternalUrl(openExternalLink)"
      >
        {{ namePage }}
      </strong>
      <strong v-else>{{ namePage }}</strong>
    </div>
  </div>
</template>

<style scoped>
.custom-link {
  text-decoration: none !important;
  color: inherit;
}

.custom-link:hover,
.custom-link:focus {
  text-decoration: none !important;
}

.external-link {
  cursor: pointer;
}

.more-contents-card-container {
  display: flex;
  flex-direction: column;
  width: 25%;
  gap: 15px;
  cursor: pointer;
  background: #fff;
  padding: 0 22px;
  padding-top: 16px;
  padding-bottom: 20px;
  justify-content: center;
  box-shadow: 0px 1px 6px #00000029;
  border-radius: 8px;
}

.more-contents-card-container label {
  width: 100%;
  margin-top: 12px;
  color: #555555;
  font-size: 16px;
}

.more-contents-card-container .title {
  color: #0c326f;
  font-size: 25px;
  padding: 12px 0px 16px;
  text-decoration: none;
}

@media (max-width: 984px) {
  .more-contents-card-container {
    width: 88%;
  }
}
</style>
