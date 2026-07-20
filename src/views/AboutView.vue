<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  aboutUiConfig,
  getAboutTabById,
  isAboutTabId,
  type AboutTabId,
} from '@/config/aboutUi'
import MoreContents from '@/components/MoreContents.vue'
import { getMoreContentsCards } from '@/config/moreContentsUi'

const pageCards = getMoreContentsCards('about')

const ui = aboutUiConfig
const route = useRoute()
const router = useRouter()

const activeTabId = computed<AboutTabId>(() => {
  const fromQuery = typeof route.query.tab === 'string' ? route.query.tab : null
  return getAboutTabById(fromQuery).id
})

const activeTab = computed(() => getAboutTabById(activeTabId.value))

function selectTab(tabId: AboutTabId): void {
  if (tabId === activeTabId.value) return
  void router.replace({ query: { ...route.query, tab: tabId } })
}

watch(
  () => route.query.tab,
  (tab) => {
    if (typeof tab === 'string' && !isAboutTabId(tab)) {
      void router.replace({ query: { ...route.query, tab: ui.defaultTabId } })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="page">
    <div class="banner-container">
      <div class="banner-content">
        <h1>{{ ui.bannerTitle }}</h1>
      </div>
    </div>

    <div class="main-page">
      <div class="content-general">
        <div class="about-panel" role="region" :aria-label="ui.bannerTitle">
          <div class="tabs" role="tablist" aria-label="About sections">
            <button
              v-for="tab in ui.tabs"
              :key="tab.id"
              type="button"
              role="tab"
              class="tab"
              :class="{ 'tab--active': tab.id === activeTabId }"
              :aria-selected="tab.id === activeTabId"
              :id="`about-tab-${tab.id}`"
              :aria-controls="`about-panel-${tab.id}`"
              @click="selectTab(tab.id)"
            >
              {{ tab.label }}
            </button>
          </div>

          <div
            class="tab-panel"
            role="tabpanel"
            :id="`about-panel-${activeTab.id}`"
            :aria-labelledby="`about-tab-${activeTab.id}`"
          >
            <section
              v-for="(section, index) in activeTab.sections"
              :key="`${activeTab.id}-${index}`"
              class="section"
            >
              <h2 v-if="section.title" class="section-title">{{ section.title }}</h2>

              <p
                v-for="(paragraph, paragraphIndex) in section.paragraphs"
                :key="`p-${paragraphIndex}`"
                class="section-text"
              >
                {{ paragraph }}
              </p>

              <ul v-if="section.bullets?.length" class="section-list">
                <li v-for="(bullet, bulletIndex) in section.bullets" :key="`b-${bulletIndex}`">
                  {{ bullet }}
                </li>
              </ul>

              <p v-if="section.note" class="section-note">{{ section.note }}</p>
            </section>
          </div>
        </div>
      </div>
    </div>

    <MoreContents :cards="pageCards" />
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  background: #f8f8f8;
}

.banner-container {
  padding-top: 10px;
  width: 94%;
  margin-left: 3%;
  display: flex;
  flex-direction: row;
  padding-bottom: 24px;
}

.banner-content {
  background: #fdfaef;
  color: #42916e;
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
  min-height: 140px;
}

.banner-content h1 {
  margin: 0 0 0 50px;
  font-size: 40px;
  font-weight: 100;
  font-style: italic;
}

.main-page {
  width: 100%;
  display: flex;
  justify-content: center;
}

.content-general {
  width: 92%;
  padding-bottom: 48px;
}

.about-panel {
  background: #f2f2f2;
  border-radius: 4px;
  overflow: hidden;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  border-bottom: 1px solid #d9d9d9;
  background: #ebebeb;
}

.tab {
  appearance: none;
  border: none;
  background: transparent;
  color: #555;
  font-size: 15px;
  font-weight: 500;
  padding: 14px 20px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
}

.tab:hover {
  color: #42916e;
  background: #f5f3f3;
}

.tab--active {
  color: #42916e;
  background: #f5f3f3;
  border-bottom-color: #42916e;
}

.tab-panel {
  background: #f5f3f3;
  padding: 28px 30px 32px;
}

.section + .section {
  margin-top: 28px;
}

.section-title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.section-text {
  margin: 0 0 14px;
  font-size: 16px;
  line-height: 1.7;
  color: #333;
  text-align: justify;
}

.section-list {
  margin: 0;
  padding: 4px 0 8px 18px;
  color: #333;
  font-size: 16px;
  line-height: 1.7;
}

.section-list li {
  margin-bottom: 6px;
}

.section-note {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: #707070;
  font-style: italic;
}

@media screen and (max-width: 750px) {
  .banner-content h1 {
    margin-left: 24px;
    font-size: 28px;
  }

  .tab {
    flex: 1 1 auto;
    text-align: center;
    padding: 12px 10px;
    font-size: 14px;
  }

  .tab-panel {
    padding: 20px 16px 24px;
  }
}
</style>
