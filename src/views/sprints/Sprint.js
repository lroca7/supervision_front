/* eslint-disable multiline-ternary */
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
  Input,
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
import DatePicker from "react-flatpickr"

import Swal from 'sweetalert2'

const Sprint = () => {
  const { colors } = useContext(ThemeColors)

  const URL_BASE =
    "https://zaemfz4o3j.execute-api.us-east-1.amazonaws.com/desa/desa-services_sync/"

  const [loader, setLoader] = useState(false)

  const [resultEjecucion, setResultEjecucion] = useState(null)

  const getCorrida = () => { 

    const inputCorrida = document.getElementById("id_corrida")
    const idCorrida = inputCorrida.value.trim()

    if (idCorrida.length > 0) {

      setLoader(true)

      const url = `${URL_BASE}corridas?idCorrida=${idCorrida}`

      fetch(url, {
        method: "GET"
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.codigo === 201) {
            setResultEjecucion(result.result)
          } else {
            Swal.fire(`${result.error}`, `${result.detalle} <br/>`, "error")
          }

          if (result.codigo === undefined) {
            Swal.fire(`${result.message}`, ``, "error")
          }
          setLoader(false)
        })
        .catch((error) => {
          console.error(error)
          Swal.fire(`Ha ocurrido un error al ejecutar`, `${error}`, "error")
          setLoader(false)
        })
    }
  }

  useEffect(() => {
    // console.log('data inicial -> ', students)
  }, [])

  return (
    <div className="container-sprint mb-4">
      <h2 className="mb-2">Leer corrida</h2>

      <Row className="d-flex align-items-end">
        <Col md="6">
          <label>Ingresa id de corrida:</label>
          <Input
            type="number"
            name="id_corrida"
            id="id_corrida"
            isRequired={true}
          />
        </Col>
        <Col md="2" className="pl-0">
          <Button color="primary" onClick={(e) => getCorrida(e)}>
            Buscar
          </Button>
        </Col>
      </Row>


      {loader === true ? (
        <Col md="12" className="d-flex justify-content-center mt-4 mb-4">
          <Button.Ripple color="primary">
            <Spinner color="white" size="sm" />
            <span className="ml-50">Cargando...</span>
          </Button.Ripple>
        </Col>
      ) : (     
          
        resultEjecucion !== null ? (
          <div className="mt-2 p-2 info-corrida">
          <p>Id Corrida : {resultEjecucion.idCorrida} </p>
          <p>Estado : {resultEjecucion.estado} </p>
          <p>Usuario : {resultEjecucion.user} </p>
          <p>Fecha creación : {resultEjecucion.fecCreacion} </p>
          <p>Parametros: {resultEjecucion.verParam} </p>
          <p>Id flujo : {resultEjecucion.idFlujo} </p>
          <p>Fecha proceso : {resultEjecucion.fecProceso} </p>
          <p>Fecha de ejecución : {resultEjecucion.fecEjecucion} </p>
          <p>Día de ejecucion : {resultEjecucion.diaEjecucion} </p>
          <p>Nuemero día de ejecución : {resultEjecucion.numDiaEjecucion} </p>
          {/* <p>consecRun : {resultEjecucion.consecRun} </p> */}
          <p>Observación : {resultEjecucion.observacion} </p>
          </div>
        )
        : <p>No hay información</p>
      
      )}

    </div>
  )
}

export default Sprint
