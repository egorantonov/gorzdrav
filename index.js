const host = 'https://gorzdrav.spb.ru' 
const api_v2 = '/_api/api/v2' 
const CONSTANTS = {
  API: {
    lpus: `${host}${api_v2}/oms/attachment/lpus?polisN={insuranceNumber}`,
    specialties: `${host}${api_v2}/schedule/lpu/{lpuId}/specialties`,
    doctors: `${host}${api_v2}/schedule/lpu/{lpuId}/speciality/{specialtyId}/doctors`,
    appointments: `${host}${api_v2}/schedule/lpu/{lpuId}/doctor/{doctorId}/appointments`,
    createAppointment: `${host}${api_v2}/appointment/create`,
    cancelAppointment: `${host}${api_v2}/appointment/cancel`,
    searchAppointment: `${host}${api_v2}/appointments?lpuId={lpuId}&patientId={patientId}`,
    searchPatient: `${host}${api_v2}/patient/search`
  },
  patients: 'patients',
  selectedPatient: 'selectedPatient'
}

function initialize() {
  renderPatients()
  removeTimers()
  pwa()
}

function pwa() {
  window.addEventListener('popstate', (event) => {
    const currentBackButton = Array.from(document.querySelectorAll('.popup:not(.hidden) .popup_back')).at(-1)
    if (currentBackButton) {
      const parentPopup = currentBackButton.closest('.popup')
      parentPopup.classList.add('hidden')

      if (currentBackButton.id == 'appointments_back') {
        removeTimers()
      }
    }
  })
}

function renderPatients() {
  const patientsNode = document.getElementById(CONSTANTS.patients)
  patientsNode.innerHTML = ''
  const patients = getPatients()
  const raw = patients.map(p => renderPatient(p)).join('')
  UpdateContent(patientsNode, raw)
}

function renderPatient(p) {
  return `<div class="patient" id="patient_${p.insuranceNumber}">
            <div class="patient_info" onclick="setActivePatient('${p.insuranceNumber}','${p.lastName}','${p.firstName}','${p.birthDate}')">
              <div class="patient_info_text">
                <p class="patient_name">Пациент: <b>${p.lastName} ${p.firstName}</b></p>
                <p class="patient_birthday">Дата рождения: ${new Date(p.birthDate).toLocaleDateString()}</p>
                <p class="patient_insurance">Полис: ${p.insuranceNumber}</p>
              </div>
            </div>
            <div class="patient_remove" onclick="removePatient('${p.insuranceNumber}')">
              <span>✕</span>
            </div>
          </div>`
}

async function getData({
  view,
  entity,
  renderFunction,
  endpoint,
  parameter1,
  parameter1Name,
  parameter1EmptyMessage,
  parameter2,
  parameter2Name,
  parameter2EmptyMessage,
}, retry = false) {
  const popup = document.getElementById(view)
  popup.classList.remove('hidden')
  const container = document.getElementById(`${view}_list`)
  container.innerHTML = ''

  const withMessage = (text, noerror = false) => `
    <div class="${entity}">
        <div class="${entity}_name">
          <span class="${noerror ? '' : 'error'}">${text}</span>
        </div>
    </div>`

  if (!parameter1) {
    let message = parameter1EmptyMessage
    if (!parameter2 && parameter2Name) message += `\r\n${parameter2EmptyMessage}`
    UpdateContent(container, withMessage(message))
    return
  }

  UpdateContent(container, withMessage('Загрузка...', true))

  let countPrevious = 0

  const patients = getPatients()
  const patient = patients.find(p => p.insuranceNumber == getSelectedPatient())

  // Get LPUs from cache
  if (view == 'lpus' && patient && patient.favLpus && Array.isArray(patient.favLpus) && patient.favLpus.length) {
    const raw = patient.favLpus.map(e => renderFunction(e, parameter1, parameter2)).join('')
    UpdateContent(container, raw)
    return patient.favLpus.length
  }

  const fetchData = async (firstTime = false) => {
    let countCurrent = 0

    await fetch(endpoint.replace(`${parameter1Name}`, parameter1).replace(`${parameter2Name}`, parameter2))
      .then(r => r.json())
      .then(json => {
        if (json.success && json.result && Array.isArray(json.result)) {
          const result = json.result

          // caching
          if (view == 'lpus' && patient && (!patient.favLpus || Array.isArray(patient.favLpus) && !patient.favLpus.length)) {
            patient.favLpus = result
            setPatients(patients)
          }

          countCurrent = result.length
          if (firstTime || countCurrent != countPrevious) {
            const raw = result.map(e => renderFunction(e, parameter1, parameter2)).join('')
            UpdateContent(container, raw)
            countPrevious = countCurrent
          }
        }
        else if (!json.success) {
          UpdateContent(container, withMessage(`Ошибка: ${json.message ? json.message : 'Сервис вернул ошибку без сообщения'}`))
          countPrevious = countCurrent
        }
        else {
          UpdateContent(container, withMessage(`Неизвестная ошибка, смотри консоль.`))
          countPrevious = countCurrent
        }
      })
      .catch(error => {
        console.log(error)
        alert(`Ошибка запроса: ${error.message}`)
        countCurrent = -1
        UpdateContent(container, withMessage(`Ошибка выполнения запроса: смотри консоль.`))
      })

    return countCurrent
  }

  let count = await fetchData(true)
  if (!retry || count == -1) return

  let timerId = setInterval(async () => {
    count = await fetchData()
  }, 5e3)

  addTimer(timerId)

  setTimeout(() => {
    removeTimer(timerId)
  }, 30 * 60 * 1e3) // отменяем опрос через 30 минут
}

