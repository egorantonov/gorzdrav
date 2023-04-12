import { useCallback, useEffect, useState } from 'react'
import { fetchLPUs, getData } from '../../api/methods'
import { LPU, LPUsResponse } from '../../api/models'

import style from './lpu.module.scss'
import { Patient } from '../PatientForm'
import { getOmsLPUsEndpoint } from '../../api/endpoints'

interface OmsLPUsProps {
  polisN: string;
}

export function OmsLPUs() {

  const [lpu, setLpu] = useState({} as LPU)
  const [LPUs, setLPUs] = useState([] as LPU[])

  const selectedPatient = 'selectedPatient'
  const polisN = localStorage.getItem(selectedPatient) ?? ''
  const patient: Patient = JSON.parse(localStorage.getItem(polisN) ?? '{}')

  const onLPUClick = useCallback((id: number) => {
    const selectedLPU = LPUs.find(x => x.id === id)

    if (selectedLPU !== undefined) {
      setLpu(selectedLPU)
    }
    else {
      console.error('Выбранное ЛПУ не найдено среди медорганизаций!')
    }

  }, [])

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
        <p>Выбранный пациент: {patient.lastName} {patient.firstName}</p>
        <span>Список доступных медорганизаций ({LPUs.length}):</span>
        {LPUs.length > 0 && LPUs.map((x) => {

          const phoneLink = `tel: +7${x.phone.replaceAll(/\(|\)|-| /g, '')}`
          const emailLink = `mailto: ${x.email}`
          // const encodedName = encodeURIComponent(`${x.lpuFullName} ${x.districtName} район`.replaceAll('"', ''))
          const encodedAddress = encodeURIComponent(`${x.address} ${x.districtName} район`?.replaceAll('"', ''))

          return (
            <div key={x.id} className={style.lpu} onClick={() => onLPUClick(x.id)}>
              <div>
                <span><b>{x.lpuFullName}</b></span>
              </div>
              {x.address && (<div>
                
                <a href={`https://yandex.ru/maps/2/saint-petersburg/search/${encodedAddress}/?z=19`}
                  target="_blank" rel="noreferrer">
                  <span>📍 {x.address}</span>
                </a>
              </div>)}
              <div>
                <a href={phoneLink}> 📞 +7 {x.phone}</a>
                <a href={emailLink}> 📧 {x.email}</a>
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
