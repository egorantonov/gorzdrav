const GORZDRAV = 'https://gorzdrav.spb.ru'

const API = `${GORZDRAV}/_api/api/v2`
const Content_API = `${GORZDRAV}/api/ContentIndex`

interface GorzdravApi {
  hostName: string,
  districts: string,
  lpus: string,
  omsLpus: string,
  specialties: string,
  doctors: string,
  timetable: string,
  appointments: string,
  searchPatient: string,
  createAppointment: string,
  searchAppointment: string
}

export const GORZDRAV_API: GorzdravApi = {
  hostName: GORZDRAV,
  districts: `${API}/shared/districts`,
  lpus: `${API}/shared/district/{districtId}/lpus`,
  omsLpus: `${API}/oms/attachment/lpus?polisN=`,
  specialties: `${API}/schedule/lpu/{lpuId}/specialties`,
  doctors: `${API}/schedule/lpu/{lpuId}/speciality/{specialtyId}/doctors`,
  timetable: `${API}/schedule/lpu/{lpuId}/doctor/{doctorId}/timetable`,
  appointments: `${API}/schedule/lpu/{lpuId}/doctor/{doctorId}/appointments`,
  searchPatient: `${API}/patient/search`,
  createAppointment: `${API}/appointment/create`,
  searchAppointment: `${API}/appointments` // ?lpuId={lpuId}&patientId={patientId}`
}

export const getLPUsEndpoint = (districtId: string) => GORZDRAV_API.lpus.replace('{districtId}', districtId)
export const getOmsLPUsEndpoint = (polisN: string) => GORZDRAV_API.omsLpus+polisN
export const getSpecialtiesEndpoint = (lpuId: string) => GORZDRAV_API.specialties.replace('{lpuId}', lpuId)
export const getDoctorsEndpoint = (lpuId: string, specialtyId: string) => GORZDRAV_API.doctors.replace('{lpuId}', lpuId).replace('{specialtyId}', specialtyId) 