import { getJson } from '../extensions/fetch'
import { getLPUsEndpoint, GORZDRAV_API } from './endpoints'
import { DistrictsResponse, LPUsResponse } from './models'

export const fetchDistricts = async (): Promise<DistrictsResponse> => {
  let districtsResponse: DistrictsResponse = {
    result: [],
    success: false,
    errorCode: '0'
  }

  await getJson(GORZDRAV_API.districts)
    .then(
      (data: DistrictsResponse) => {
        districtsResponse = data
      },
      (error) => {
        console.error(`[ERROR][API][${GORZDRAV_API.districts}]\r\n${error}`)
      }
    )

  return districtsResponse
}

export const fetchLPUs = async (districtId: string): Promise<LPUsResponse> => {
  let LPUsResponse: LPUsResponse = {
    result: [],
    success: false,
    errorCode: '0'
  }

  const endpoint = getLPUsEndpoint(districtId)
  await getJson(endpoint)
    .then(
      (data: LPUsResponse) => {
        LPUsResponse = data
      },
      (error) => {
        console.error(`[ERROR][API][${endpoint}]\r\n${error}`)
      }
    )

  return LPUsResponse
} 