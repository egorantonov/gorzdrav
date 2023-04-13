import { useCallback, useEffect, useState } from 'react'
import { fetchLPUs, getData } from '../../api/methods'
import { LPU, LPUsResponse } from '../../api/models'

import style from './lpu.module.scss'
import { Patient } from '../PatientForm'
import { getOmsLPUsEndpoint } from '../../api/endpoints'
import { Handles } from '../../pages/page1'

interface OmsLPUsProps {
  polisN: string;
}

export function OmsLPUs(handles: Handles) {

  const [lpu, setLpu] = useState({} as LPU)
  const [LPUs, setLPUs] = useState([] as LPU[])

  const selectedPatient = 'selectedPatient'
  const polisN = localStorage.getItem(selectedPatient) ?? ''
  const patients: Patient[] = JSON.parse(localStorage.getItem('patients') ?? '[]')

  const patient = patients.find(p => p.polisN === polisN)

  const onLPUClick = (selectedLPU: LPU) => {
    setLpu(selectedLPU)

    handles.next()
  }

  useEffect(() => {
    const getLPUs = async () => {
      const data = await getData<LPU[]>(`lpus_${polisN}`, getOmsLPUsEndpoint(polisN))
      setLPUs(data)
    }

    getLPUs()
  }, [polisN])

  return (
    <div id="lpus" >
      <div className={style.lpus}>
        <p>Выбранный пациент: {patient?.lastName} {patient?.firstName}</p>
        <span>Список доступных медорганизаций ({LPUs.length}):</span>
        {LPUs.length > 0 && LPUs.map((lpu) => {

          const phoneLink = `tel: +7${lpu.phone.replaceAll(/\(|\)|-| /g, '')}`
          const emailLink = `mailto: ${lpu.email}`
          // const encodedName = encodeURIComponent(`${x.lpuFullName} ${x.districtName} район`.replaceAll('"', ''))
          const encodedAddress = encodeURIComponent(`${lpu.address} ${lpu.districtName} район`?.replaceAll('"', ''))

          return (
            <div key={lpu.id} className={style.lpu} onClick={() => onLPUClick(lpu)}>
              <div>
                <span><b>{lpu.lpuFullName}</b></span>
              </div>
              {lpu.address && (<div>
                
                <a href={`https://yandex.ru/maps/2/saint-petersburg/search/${encodedAddress}/?z=19`}
                  target="_blank" rel="noreferrer">
                  <span>📍 {lpu.address}</span>
                </a>
              </div>)}
              <div>
                <a href={phoneLink}> 📞 +7 {lpu.phone}</a>
                <a href={emailLink}> 📧 {lpu.email}</a>
              </div>
            </div>
          )
        })}
      </div>
      <div>
        <span>Выбранное ЛПУ: {lpu.lpuFullName}</span>
      </div>
    </div>
  )
}
