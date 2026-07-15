import type { SelectOption } from '@/config/searchHierarchy'
import type { CityDTO, RegionDTO, StateDTO } from '@/types/location'
import type { TotalizerDTO } from '@/types/totalizer'
import type { KpiItem } from '@/config/homeKpis'
import { DEFAULT_KPI_COLORS, MAX_HOME_KPIS } from '@/config/homeKpis'

export function statesToSelectOptions(states: StateDTO[]): SelectOption[] {
  return states.map((state) => ({
    value: state.id,
    label: `${state.id} - ${state.name}`,
  }))
}

export function citiesToSelectOptions(cities: CityDTO[]): SelectOption[] {
  return cities.map((city) => ({
    value: String(city.id),
    label: city.name,
  }))
}

export function regionsToSelectOptions(regions: RegionDTO[]): SelectOption[] {
  return regions.map((region) => ({
    value: String(region.id),
    label: region.name,
  }))
}

/** Converte totalizers da API em KPIs da home (máx. 5). */
export function totalizersToKpis(totalizers: TotalizerDTO[]): KpiItem[] {
  return totalizers.slice(0, MAX_HOME_KPIS).map((item, index) => {
    const optionalValue =
      item.subItemValue === 0 || item.subItemValue === '' || item.subItemValue == null
        ? undefined
        : Number(item.subItemValue)

    return {
      id: item.code || `kpi-${index + 1}`,
      title: item.name,
      value: Number(item.value ?? 0),
      unitOfMeasurement: item.unitOfMeasurement,
      optionalLabel: optionalValue === undefined ? undefined : item.subItemName || undefined,
      optionalValue,
      accentColor: DEFAULT_KPI_COLORS[index % DEFAULT_KPI_COLORS.length],
    }
  })
}