function renderLPU(lpu) {
  const phoneLink = `tel: +7${lpu.phone.replaceAll(/\(|\)|-| /g, '')}`
  const emailLink = `mailto: ${lpu.email}`
  // const encodedName = encodeURIComponent(`${x.lpuFullName} ${x.districtName} район`.replaceAll('"', ''))
  const encodedAddress = lpu.address 
    ? encodeURIComponent(`${lpu.address} ${lpu.districtName} район`?.replaceAll('"', ''))
    : ''

  return `
<div class="lpu" id="lpu_${lpu.id}">
  <div class="lpu_name">
    <div class="lpu_name_text"><span><b>${lpu.lpuFullName}</b></span></div>
    <div class="removeLpu" onclick="removeLpu(${lpu.id})">✖</div>
  </div>
  <div class="lpu_address">
    ${lpu.address ? `<a href="https://yandex.ru/maps/2/saint-petersburg/search/${encodedAddress}/?z=19"
      target="_blank" rel="noreferrer">
      <span>📍 ${lpu.address}</span>
    </a>` : ''}
  </div>
  <div class="lpu_contacts">
    <a href=${phoneLink}> 📞 +7 ${lpu.phone}</a>
    <a href=${emailLink}> 📧 ${lpu.email}</a>
  </div>
  <div class="lpu_select">
    <button class="lpu_select_button" onclick="getSpecialties('${lpu.id}')">Выбрать</button>
  </div>
</div>
  `
}

async function setActivePatient(insuranceNumber, lastName, firstName, birthDate) {
  setSelectedPatient(insuranceNumber)
  // const selectedPatientNode = document.getElementById(CONSTANTS.selectedPatient)
  // selectedPatientNode.innerText = `Выбранный пациент: ${lastName} ${firstName}`

  const request = {
    view: 'lpus',
    entity: 'lpu',
    renderFunction: renderLPU,
    endpoint: CONSTANTS.API.lpus,
    parameter1: insuranceNumber,
    parameter1Name: '{insuranceNumber}',
    parameter1EmptyMessage: 'Ошибка: не передан полис ОМС пациента',
    parameter2: '',
    parameter2Name: '',
    parameter2EmptyMessage: '',
  }
  getData(request)
  history.pushState({ page: 1 }, 'LPUS', '#lpus')
}

function updateCache() {
  const patients = getPatients()
  const insuranceNumber = getSelectedPatient()
  const patient = patients.find(p => p.insuranceNumber == insuranceNumber)
  if (patient && patient.favLpus && Array.isArray(patient.favLpus) && patient.favLpus.length) {
    patient.favLpus = []
    setPatients(patients)
    alert('Кэш медорганизаций обновлён')
    setActivePatient(insuranceNumber)
  }
}

