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
  Alert
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

const ListParametersOficial = () => {
  const { colors } = useContext(ThemeColors)

  const initialErrorState = {
    status: false,
    codigo: '',
    error: '',
    detaller: ''
  }
  const [error, setError] = useState(initialErrorState)

  const URL_BASE =
    "https://zaemfz4o3j.execute-api.us-east-1.amazonaws.com/desa/desa-services_sync/"

  const [loader, setLoader] = useState(false)
  //Analítica, Límites y Monitoreo
  const options = [
    { value: "Analítica", label: "Analítica" },
    { value: "Límites", label: "Límites" },
    { value: "Monitoreo", label: "Monitoreo" }
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
    setError(initialErrorState)
    const grupo = e.value
    setGrupo(grupo)
    const url = `${URL_BASE}parametros?grupo=${grupo}`

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {
          setParameters(result.result.parametros)
          transFormData(result.result.parametros)
          
        } else {
          setError({
            status: result.status,
            codigo: result.codigo,
            error: result.error,
            detalle: result.detalle
          })
        }

        setLoader(false)
      })
  }

  useEffect(() => {
    // getParameters()
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

  return (
    <div id="parameters-container mb-4">
      <h2 className="mb-2">Parámetros oficiales</h2>

      <Col md="6">
        <label>Seleccionar grupo:</label>
        <Select
          id="select-group"
          options={options}
          placeholder="Seleccionar"
          onChange={(e) => getParameters(e)}
        />
      </Col>

      {loader === true ? (
        <Col md="12" className="d-flex justify-content-center mt-4 mb-4">
          <Button.Ripple color="primary">
            <Spinner color="white" size="sm" />
            <span className="ml-50">Cargando...</span>
          </Button.Ripple>
        </Col>
      ) : (
        <Col md="12" className="mt-2">
          {Object.entries(subgrupos).length > 0 ? (
            <>
              <h4 className='mb-2'>Subgrupos</h4>

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
                        onGridReady={onGridReady}
                        onCellValueChanged={onCellValueChanged}
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
            </>
          ) : (
            <p>No hay datos para visualizar </p>
          )}
        </Col>
      )}

      {
        error.status && (
          <Col md="12">
            <Alert color='danger'>
              {/* <h4 className='alert-heading'>Lorem ipsum dolor sit amet</h4> */}
              <div className='alert-body'>
                <p>{error.status}</p>
                <p>{error.codigo}</p>
                <p>{error.detalle}</p>
                <p>{error.error}</p>
              </div>
            </Alert>
          </Col>
          
        )
      }
    </div>
  )
}

export default ListParametersOficial
