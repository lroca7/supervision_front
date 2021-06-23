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

import Swal from 'sweetalert2'
import { data } from "../tables/data-tables/data"

const CreateSprint = () => {
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

  const getParameters = (version) => {
    setLoader(true)
    const url = `${URL_BASE}parametros?version=${version}`

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {
          setParameters(result.result.parametros)
          transFormData(result.result.parametros)
          setLoader(false)
          setbtnDisable(false)
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

  const [dataCorrida, setDataCorrida] = useState(null)

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
          // Swal.fire(
          //   `Corrida generada con exito`,
          //   ``,
          //   'success'
          // )
          getParameters(result.result.corrida.verParam)
          setDataCorrida(result.result.corrida)       
          
        }
        // setbtnDisable(false)
      })

  }

  const onChangeValue = (event) => {
    debugger
    console.log(event.target.value)
  }

  return (
    <div id="parameters-container mb-4">
      <h2 className="mb-2">Crear corrida</h2>
      <Col md="12" className="d-flex align-items-center justify-content-center">   
        <Button disabled={btnDisable} color="primary mr-2" onClick={createCorrida}>
          {!btnDisable ? 'Generar' : <><Spinner color="white" size="sm" /><span className="ml-50">Generando...</span></>}
        </Button>
      </Col>     
      {(dataCorrida !== null && Object.entries(subgrupos).length > 0) && (
        <>
          <Col md="6" className="mt-2">  
            <h5 className="mt-2 mb-2">No de Corrida: {dataCorrida.idCorrida}</h5>
            <h5>Parámetros de corrida:</h5>
            <label>Usuario:</label>
            <Input type="text" name="user" id="user" value={dataCorrida.user}/>
            <label>Fecha:</label>
            <Input type="text" name="fecha" id="fecha" value={dataCorrida.fecCreacion}/>
            <label>Tipo:</label>
            <Select
              id="select-group"
              options={options}
              placeholder="Seleccionar"
              onChange={(e) => getParameters(e)}
            />
            <label>Grupo: ? </label>
            <Input type="text" name="grupo" id="grupo" />
            <label>Versión:</label>
            <Input type="text" name="version" id="version" value={dataCorrida.verParam}/>
          </Col>


          <Col md="12" className="mt-2">
          {Object.entries(subgrupos).length > 0 ? (
            <>
              {Object.entries(subgrupos).map(([key, value]) => {
                return (
                  <div>
                    <h5>{key}</h5>
                    <br />
                    <div
                      className="ag-theme-alpine"
                      style={{ height: 200, width: "100%" }}
                    >
                      <AgGridReact
                        rowData={value}
                        defaultColDef={{
                          flex: 1,
                          minWidth: 110,
                          editable: false,
                          resizable: true
                        }}
                      >
                        <AgGridColumn field="nombre" editable="false"></AgGridColumn>
                        <AgGridColumn field="valor"></AgGridColumn>
                        <AgGridColumn field="descripcion" editable="false"></AgGridColumn>
                      </AgGridReact>
                    </div>
                    <br />
                  </div>
                )
              })}

              <h5 className="mt-2">Convertir parametros en oficiales</h5>
              <CustomInput
                className="custom-control-primary mb-4"
                type="switch"
                id="switch-parmeter-type"
                name="oficiales"
                inline
              />

              <div className="d-flex justify-content-center mt-4 mb-4">
                <Button disabled={btnDisable} color="primary mr-2" >
                  {!btnDisable ? 'Guardar' :  <><Spinner color="white" size="sm" /><span className="ml-50">Guardando...</span></>}
                </Button>
                <Button disabled={btnDisable} outline color="secondary">
                  Cancelar
                </Button>
              </div>

            </>
          ) : (
            <p>No hay datos para visualizar </p>
          )}
        </Col>
        </>
      )} 
    </div>
  )
}

export default CreateSprint
