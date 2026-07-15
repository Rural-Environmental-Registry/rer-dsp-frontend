/** Tipos alinhados ao backend do Consulta Pública (state / city / region). */

export interface StateDTO {
  id: string
  name: string
  region?: string
  bounderBox?: string
}

export interface CityDTO {
  id: number
  name: string
  bounderBox?: string
}

export interface RegionStateDTO {
  id: string
  name: string
  region?: string
  bounderBox?: string
}

export interface RegionDTO {
  id: number
  name: string
  code?: string
  states?: RegionStateDTO[]
}
