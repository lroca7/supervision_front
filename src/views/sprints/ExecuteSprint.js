import { useContext, useState, useEffect } from "react"
import { List } from "react-feather"
import { kFormatter } from "@utils"
import Avatar from "@components/avatar"
import Timeline from "@components/timeline"
import AvatarGroup from "@components/avatar-group"
import jsonImg from "@src/assets/images/icons/json.png"
import InvoiceList from "@src/views/apps/invoice/list"
import ceo from "@src/assets/images/portrait/small/avatar-s-9.jpg"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import Sales from "@src/views/ui-elements/cards/analytics/Sales"
import AvgSessions from "@src/views/ui-elements/cards/analytics/AvgSessions"
import CardAppDesign from "@src/views/ui-elements/cards/advance/CardAppDesign"
import SupportTracker from "@src/views/ui-elements/cards/analytics/SupportTracker"
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Media,
  Button,
  Spinner,
  CardText,
  CustomInput,
  FormGroup,
  Label,
  Input
} from "reactstrap"
import OrdersReceived from "@src/views/ui-elements/cards/statistics/OrdersReceived"
import CardCongratulations from "@src/views/ui-elements/cards/advance/CardCongratulations"
import SubscribersGained from "@src/views/ui-elements/cards/statistics/SubscribersGained"

import Select from "react-select"

import "@styles/react/libs/charts/apex-charts.scss"

import { render } from "react-dom"
import { AgGridColumn, AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"
import DatePicker from "react-flatpickr"


const ExecuteSprint = () => {
  const { colors } = useContext(ThemeColors)

  const URL_BASE =
    "https://zaemfz4o3j.execute-api.us-east-1.amazonaws.com/desa/desa-services_sync/"

  const [loader, setLoader] = useState(false)

  const [btnDisable, setbtnDisable] = useState(false)

  //Analítica, Límites y Monitoreo
  const options = [
    { value: "oficiales", label: "Oficiales" },
    { value: "temporales", label: "Temporales" }
  ]

  const [grupo, setGrupo] = useState(null)
  const [parameters, setParameters] = useState([])

  const [subgrupos, setSubgrupos] = useState([])

  const transFormData = (data) => {
    const group = data.reduce((r, a) => {
      r[a.subgrupo] = [...(r[a.subgrupo] || []), a]
      return r
    }, {})
    console.log("subgrupos -> ", group)
    setSubgrupos(group)
  }

  const getParameters = (e) => {
    setLoader(true)

    const grupo = e.value
    setGrupo(grupo)
    const url = `${URL_BASE}parametros/plantilla-parametros?grupo=${grupo}`

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {
          setParameters(result.result.parametros)
          transFormData(result.result.parametros)
          setLoader(false)
        }
      })
  }

  useEffect(() => {
    // console.log('data inicial -> ', students)
  }, [])

  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)

  const onGridReady = (params) => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const onCellValueChanged = (event) => {
    console.log('data after changes is: ', event.data)
  }

  const createCorrida = () => {

    setbtnDisable(true)

    const body = {
      user: 'jlotero'
    }

    const url = `${URL_BASE}corridas`

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then((response) => response.json())
      .then((result) => {
        debugger
        if (result.codigo === 200) {
          Swal.fire(
            `Corrida generada con exito`,
            `Versión: ${result.result.version} <br/>
             Tipo: ${result.result.tipo} <br/>
             Usuario: ${result.result.usuario} <br/>
             Fecha: ${result.result.fechaCreacion} <br/>`,
            'success'
          )
        }
      })

  }

  const onChangeValue = (event) => {
    debugger
    console.log(event.target.value)
  }

  return (
    <div id="parameters-container mb-4">
      <h2 className="mb-2">Lanzar corrida</h2>
      <Col md="12">   
        {/* <Button disabled={btnDisable} color="primary mr-2" onClick={createCorrida}>
          {!btnDisable ? 'Generar' : <><Spinner color="white" size="sm" /><span className="ml-50">Generando...</span></>}
        </Button> */}
        <h5>Seleccione el tipo de corrida para los parametros:</h5>
        <FormGroup tag="fieldset" onChange={onChangeValue} >
          <FormGroup check>
            <Label check>
              <Input type="radio" name="radio1" value="1" />{' '}
              PBO/N&S - Márgenes - Evaluación (manual y automático, FDS arranca directamente en valoración)
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="radio" name="radio1" value="2" />{' '}
              PBO - Márgenes - Valoración (Solo manual)
            </Label>
          </FormGroup>
          <FormGroup check >
            <Label check>
              <Input type="radio" name="radio1" value="3"  />{' '}
              Márgenes - Valoración
            </Label>
          </FormGroup>
          <FormGroup check >
            <Label check>
              <Input type="radio" name="radio1" value="3"  />{' '}
              Valoración
            </Label>
          </FormGroup>
        </FormGroup>
      </Col>
      <Col md="3" className="mt-2">  
        <h5>Fecha del proceso:</h5>
        <Input class="pickadate" type="date"  name="date-corrida" id="date-corrida" isRequired={true}/>
      </Col>

      <Col md="6" className="mt-2">  
        <h5>Parámetros de corrida:</h5>
        <label>Usuario:</label>
        <Input type="text" name="user" id="user" isRequired={true}/>
        <label>Fecha:</label>
        <Input type="text" name="fecha" id="fecha" isRequired={true}/>
        <label>Tipo:</label>
        <Select
          id="select-group"
          options={options}
          placeholder="Seleccionar"
          onChange={(e) => getParameters(e)}
        />
        <label>Grupo:</label>
        <Input type="text" name="grupo" id="grupo" isRequired={true}/>
        <label>Versión:</label>
        <Input type="text" name="version" id="version" isRequired={true}/>
      </Col>

      {loader === true ? (
        <Col md="12" className="d-flex justify-content-center mt-4 mb-4">
          
        </Col>
      ) : (
       <p>{}</p>
      )}
    </div>
  )
}

export default ExecuteSprint
