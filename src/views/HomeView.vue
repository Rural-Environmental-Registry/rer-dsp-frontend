<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SearchFilterComponent, {
  type SearchFilterPayload,
} from '@/components/SearchFilterComponent.vue'
import KpiCardComponent from '@/components/KpiCardComponent.vue'
import { homeSearchConfig } from '@/config/searchHierarchy'
import { mockHomeKpis, resolveHomeKpis, type KpiItem } from '@/config/homeKpis'
import { totalizersToKpis } from '@/adapters/selectOptionAdapters'
import {
  getDetailsByIdentifier,
  getTotalizersByStateOrCity,
} from '@/services/totalizerService'
import type { DetailByIdentifierDTO } from '@/types/totalizer'

const searching = ref(false)
const searchError = ref('')
const detailByIdentifier = ref<DetailByIdentifierDTO | null>(null)
const kpis = ref<KpiItem[]>(resolveHomeKpis(mockHomeKpis))

async function loadTotalizers(stateId: string | null, cityIds: number[]): Promise<void> {
  const totalizers = await getTotalizersByStateOrCity({
    idState: stateId,
    idsCities: cityIds,
  })
  kpis.value = resolveHomeKpis(totalizersToKpis(totalizers))
}

async function loadInitialKpis(): Promise<void> {
  try {
    await loadTotalizers(null, [])
  } catch (error) {
    console.warn('KPIs iniciais via API indisponíveis — mantendo mock.', error)
    kpis.value = resolveHomeKpis(mockHomeKpis)
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
        searchError.value = 'Identificador não encontrado.'
        return
      }
      detailByIdentifier.value = detail
      return
    }

    if (!payload.level2) {
      searchError.value = 'Selecione ao menos uma UF para buscar.'
      return
    }

    const cityIds = payload.level3 ? [Number(payload.level3)] : []
    await loadTotalizers(payload.level2, cityIds)
  } catch (error) {
    console.error(error)
    searchError.value = 'Falha na busca. Verifique a API (config/env.json).'
  } finally {
    searching.value = false
  }
}

const onClear = () => {
  searchError.value = ''
  detailByIdentifier.value = null
  void loadInitialKpis()
}

onMounted(() => {
  void loadInitialKpis()
})
</script>

<template>
  <div class="main-container">
    <div class="banner-container">
      <div class="banner-content">
        <h1>
          <strong class="project-name"> Data Sharing Platform (DSP)</strong>
        </h1>
        <h2>Portal público de consulta geoespacial</h2>
      </div>
    </div>

    <div class="main-page-container">
      <div class="content-general">
        <SearchFilterComponent
          :config="homeSearchConfig"
          @search="onSearch"
          @clear="onClear"
        />

        <p v-if="searching" class="status-msg">Buscando...</p>
        <p v-else-if="searchError" class="status-msg status-msg--error">{{ searchError }}</p>

        <section v-if="detailByIdentifier" class="detail-box">
          <h2>Detalhe do identificador</h2>
          <ul>
            <li v-if="detailByIdentifier.codeProperty">
              Código: {{ detailByIdentifier.codeProperty }}
            </li>
            <li v-if="detailByIdentifier.nameState">
              UF: {{ detailByIdentifier.nameState }}
            </li>
            <li v-if="detailByIdentifier.nameCity">
              Município: {{ detailByIdentifier.nameCity }}
            </li>
            <li v-if="detailByIdentifier.haRegisteredArea != null">
              Área: {{ detailByIdentifier.haRegisteredArea }} ha
            </li>
          </ul>
        </section>

        <section v-else-if="kpis.length" class="data-cards-section">
          <div class="data-cards">
            <div v-for="kpi in kpis" :key="kpi.id" class="data-card-container">
              <KpiCardComponent
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

.detail-box {
  margin-bottom: 24px;
  padding: 16px 20px;
  border: 1px solid #70707045;
  border-radius: 4px;
}

.detail-box h2 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #42916e;
  font-weight: 600;
}

.detail-box ul {
  margin: 0;
  padding-left: 18px;
  color: #333;
}

.data-cards-section {
  margin-bottom: 32px;
}

.data-cards {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 26px;
}

.data-card-container {
  flex: 1 1 160px;
  max-width: 280px;
  padding: 8px 0;
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
  }

  .data-card-container {
    max-width: 100%;
    width: 100%;
  }
}
</style>
