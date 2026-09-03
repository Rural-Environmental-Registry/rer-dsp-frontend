<script setup lang="ts">
import MoreContentsCard from '@/components/MoreContentsCard.vue'
import { moreContentsUiConfig, type MoreContentsCardItem } from '@/config/moreContentsUi'

defineProps<{
  cards: MoreContentsCardItem[]
}>()

const ui = moreContentsUiConfig
</script>

<template>
  <div class="more-contents-container">
    <h6 class="more-contents-title">{{ ui.title }}</h6>
    <p>{{ ui.subtitle }}</p>
    <div class="more-contents-cards-container">
      <MoreContentsCard
        v-for="(card, index) in cards"
        :key="`${card.namePage}-${index}`"
        :description="card.description"
        :name-page="card.namePage"
        :router-to="card.routerTo"
        :open-external-link="card.externalLink"
      />
    </div>
  </div>
</template>

<style scoped>
.more-contents-container {
  background: rgba(191, 235, 220, 0.27);
  margin-top: 20px;
  margin-bottom: 40px;
  width: 100%;
  box-sizing: border-box;
  min-height: 170px;
  padding: 0 5% 20px;
  text-decoration: none !important;
}

.more-contents-container h6 {
  padding: 52px 0 12px;
  font-size: 20px;
  color: #42916e;
  font-weight: 600;
  text-transform: uppercase;
}

.more-contents-container p {
  font-size: 17px;
  color: #000000;
}

.more-contents-cards-container {
  display: flex;
  flex-direction: row;
  padding-top: 32px;
  margin-bottom: 32px;
  gap: 40px;
}

@media screen and (max-width: 984px) {
  .more-contents-cards-container {
    flex-direction: column;
  }
}
</style>