function removeLpu(lpuId) {
  const patients = getPatients()
  const insuranceNumber = getSelectedPatient()
  const patient = patients.find(p => p.insuranceNumber == insuranceNumber)
  patient.favLpus.splice(patient.favLpus.map(lpu => lpu.id).indexOf(lpuId), 1)
  setPatients(patients)
  document.getElementById(`lpu_${lpuId}`).remove()
}

async function removePatient(insuranceNumber) {
  if (!confirm('Вы действительно хотите удалить пациента?')) return
  // const selectedPatient = localStorage.getItem(CONSTANTS.selectedPatient)
  // if (selectedPatient == insuranceNumber) {
  //   const selectedPatientNode = document.getElementById(CONSTANTS.selectedPatient)
  //   selectedPatientNode.innerText = ''
  // }
  const patients = getPatients()
  const patient = patients.find(p => p.insuranceNumber == insuranceNumber)
  patients.splice((patients.indexOf(patient)), 1)
  setPatients(patients)

  // clear
  renderPatients()
}

async function onPatientSubmit(event) {
  event.preventDefault()
  const form = event.target

  const insuranceNumber = form.insuranceNumber.value
  const lastName = form.lastName.value.trim()
  const firstName = form.firstName.value.trim()
  const birthDate = form.birthDate.value

  setActivePatient(insuranceNumber, lastName, firstName, birthDate)

  const patients = getPatients()
  const existing = patients.find(p => p.insuranceNumber == insuranceNumber)
  if (existing) {
    existing.lastName = lastName,
    existing.firstName = firstName,
    existing.birthDate = birthDate
  }
  else {
    patients.push({
      insuranceNumber: insuranceNumber,
      lastName: lastName,
      firstName: firstName,
      birthDate: birthDate
    })
  }
  setPatients(patients)
  renderPatients()

  return false
}

async function getSpecialties(lpuId) {
  const patientId = await getPatientId(lpuId)
  await getLpuAppointments(lpuId, patientId)

  const request = {
    view: 'specialties',
    entity: 'specialty',
    renderFunction: renderSpecialty,
    endpoint: CONSTANTS.API.specialties,
    parameter1: lpuId,
    parameter1Name: '{lpuId}',
    parameter1EmptyMessage: 'Ошибка: не передан идентификатор организации',
    parameter2: '',
    parameter2Name: '',
    parameter2EmptyMessage: '',
  }
  getData(request)
  history.pushState({ page: 2 }, 'Specialties', '#specialties')
}

function renderSpecialty(specialty, lpuId) {
  return `
<div class="specialty">
  <div class="specialty_name">${specialty.name}</div>
  <div class="specialty_tickets">${specialty.countFreeParticipant ? `Талонов: ${specialty.countFreeParticipant}` : ''}</div>
  <button class="specialty_select_button" onclick="getDoctors('${lpuId}','${specialty.id}')">Выбрать</button>
</div>`
}

async function getDoctors(lpuId, specialtyId) {
  const request = {
    view: 'doctors',
    entity: 'doctor',
    renderFunction: renderDoctor,
    endpoint: CONSTANTS.API.doctors,
    parameter1: lpuId,
    parameter1Name: '{lpuId}',
    parameter1EmptyMessage: 'Ошибка: не передан идентификатор организации',
    parameter2: specialtyId,
    parameter2Name: '{specialtyId}',
    parameter2EmptyMessage: 'Ошибка: не передан идентификатор специальности',
  }
  getData(request)
  history.pushState({ page: 3 }, 'Doctors', '#doctors')
}

function renderDoctor(doctor, lpuId) {
  return `
<div class="doctor">
  <div class="doctor_name">${doctor.name}</div>
  <div class="doctor_comment">${doctor.comment ? doctor.comment : ''}</div>
  <div class="doctor_aria">${doctor.ariaNumber ? doctor.ariaNumber : ''}</div>
  <div class="doctor_tickets">${doctor.freeParticipantCount ? `Талонов: ${doctor.freeParticipantCount}` : ''}</div>
  <button class="doctor_select_button" onclick="getAppointments('${lpuId}', '${doctor.id}')">Выбрать</button>
</div>`
}

