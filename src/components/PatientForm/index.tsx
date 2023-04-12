import { useState } from 'react'

export interface Patient {
  firstName: string,
  lastName: string,
  birthDate: string,
  polisN: string
}

export function PatientForm() {
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

  const onPatientSubmit = () => {
    const patientId = polisN
    localStorage.setItem(selectedPatient, patientId)
    const patient: Patient = {firstName, lastName, birthDate, polisN}
    const patientString = JSON.stringify(patient)
    localStorage.setItem(patientId, patientString)
  }

  return (
    <div>
      <form>
        <label htmlFor={firstNameId}>{firstNameLabel}</label>
        <input type={text} id={firstNameId} placeholder={requiredPlaceholder} 
          value={firstName} required={true} onChange={(e) => setFirstName(e.target.value)} />

        <label htmlFor={lastNameId}>{lastNameLabel}</label>
        <input type={text} id={lastNameId} placeholder={requiredPlaceholder}
          value={lastName} required={true} onChange={(e) => setLastName(e.target.value)} />

        <label htmlFor={birthDateId}>{birthDateLabel}</label>
        <input type="date" id={birthDateId} placeholder={requiredPlaceholder}
          value={birthDate} required={true} onChange={(e) => setBirthDate(e.target.value)} />

        <label htmlFor={polisNId}>{polisNLabel}</label>
        <input type="number" id={polisNId} placeholder={requiredPlaceholder} 
          value={polisN} required={true} onChange={(e) => setPolisN(e.target.value)} />

        <input type="submit" onClick={onPatientSubmit} />
      </form>
    </div>
  )
}