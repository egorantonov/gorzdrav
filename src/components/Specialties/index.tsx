import { useEffect, useState } from 'react'
import { Handles } from '../../pages/page1'
import { getData } from '../../api/methods'

export function Specialties(handles: Handles) {

  const selectedLpu = localStorage.getItem('lpuId')
  const [lpuId, setLpuId] = useState(selectedLpu)

  useEffect(() => {
    const getSpecialties =async () => {
      const data = await getData<Specialty[]>(`lpu_${lpuId}_specialties`, getSpecialtiesEndpoint(lpuId))
    }
  })

  return(

  )
}