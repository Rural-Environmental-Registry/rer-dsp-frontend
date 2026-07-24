import { httpGet, httpPost } from '@/services/httpClient'
import type {
  DetailByIdentifierDTO,
  TotalizerDTO,
  TotalizerFilterDTO,
} from '@/types/totalizer'

export async function getTotalizers(
  filter: TotalizerFilterDTO,
): Promise<TotalizerDTO[]> {
  const data = await httpPost<TotalizerDTO[]>(
    'totalizer/getTotalizers',
    filter,
  )
  return data ?? []
}

export async function getDetailsByIdentifier(
  identifier: string,
): Promise<DetailByIdentifierDTO | null> {
  try {
    return await httpGet<DetailByIdentifierDTO>(
      `totalizer/getDeatilsByIdentifier/${encodeURIComponent(identifier)}`,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes('HTTP 404')) {
      return null
    }
    throw error
  }
}
