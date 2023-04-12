import React, { useState } from 'react'
import './style.scss'
import { PatientForm } from '../../components/PatientForm'
import { OmsLPUs } from '../../components/OmsLPUs'
 
const firstComponent = () => {
  return <div>
    <PatientForm />
  </div>
}
const secondComponent = () => {
  return <div>
    <OmsLPUs />
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
    { key: 'firstStep', label: 'My First Step', isDone: true, component: firstComponent },
    { key: 'secondStep', label: 'My Second Step', isDone: false, component: secondComponent },
    { key: 'thirdStep', label: 'My Third Step', isDone: false, component: thirdComponent },
    { key: 'finalStep', label: 'My Final Step', isDone: false, component: finalComponent },
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

  const handleBack = () => {
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
      <h4>Step wizard in React - <a href="https://www.cluemediator.com" title="Clue Mediator" target="_blank" rel="nofollow noopener noreferrer">Clue Mediator</a></h4>
      <div className="box">
        <div className="steps">
          <ul className="nav">
            {steps.map((step, i) => {
              return <li key={i} className={`${activeStep.key === step.key ? 'active' : ''} ${step.isDone ? 'done' : ''}`}>
                <div>Step {i + 1}<br /><span>{step.label}</span></div>
              </li>
            })}
          </ul>
        </div>
        <div className="btn-component">
          <input type="button" value="Back" onClick={handleBack} disabled={steps[0].key === activeStep.key} />
          <input type="button" value={steps.at(-1)?.key !== activeStep.key ? 'Next' : 'Submit'} onClick={handleNext} />
        </div>
        <div className="step-component">
          {activeStep.component()}
        </div>
      </div>
    </div>
  )
}
