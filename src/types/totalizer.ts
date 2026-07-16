/** Tipos alinhados ao backend do Consulta Pública (totalizer). */

export interface TotalizerDTO {
  name: string
  code?: string
  value: number
  subItemName?: string
  subItemValue?: number | string
  unitOfMeasurement?: string
}

export interface TotalizerFilterDTO {
  idState: string | null
  idsCities: number[]
}

export interface DetailByIdentifierDTO {
  codeProperty?: string
  latitude?: string
  longitude?: string
  geographicCoordinatesOfCentroid?: string
  idState?: string
  nameState?: string
  nameCity?: string
  fiscalModules?: number
  createdAt?: string
  lastRectification?: string
  haRegisteredArea?: number
  idOrigin?: number
  bounderBox?: string
}
