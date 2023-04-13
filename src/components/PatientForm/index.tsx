import { useState } from 'react'
import { Handles } from '../../pages/page1'

export interface SavedPatients {
  patients: Patient[]
}

export interface Patient {
  firstName: string,
  lastName: string,
  birthDate: string,
  polisN: string
}


export function Patients(handles: Handles) {
  const requiredPlaceholder = 'Обязательно'
  const text = 'text' 

  const firstNameId = 'first-name'
  const firstNameLabel = 'Имя'  
  const [firstName, setFirstName] = useState('')

  const lastNameId = 'last-name'
  const lastNameLabel = 'Фамилия'
  const [lastName, setLastName] = useState('')

  const birthDateId = 'birthdate'
  const birthDateLabel = 'Дата рождения'
  const [birthDate, setBirthDate] = useState('')

  const polisNId = 'polis-n'
  const polisNLabel = 'Номер полиса'
  const [polisN, setPolisN] = useState('')

  const selectedPatient = 'selectedPatient'

  const savedPatients: Patient[] = JSON.parse(localStorage.getItem('patients') ?? '[]')
  const [patients, setPatients] = useState(savedPatients)

  const onPatientSubmit = (e: any) => {
    e.preventDefault()
    const patientId = polisN
    localStorage.setItem(selectedPatient, patientId)

    const patientExists = patients.find(p => p.polisN === polisN)
    if (patientExists) {
      patientExists.birthDate = birthDate
      patientExists.firstName = firstName
      patientExists.lastName = lastName
      localStorage.setItem('patients', JSON.stringify(patients))
    }
    else {
      const newPatient: Patient = {firstName, lastName, birthDate, polisN}
      setPatients([...patients, newPatient])
      localStorage.setItem('patients', JSON.stringify([...patients, newPatient]))
    }

    handles.next()
  }

  const setActivePatient = (p: Patient) => {
    localStorage.setItem(selectedPatient, p.polisN)
    handles.next()
  }

  return (
    <div>
      <form>
        <label style={{width: '40%'}} htmlFor={firstNameId}>{firstNameLabel}</label>
        <input style={{width: '40%'}} type={text} id={firstNameId} placeholder={requiredPlaceholder} 
          value={firstName} required={true} onChange={(e) => setFirstName(e.target.value)} />

        <label style={{width: '40%'}} htmlFor={lastNameId}>{lastNameLabel}</label>
        <input style={{width: '40%'}} type={text} id={lastNameId} placeholder={requiredPlaceholder}
          value={lastName} required={true} onChange={(e) => setLastName(e.target.value)} />

        <label style={{width: '40%'}} htmlFor={birthDateId}>{birthDateLabel}</label>
        <input style={{width: '40%'}} type="date" id={birthDateId} placeholder={requiredPlaceholder}
          value={birthDate} required={true} onChange={(e) => setBirthDate(e.target.value)} />

        <label style={{width: '40%'}} htmlFor={polisNId}>{polisNLabel}</label>
        <input style={{width: '40%'}} type="number" id={polisNId} placeholder={requiredPlaceholder} 
          value={polisN} required={true} onChange={(e) => setPolisN(e.target.value)} />

        <input style={{width: '40%'}} type="submit" onClick={onPatientSubmit} />
      </form>
      <div>
        {patients.map((p, i) => {
          return (<div key={i} data-patient={p.polisN} style={{border: '1px solid #7777'}}
            onClick={() => setActivePatient(p)}>
            <p>Пациент: {p.lastName} {p.firstName}</p>
            <p>{p.birthDate}</p>
            <p>{p.polisN}</p>
          </div>)
        } )}
      </div>
    </div>
  )
}