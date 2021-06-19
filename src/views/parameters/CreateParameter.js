import { useContext, useState, useEffect } from 'react'
import { List } from 'react-feather'
import { kFormatter } from '@utils'
import Avatar from '@components/avatar'
import Timeline from '@components/timeline'
import AvatarGroup from '@components/avatar-group'
import jsonImg from '@src/assets/images/icons/json.png'
import InvoiceList from '@src/views/apps/invoice/list'
import ceo from '@src/assets/images/portrait/small/avatar-s-9.jpg'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import Sales from '@src/views/ui-elements/cards/analytics/Sales'
import AvgSessions from '@src/views/ui-elements/cards/analytics/AvgSessions'
import CardAppDesign from '@src/views/ui-elements/cards/advance/CardAppDesign'
import SupportTracker from '@src/views/ui-elements/cards/analytics/SupportTracker'
import { Row, Col, Card, CardHeader, CardTitle, CardBody, Media } from 'reactstrap'
import OrdersReceived from '@src/views/ui-elements/cards/statistics/OrdersReceived'
import CardCongratulations from '@src/views/ui-elements/cards/advance/CardCongratulations'
import SubscribersGained from '@src/views/ui-elements/cards/statistics/SubscribersGained'

import Select from 'react-select'

import '@styles/react/libs/charts/apex-charts.scss'

const CreateParameter = () => {
  const { colors } = useContext(ThemeColors)

  //Analítica, Límites y Monitoreo
  const options = [
    { value: 'Analítica', label: 'Analítica' },
    { value: 'Límites', label: 'Límites' },
    { value: 'Monitoreo', label: 'Monitoreo' }
  ]

  const [grupo, setGrupo] = useState(null)
  const [parameters, setParameters] = useState([])

  const [subgrupos, setSubgrupos] = useState([])

  const transFormData = (data) => {
    const group = data.reduce((r, a) => {
      r[a.subgrupo] = [...r[a.subgrupo] || [], a]
      return r
     }, {})
    console.log("subgrupos -> ", group)
    setSubgrupos(group)
  }

  const getParameters = (e) => {

    const grupo = e.value
    const url = `https://zaemfz4o3j.execute-api.us-east-1.amazonaws.com/desa/desa-services_sync/parametros/plantilla-parametros?grupo=${grupo}`

    fetch(url)
      .then(response => response.json())
      .then(result => {
        if (result.codigo === 200) {
          setParameters(result.result.parametros)
          transFormData(result.result.parametros)
        }
      })
  }

  useEffect(() => {
    // getParameters()
  }, [])
  
  return (
    <div id='parameters-container'>
      <h2>Crear parametro</h2>
      <Select options={options} placeholder='Seleccionar' onChange={(e) => getParameters(e)} />
      <br/>
      <h3>Plantilla de parametros</h3>
      {Object.entries(subgrupos).length > 0 ? (
        
        Object.entries(subgrupos).map(([key, value]) => {
          return (
            <div>
              <h4>{key}</h4>
            </div>
          )
      })
       
      ) : <p>No hay datos para visualizar </p>}
    </div>
  )
}

export default CreateParameter
