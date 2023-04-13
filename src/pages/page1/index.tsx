import React, { useState } from 'react'
import './style.scss'
import { Patients } from '../../components/PatientForm'
import { OmsLPUs } from '../../components/OmsLPUs'
 

export interface Handles {
  next: any
}

const firstComponent = (handles: Handles) => {
  return <div>
    <Patients next={handles.next}  />
  </div>
}
const secondComponent = (handles: Handles)  => {
  return <div>
    <OmsLPUs next={handles.next} />
  </div>
}
const thirdComponent = () => {
  return <div>Third Component</div>
}
const finalComponent = () => {
  return <div>Final Component</div>
}

export function Page1() {

  const [steps, setSteps] = useState([
    { key: 'firstStep', label: 'Пациент', isDone: true, component: firstComponent },
    { key: 'secondStep', label: 'Медорганизация', isDone: false, component: secondComponent },
    { key: 'thirdStep', label: 'Специальность', isDone: false, component: thirdComponent },
    { key: 'fourthStep', label: 'Врач', isDone: false, component: thirdComponent },
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
          {
            activeStep.component({next: handleNext})
          }
        </div>
      </div>
    </div>
  )
}
