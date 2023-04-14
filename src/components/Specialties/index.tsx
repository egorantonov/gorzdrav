import { useEffect, useState } from 'react'
import { getData } from '../../api/methods'
import { getSpecialtiesEndpoint } from '../../api/endpoints'
import { Specialty } from '../../api/models'

import style from './specialty.module.scss'

export interface SpecialtiesProps {
  next: any,
  lpuId: string,
  specialtyId: string,
  setSpecialtyId: any
}

export function Specialties(props: SpecialtiesProps) {

  const [specialties, setSpecialties] = useState([] as Specialty[])

  useEffect(() => {
    const getSpecialties = async () => {
      const data = await getData<Specialty[]>(getSpecialtiesEndpoint(props.lpuId))
      setSpecialties(data)
    }

    getSpecialties()
  }, [props.lpuId])

  const onSpecialtyClick = (selectedSpecialty: Specialty) => {
    props.setSpecialtyId(selectedSpecialty.id)
    props.next()
  }

  return(
    <div id="specialties">
      <div className={style.specialties}>
        <span>Список доступных специальностей ({specialties.length}):</span>
        {specialties.length > 0 && specialties.map((s) => {
          return (
            <div key={s.id} data-id={s.id} className={style.specialty} onClick={() => onSpecialtyClick(s)}>
              <div>
                <span><b>{s.name}</b></span>              
              </div>
              {s.countFreeParticipant > 0 && <div>
                <span>{s.countFreeParticipant}</span>
              </div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}