async function getLpuAppointments(lpuId, patientId) {
    const request = {
        view: 'lpu_appointments',
        entity: 'lpu_appointment',
        renderFunction: renderLpuAppointment,
        endpoint: CONSTANTS.API.searchAppointment,
        parameter1: lpuId,
        parameter1Name: '{lpuId}',
        parameter1EmptyMessage: 'Ошибка: не передан идентификатор организации',
        parameter2: patientId,
        parameter2Name: '{patientId}',
        parameter2EmptyMessage: 'Ошибка: не передан идентификатор пациента',
    }
    getData(request)
}

function renderLpuAppointment(appointment, lpuId) {
    const patient = findSelectedPatient()
    const visit = parseDate(appointment.visitStart)
    return `
      <div class="lpu_appointment" id="lpuAppointment_${appointment.appointmentId}">
        <div class="lpu_appointment_visit">
          <div class="lpu_appointment_visit_date">${visit.date}</div>
          <div class="lpu_appointment_visit_time">${visit.time}</div>
        </div>
        <div class="lpu_appointment_data">
          <div class="lpu_appointment_specialty">${appointment.specialityRendingConsultation?.name}</div>
          <div class="lpu_appointment_doctor">${appointment.doctorRendingConsultation?.name}</div>
          <div class="lpu_appointment_lpu">${appointment.lpuFullName}</div>
          <div class="lpu_appointment_address">${appointment.lpuAddress}</div>
          <div class="lpu_appointment_phone">${appointment.lpuPhone}</div>
        </div>
        <div class="lpu_appointment_patient">
          <div class="lpu_appointment_patient_name">${patient.lastName} ${patient.firstName}</div>
          <div class="lpu_appointment_patient_birthday">${patient.birthDate}</div>
        </div>
        <div style="padding: 0 10px 10px">
          <button class="lpu_appointment_cancel_button" onclick="cancelAppointment(${lpuId}, ${appointment.appointmentId})">Отменить</button>
        </div>
      </div>
    `
}

async function cancelAppointment(lpuId, appointmentId) {
  debugger
  if (!confirm('Вы действительно хотите отказаться от посещения?')) return
  const patientId = await getPatientId(lpuId)
  if (!patientId) return

  const payload = {
      lpuId,
      patientId,
      appointmentId,
      esiaId: null
  }

  const result = await postData(CONSTANTS.API.cancelAppointment, JSON.stringify(payload))
  if (result?.success) {
      alert(`Запись успешно отменена!`)
      document.getElementById(`lpuAppointment_${appointmentId}`).remove()
  }
  else {
      let message = 'Возникла ошибка при отмене записи!'
      if (result.message) {
          message += `\r\b${result.message}`
      }
      alert(message)
      getSpecialties(lpuId)
  }
}

async function getAppointments(lpuId, doctorId) {
    const request = {
        view: 'appointments',
        entity: 'appointment',
        renderFunction: renderAppointment,
        endpoint: CONSTANTS.API.appointments,
        parameter1: lpuId,
        parameter1Name: '{lpuId}',
        parameter1EmptyMessage: 'Ошибка: не передан идентификатор организации',
        parameter2: doctorId,
        parameter2Name: '{doctorId}',
        parameter2EmptyMessage: 'Ошибка: не передан идентификатор врача',
    }
    getData(request, true)
    history.pushState({ page: 5 }, 'Appointments', '#appointments')
}

function renderAppointment(appointment, lpuId, doctorId) {
  const visit = parseDate(appointment.visitStart)

  return `
  <div id="appointment_${appointment.id}" class="appointment">
    <div class="appointment_name"><b>${visit.time}</b>, ${visit.date}</div>
    <div class="appointment_room">${appointment.room ? `Кабинет: ${appointment.room}` : ''}</div>
    <button class="appointment_select_button" onclick="createAppointment('${lpuId}', '${appointment.id}', '${appointment.visitStart}', '${doctorId}')">Записаться</button>
  </div>`
}

async function createAppointment(lpuId, appointmentId, appointmentVisitStart) {
    const visit = parseDate(appointmentVisitStart)
    if (!confirm(`Вы подтверждаете запись на ${visit.time}, ${visit.date}`)) return
    const patientId = await getPatientId(lpuId)
    if (!patientId) return

    const payload = {
        lpuId,
        patientId,
        appointmentId
    }

    const result = await postData(CONSTANTS.API.createAppointment, JSON.stringify(payload))
    if (result?.success) {
        removeTimers()
        alert(`Вы успешно записались на ${visit.time}, ${visit.date}!\r\nДля просмотра записи перейдите в поликлинику.`)
        location.reload()
    }
    else {
        let message = 'Возникла ошибка при записи!'
        if (result.message) {
            message += `\r\b${result.message}`
        }
        alert(message)
        getAppointments(lpuId, doctorId)
    }
}

