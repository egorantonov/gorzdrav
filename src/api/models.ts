export interface GorzdravResponse {
  success: boolean,
  errorCode: string, // "0" | ???
  message?: string | undefined | null,
  stackTrace?: string | undefined | null
}

export interface Response<T> extends GorzdravResponse {
  result: T
}

export type DistrictsResponse = Response<District[]>
export type LPUsResponse = Response<LPU[]>

export interface District {
  id: string, // "1" to "18"
  name: string,
  okato: number
}

export interface LPU {
  id: number,
  description: string,
  district: number,
  districtId: number,
  districtName: string,
  isActive: boolean,
  lpuFullName: string,
  lpuShortName: string,
  lpuType: string, // TODO: enum ?
  partOf: number | null,
  headOrganization: string, // guid
  organization: string, // guid
  address: string,
  phone: string,
  email: string,
  longitude: string,
  latitude: string,
}

export interface Specialty {
  id: string,
  ferId: string, // ?
  name: string,
  countFreeParticipant: number,  // число доступных талонов
  countFreeTicket: number, // ?
  lastDate?: string, // Date
  nearestDate?: string // Date 
}

export interface Doctor {
  ariaNumber?: string,
  ariaType?: string,
  comment?: string,
  freeParticipantCount: number,
  freeTicketCount: number,
  id: string,
  lastDate?: string, // Date
  name: string,
  nearestDate?: string 
}

export interface ApiCache<T> {
  value: T,
  timestamp: number
}