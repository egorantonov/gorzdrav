import { useEffect, useState } from 'react'
import { Doctor } from '../../api/models'
import { getData } from '../../api/methods'
import { getDoctorsEndpoint } from '../../api/endpoints'

import style from './doctor.module.scss'

export interface DoctorsProps {
  next: any,
  lpuId: string,
  specialtyId: string,
  doctorId: string,
  setDoctorId: any
}

export function Doctors(props: DoctorsProps) {
  const [doctors, setDoctors] = useState([] as Doctor[])

  useEffect(() => {
    const getDoctors = async () => {
      const data = await getData<Doctor[]>(getDoctorsEndpoint(props.lpuId, props.specialtyId))
      setDoctors(data)
    }

    getDoctors()
  }, [props.lpuId])

  const onDoctorClick = (selectedDoctor: Doctor) => {
    props.setDoctorId(selectedDoctor.id)
    props.next()
  }

  return(
    <div id="doctors">
      <div className={style.doctors}>
        <span>Список врачей ({doctors.length}):</span>
        {doctors.length > 0 && doctors.map((d) => {
          return (
            <div key={d.id} data-id={d.id} className={style.doctor} onClick={() => onDoctorClick(d)}>
              <div>
                <span><b>{d.name}</b></span>              
              </div>
              {d.freeParticipantCount > 0 && <div>
                <span>{d.freeParticipantCount}</span>
              </div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}