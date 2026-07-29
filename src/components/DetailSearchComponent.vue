<script setup lang="ts">
import { computed } from 'vue'
import type { DetailByIdentifierDTO } from '@/types/totalizer'
import {
  buildDetailByIdentifierConfig,
  getDetailFieldsByGroup,
  getPropertyFieldRows,
  readDetailFieldValue,
  type DetailFieldConfig,
} from '@/config/detailByIdentifier'
import { peekInstallationConfig } from '@/services/configService'
import { formatDate } from '@/utils/dateFormat'
import { formatPropertyMeasures } from '@/utils/format'

const props = defineProps<{
  detail: DetailByIdentifierDTO
}>()

const emit = defineEmits<{
  'select-aoi': [id: string]
}>()

const installation = peekInstallationConfig()
const config = buildDetailByIdentifierConfig(installation)
const datePattern = installation.formats.date
const headerFields = computed(() => getDetailFieldsByGroup('header', config))
const propertyRows = computed(() => getPropertyFieldRows(config))
const otherIds = computed(() =>
  (props.detail.otherIds ?? []).filter((id) => id && id !== props.detail.id),
)

function readFieldValue(field: DetailFieldConfig): string {
  const raw = readDetailFieldValue(props.detail, field.key)
  if (raw === undefined || raw === null || raw === '') {
    return config.emptyValue
  }

  if (field.formatAsDate) {
    return formatDate(String(raw), datePattern)
  }

  if (field.formatAsMeasure) {
    const formatted = formatPropertyMeasures(raw)
    return field.unitSuffix ? `${formatted} ${field.unitSuffix}` : formatted
  }

  return String(raw)
}

function onSelectOther(id: string): void {
  emit('select-aoi', id)
}
</script>

<template>
  <section
    class="details-panel dsp-aoi-details-panel"
    :aria-label="config.sectionTitle"
  >
    <h2 class="section-title">{{ config.sectionTitle }}</h2>

    <div class="details-card">
      <div class="header-detail">
        <div
          v-for="field in headerFields"
          :key="field.key"
          class="field"
          :class="{ 'field--wide': field.key === 'id' }"
        >
          <p>{{ field.label }}</p>
          <strong>{{ readFieldValue(field) }}</strong>
        </div>
      </div>

      <hr class="divider" />

      <h3 class="property-title">{{ config.propertySectionTitle }}</h3>

      <div class="property-rows">
        <div
          v-for="(row, rowIndex) in propertyRows"
          :key="rowIndex"
          class="property-row"
        >
          <div
            v-for="field in row"
            :key="field.key"
            class="field"
          >
            <p>{{ field.label }}</p>
            <strong>{{ readFieldValue(field) }}</strong>
          </div>
        </div>
      </div>

      <div v-if="otherIds.length" class="other-aois">
        <p class="other-aois__label">Outros próximos</p>
        <div class="other-aois__list">
          <button
            v-for="id in otherIds"
            :key="id"
            type="button"
            class="other-aois__btn"
            @click="onSelectOther(id)"
          >
            {{ id }}
          </button>
        </div>
      </div>

      <div class="actions">
        <button
          type="button"
          class="br-button secondary"
          :disabled="!config.featuresDownload.enabled"
          :title="
            config.featuresDownload.enabled
              ? config.featuresDownload.label
              : 'Coming soon'
          "
        >
          {{ config.featuresDownload.label }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.details-panel {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 12px;
  font-size: 20px;
  color: #42916e;
  font-weight: 600;
  text-transform: uppercase;
}

.details-card {
  border: 1px solid #70707045;
  border-radius: 8px;
  padding: 20px 24px 24px;
  background: #fff;
}

.header-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 40px;
}

.header-detail .field--wide {
  flex: 1 1 280px;
  min-width: 200px;
}

.property-title {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 400;
  color: #707070;
}

.property-rows {
  margin-bottom: 28px;
}

.property-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 32px;
  margin-bottom: 30px;
}

.property-row:last-child {
  margin-bottom: 0;
}

.property-row .field {
  flex: 0 1 180px;
  min-width: 140px;
}

.field p {
  margin: 0 0 7px;
  color: #707070;
  font-size: 15px;
}

.field strong {
  color: #707070;
  font-size: 17px;
  font-weight: 600;
}

.divider {
  border: none;
  border-top: 1px solid #e5e5e5;
  margin: 20px 0;
}

.other-aois {
  margin: 0 0 24px;
}

.other-aois__label {
  margin: 0 0 10px;
  color: #707070;
  font-size: 15px;
}

.other-aois__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.other-aois__btn {
  background: #fff;
  border: 1px solid #1351b4;
  color: #1351b4;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.other-aois__btn:hover {
  background: #e8f0fe;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.actions .br-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media screen and (max-width: 900px) {
  .details-card {
    padding: 16px;
  }

  .property-row {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
  }

  .property-row .field {
    flex: 1 1 auto;
    min-width: 0;
  }

  .actions .br-button {
    width: 100%;
  }
}
</style>
