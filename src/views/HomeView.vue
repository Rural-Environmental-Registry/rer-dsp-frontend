<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SearchFilterComponent, {
  type SearchFilterPayload,
} from '@/components/SearchFilterComponent.vue'
import DetailSearchComponent from '@/components/DetailSearchComponent.vue'
import KpiCardComponent from '@/components/KpiCardComponent.vue'
import {
  buildHierarchyFieldsByKey,
  buildSearchFormConfig,
  hierarchyFieldsByKey,
  homeSearchConfig,
  type HierarchyFieldConfig,
  type HierarchyLevelKey,
  type SearchFormConfig,
} from '@/config/searchHierarchy'
import {
  mockTotalizerValues,
  resolveHomeKpis,
  type KpiItem,
} from '@/config/homeKpis'
import { FALLBACK_INSTALLATION_CONFIG } from '@/config/installationConfigFallback'
import { getInstallationConfig } from '@/services/configService'
import {
  getDetailsByIdentifier,
  getTotalizersByStateOrCity,
} from '@/services/totalizerService'
import type { HomeKpisConfig } from '@/types/installationConfig'
import type { DetailByIdentifierDTO } from '@/types/totalizer'
import MoreContents from '@/components/MoreContents.vue'
import { getMoreContentsCards } from '@/config/moreContentsUi'

const pageCards = getMoreContentsCards('home')

const searching = ref(false)
const searchError = ref('')
const detailByIdentifier = ref<DetailByIdentifierDTO | null>(null)
const kpiConfig = ref<HomeKpisConfig>(FALLBACK_INSTALLATION_CONFIG.kpis)
const kpis = ref<KpiItem[]>(resolveHomeKpis(mockTotalizerValues, kpiConfig.value))
const searchConfig = ref<SearchFormConfig>(homeSearchConfig)
const hierarchyFields = ref<Record<HierarchyLevelKey, HierarchyFieldConfig>>(hierarchyFieldsByKey)

async function loadTotalizers(stateId: string | null, cityIds: number[]): Promise<void> {
  const totalizers = await getTotalizersByStateOrCity({
    idState: stateId,
    idsCities: cityIds,
  })
  kpis.value = resolveHomeKpis(totalizers, kpiConfig.value)
}

async function loadInitialKpis(): Promise<void> {
  try {
    await loadTotalizers(null, [])
  } catch (error) {
    console.warn('Initial KPIs from API unavailable — keeping mock values.', error)
    kpis.value = resolveHomeKpis(mockTotalizerValues, kpiConfig.value)
  }
}

const onSearch = async (payload: SearchFilterPayload) => {
  searching.value = true
  searchError.value = ''
  detailByIdentifier.value = null

  try {
    const identifier = payload.identifier.trim()

    if (identifier) {
      const detail = await getDetailsByIdentifier(identifier)
      if (!detail) {
        searchError.value = 'Identifier not found.'
        return
      }
      detailByIdentifier.value = detail
      return
    }

    if (!payload.level2) {
      searchError.value = 'Select at least level 2 to search.'
      return
    }

    const cityIds = payload.level3 ? [Number(payload.level3)] : []
    await loadTotalizers(payload.level2, cityIds)
  } catch (error) {
    console.error(error)
    searchError.value = 'Search failed. Check the API (config/env.json).'
  } finally {
    searching.value = false
  }
}

const onClear = () => {
  searchError.value = ''
  detailByIdentifier.value = null
  void loadInitialKpis()
}

async function loadInstallationConfig(): Promise<void> {
  const installation = await getInstallationConfig()
  searchConfig.value = buildSearchFormConfig(installation, 'home')
  hierarchyFields.value = buildHierarchyFieldsByKey(installation)
  kpiConfig.value = installation.kpis
}

onMounted(async () => {
  await loadInstallationConfig()
  await loadInitialKpis()
})
</script>

<template>
  <div class="main-container">
    <div class="banner-container">
      <div class="banner-content">
        <h1>
          <strong class="project-name"> Data Sharing Platform (DSP)</strong>
        </h1>
        <h2>Public geospatial consultation portal</h2>
      </div>
    </div>

    <div class="main-page-container">
      <div class="content-general">
        <SearchFilterComponent
          :config="searchConfig"
          :hierarchy-fields="hierarchyFields"
          @search="onSearch"
          @clear="onClear"
        />

        <p v-if="searching" class="status-msg">Searching...</p>
        <p v-else-if="searchError" class="status-msg status-msg--error">{{ searchError }}</p>

        <DetailSearchComponent
          v-if="detailByIdentifier"
          :detail="detailByIdentifier"
        />

        <section v-else-if="kpis.length" class="data-cards-section">
          <div class="data-cards">
            <div v-for="kpi in kpis" :key="kpi.id" class="data-card-container">
              <KpiCardComponent
                class="data-card"
                :title="kpi.title"
                :value="kpi.value"
                :unit-of-measurement="kpi.unitOfMeasurement"
                :optional-label="kpi.optionalLabel"
                :optional-value="kpi.optionalValue"
                :accent-color="kpi.accentColor"
              />
            </div>
          </div>
        </section>
      </div>
    </div>

    <MoreContents :cards="pageCards" />
  </div>
</template>

<style scoped>
.main-container {
  width: 100%;
  background: #fff;
}

.banner-container {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  padding-bottom: 24px;
}

.banner-content {
  height: 220px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right center;
  background-color: #f9f2d2;
  color: #42916e;
  display: flex;
  flex-grow: 2;
  flex-direction: column;
  justify-content: center;
  padding: 70px;
  gap: 10px;
}

.banner-content h1 {
  margin: 0;
  font-size: 40px;
  font-weight: 200;
}

.project-name {
  font-size: clamp(32px, 5vw, 60px);
  font-weight: 600;
}

.banner-content h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 100;
}

.main-page-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.content-general {
  width: 92%;
}

.status-msg {
  margin: 0 0 16px;
  font-size: 14px;
  color: #707070;
}

.status-msg--error {
  color: #b9382e;
}

.data-cards-section {
  margin-bottom: 32px;
  width: 100%;
}

.data-cards {
  --kpi-gap: 16px;
  --kpi-max-slots: 5;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  gap: var(--kpi-gap);
  width: 100%;
  margin-bottom: 26px;
}

.data-card-container {
  flex: 0 0
    calc(
      (100% - (var(--kpi-max-slots) - 1) * var(--kpi-gap)) / var(--kpi-max-slots)
    );
  width: calc(
    (100% - (var(--kpi-max-slots) - 1) * var(--kpi-gap)) / var(--kpi-max-slots)
  );
  min-width: 0;
  padding: 8px 0;
  box-sizing: border-box;
}

.data-card {
  width: 100%;
}

@media screen and (max-width: 950px) {
  .banner-container {
    flex-direction: column;
  }

  .banner-content {
    width: 100%;
    background-size: cover;
  }

  .data-cards {
    flex-direction: column;
    flex-wrap: wrap;
  }

  .data-card-container {
    flex: 1 1 auto;
    width: 100%;
  }
}
</style>
