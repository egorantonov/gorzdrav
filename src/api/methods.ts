import { getJson } from '../extensions/fetch'
import { getLPUsEndpoint, GORZDRAV_API } from './endpoints'
import { ApiCache, DistrictsResponse, LPUsResponse, Response } from './models'

const CACHE_EXPIRATION = 10 * 24 * 60 * 60 * 1000

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

export async function getData<T>(url: string, cacheId = ''): Promise<T> {

  if (cacheId !== '') {
    const cacheString = localStorage.getItem(cacheId)
    if (cacheString) {
      const cache: ApiCache<T> = JSON.parse(cacheString)
  
      if ((Date.now() - cache.timestamp)/CACHE_EXPIRATION > 1) {
        localStorage.removeItem(cacheId)
      }
      else {
        return cache.value
      }
    }
  }


  let response = {} as T
  await getJson(url)
    .then(
      (data: Response<T>) => {

        if (data.success === false) {
          console.log(data.message)
          return
        }

        response = data.result

        if (cacheId !== '') {
          const cache: ApiCache<T> = {value: response, timestamp: Date.now()} 
          localStorage.setItem(cacheId, JSON.stringify(cache))
        }
      },
      (error) => {
        console.error(`[ERROR][API][${url}]\r\n${error}`)
      }
    )

  return response
}