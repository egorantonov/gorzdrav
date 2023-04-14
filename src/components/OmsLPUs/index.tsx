import { useEffect, useState } from 'react'
import { getData } from '../../api/methods'
import { LPU } from '../../api/models'

import style from './lpu.module.scss'
import { Patient } from '../PatientForm'
import { getOmsLPUsEndpoint } from '../../api/endpoints'

interface OmsLPUsProps {
  next: any,
  polisN: string,
  lpuId: string,
  setLpuId: any
}

export function OmsLPUs(props: OmsLPUsProps) {

  const [LPUs, setLPUs] = useState([] as LPU[])

  const patients: Patient[] = JSON.parse(localStorage.getItem('patients') ?? '[]')
  const patient = patients.find(p => p.polisN === props.polisN)

  const onLPUClick = (selectedLPU: LPU) => {
    props.setLpuId(selectedLPU.id)
    props.next()
  }

  useEffect(() => {
    const getLPUs = async () => {
      const data = await getData<LPU[]>(getOmsLPUsEndpoint(props.polisN), `lpus_${props.polisN}`)
      setLPUs(data)
    }

    getLPUs()
  }, [props.polisN])

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
    </div>
  )
}
