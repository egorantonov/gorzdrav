import { useCallback, useEffect, useState } from 'react'
import { fetchDistricts } from '../../api/methods'
import { District } from '../../api/models'
import { LPUs } from '../LPUs'

import style from './district.module.scss'

export function Districts() {

  const [districts, setDistricts] = useState([] as District[])
  const [district, setDistrict] = useState('')

  const onDistrictClick = useCallback((id: string) => {
    setDistrict(id)
  }, [])

  useEffect(() => {
    const getDistricts = async () => {
      const data = await fetchDistricts()
      setDistricts(data.result)
    }

    getDistricts()
  }, [])

  return (
    <div id="districts">
      <div className={style.districts}>
        {districts.map((x) => (
          <div className={style.district} key={x.id} data-type="district"
            onClick={() => onDistrictClick(x.id)}>
            <div data-type="district-id" data-id={x.id}>
              <span>{x.id}</span>
            </div>
            <div data-type="district-name" data-name={x.name}>
              <span>{x.name}</span>
            </div>
            <div data-type="district-okato" data-okato={x.okato}>
              <span>{x.okato}</span>
            </div>
          </div>
        ))}
      </div>
      
      {district && (
        <div>
          <span>Выбранный район: {districts.find(x => x.id === district)?.name}</span>
          <LPUs districtId={district} />
        
        </div>)}

    </div>
  )
}