function findSelectedPatient() {
    const patients = getPatients()
    const patient = patients.find(p => p.insuranceNumber == getSelectedPatient())
    return patient
}

async function getPatientId(lpuId) {
    let patientId = ''
    const patients = getPatients()
    const patient = patients.find(p => p.insuranceNumber == getSelectedPatient())
    if (patient.lpus && Array.isArray(patient.lpus)) {
        const lpu = patient.lpus.find(l => l.lpuId == lpuId)
        if (!lpu) {
            patientId = await _getPatientId(lpuId, patient)
            patient.lpus.push({ lpuId, patientId })
        }
        else if (!lpu.patientId) {
            patientId = await _getPatientId(lpuId, patient)
            lpu.patientId = patientId
        }
        else {
            patientId = lpu.patientId
        }
    }
    else {
        patient.lpus = []
        patientId = await _getPatientId(lpuId, patient)
        patient.lpus.push({ lpuId, patientId })
    }

    setPatients(patients)
    return patientId
}

async function _getPatientId(lpuId, patient) {
    const patientId = await fetch(`${CONSTANTS.API.searchPatient}?lpuId=${lpuId}&lastName=${patient.lastName}&firstName=${patient.firstName}&birthdate=${patient.birthDate}`)
        .then(r => r.json())
        .then(json => {
            if (json.success && json.result) {
                return json.result
            }
            else {
                let errorMessage = 'Не удалось получить id пациента в ЛПУ. Попробуйте позже'
                if (json.message) {
                    errorMessage += `\r\n${json.message}`
                }
                console.error(errorMessage)
                alert(errorMessage)
                return ''
            }
        })
        .catch(error => {
            console.error(error)
            alert(`Не удалось получить id пациента в ЛПУ. Попробуйте позже\r\nОшибка запроса: ${error.message}`)
            return ''
        })

    return patientId
}

async function postData(endpoint, body) {
    return await fetch(endpoint, { 
            body, 
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(r => r.json())
        .catch(error => {
            console.error(error)
            return {
                success: false,
                message: error.message
            }
        })
}

/* UTILS */

function parseDate(dateString) {
    const visit = new Date(dateString)
    const date = visit.toLocaleDateString()
    const time = visit.toLocaleTimeString().slice(0, -3)

    return {date, time}
}

function getPatients() {
    return JSON.parse(localStorage.getItem(CONSTANTS.patients) ?? '[]')
}

function setPatients(patients) {
    localStorage.setItem(CONSTANTS.patients, JSON.stringify(patients))
}

function addTimer(timerId) {
    let timers = getTimers()
    timers.push(timerId)
    setTimers(timers)
}

function removeTimer(timerId) {
    let timers = getTimers()
    clearInterval(timerId)
    timers.splice(timers.indexOf(timerId), 1)
    setTimers(timers)
}

function removeTimers() {
    let timers = getTimers()
    for (let i = 0; i < timers.length; i++) {
        const timerId = timers[i];
        clearInterval(timerId)
    }
    setTimers([])
}

function getTimers() {
    return JSON.parse(localStorage.getItem('timers') ?? '[]')
}

function setTimers(timers) {
    localStorage.setItem('timers', JSON.stringify(timers))
}

function getSelectedPatient() {
    return localStorage.getItem(CONSTANTS.selectedPatient)
}

function setSelectedPatient(insuranceNumber) {
    localStorage.setItem(CONSTANTS.selectedPatient, insuranceNumber)
}

const backButtons = Array.from(document.querySelectorAll('.popup_back'))
for (let i = 0; i < backButtons.length; i++) {
  const back = backButtons[i];
  back.addEventListener('click', (e) => {
    // const parentPopup = e.target.closest('.popup')
    // parentPopup.classList.add('hidden')
    history.back()
  })
}

function UpdateContent(element, content, position = 'beforeend') {
  element.innerHTML = ''
  element.insertAdjacentHTML(position, content)
}