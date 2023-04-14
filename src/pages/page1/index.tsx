import React, { useState } from 'react'
import './style.scss'
import { Patients } from '../../components/PatientForm'
import { OmsLPUs } from '../../components/OmsLPUs'
import { Specialties } from '../../components/Specialties'
import { Doctors } from '../../components/Doctors'
 
const firstComponent = () => {
  return <div>

  </div>
}
const secondComponent = ()  => {
  return <div>

  </div>
}
const thirdComponent = () => {
  return <div>Third Component</div>
}
const finalComponent = () => {
  return <div>Final Component</div>
}

export function Page1() {
  const [polisN, setPolisN] = useState('')
  const [lpuId, setLpuId] = useState('')
  const [specialtyId, setSpecialtyId] = useState('')
  const [doctorId, setDoctorId] = useState('')

  const [steps, setSteps] = useState([
    { key: 0, label: 'Пациент', isDone: true, component: firstComponent },
    { key: 1, label: 'Медорганизация', isDone: false, component: secondComponent },
    { key: 2, label: 'Специальность', isDone: false, component: thirdComponent },
    { key: 3, label: 'Врач', isDone: false, component: thirdComponent },
    { key: 'finalStep', label: 'Талон', isDone: false, component: finalComponent },
  ])

  const [activeStep, setActiveStep] = useState(steps[0])

  const handleNext = () => {
    if (steps[steps.length - 1].key === activeStep.key) {
      alert('You have completed all steps.')
      return
    }
 
    const index = steps.findIndex(x => x.key === activeStep.key)
    setSteps(prevStep => prevStep.map(x => {
      if (x.key === activeStep.key) x.isDone = true
      return x
    }))
    setActiveStep(steps[index + 1])
  }

  function handleBack() {
    const index = steps.findIndex(x => x.key === activeStep.key)
    if (index === 0) return
 
    setSteps(prevStep => prevStep.map(x => {
      if (x.key === activeStep.key) x.isDone = false
      return x
    }))
    setActiveStep(steps[index - 1])
  }

  return (
    <div >
      <div className="box">
        <div className="steps">
          <ul className="nav">
            {steps.map((step, i) => {
              return <li key={i} className={`${activeStep.key === step.key ? 'active' : ''} ${step.isDone ? 'done' : ''}`}>
                <div>Шаг {i + 1}<br /><span>{step.label}</span></div>
              </li>
            })}
          </ul>
        </div>
        <div className="btn-component">
          {steps[0].key !== activeStep.key && <input type="button" value="Назад" onClick={handleBack} disabled={steps[0].key === activeStep.key} />}
          {/* <input type="button" value={steps.at(-1)?.key !== activeStep.key ? 'Next' : 'Submit'} onClick={handleNext} /> */}
        </div>
        <div className="step-component">
          {activeStep.key === 0 && <Patients next={handleNext} polisN={polisN} setPolisN={setPolisN} />}
          {activeStep.key === 1 && <OmsLPUs next={handleNext} polisN={polisN} lpuId={lpuId} setLpuId={setLpuId} />}
          {activeStep.key === 2 && <Specialties next={handleNext} lpuId={lpuId} specialtyId={specialtyId} setSpecialtyId={setSpecialtyId} />}
          {activeStep.key === 3 && <Doctors next={handleNext} lpuId={lpuId} specialtyId={specialtyId} doctorId={doctorId} setDoctorId={setDoctorId} />}
          {/* {
            activeStep.component({next: handleNext})
          } */}
        </div>
        <div>Полис: {polisN}</div>
      </div>
    </div>
  )
}
