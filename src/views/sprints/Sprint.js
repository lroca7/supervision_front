/* eslint-disable multiline-ternary */
import { useContext, useState, useEffect } from "react"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import {
  Row,
  Col,
  Button,
  Spinner,
  Input,
  Alert
} from "reactstrap"

import "@styles/react/libs/charts/apex-charts.scss"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Swal from 'sweetalert2'

import { URL_BACK } from "../../contants"

const Sprint = (props) => {
  const { colors } = useContext(ThemeColors)

  const [loader, setLoader] = useState(false)

  const [resultEjecucion, setResultEjecucion] = useState(null)

  const getCorrida = () => {

    const inputCorrida = document.getElementById("id_corrida")
    const idCorrida = inputCorrida.value.trim()

    if (idCorrida.length > 0) {

      setLoader(true)

      const url = `${URL_BACK}corridas?idCorrida=${idCorrida}`

      fetch(url, {
        method: "GET"
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.codigo === 200) {
            setResultEjecucion(result.result)
          } else {
            Swal.fire(`${result.error}`, `${result.detalle !== undefined ? result.detalle : ''} <br/>`, "error")
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
    const id = props.history.location.search.split("idCorrida=")[1]
    document.getElementById("id_corrida").value = id
    getCorrida()
  }, [])

  return (
    <div className="container-sprint mb-4">
      <h2 className="mb-2">Leer corrida</h2>

      <Row className="d-flex align-items-end justify-content-center">
        <Col md="6">
          <label>Ingresa id de corrida:</label>
          <Input
            type="number"
            name="id_corrida"
            id="id_corrida"
          />
        </Col>
        <Col md="2" className="pl-0">
          <Button color="primary" disabled={loader} onClick={(e) => getCorrida(e)}>
            {!loader ? 'Buscar' :  <><Spinner color="white" size="sm" /></>}
          </Button>
        </Col>
      </Row>


      { 
          
        resultEjecucion !== null ? (
          <div className="mt-2 p-2 info-corrida">
          <p><b>Id Corrida: </b> {resultEjecucion.idCorrida} </p>
          <p><b>Tipo de corrida: </b>{resultEjecucion.tipoCorrida}</p>
          <p><b>Estado: </b> {resultEjecucion.estado} </p>
          <p><b>Usuario: </b> {resultEjecucion.user} </p>
          <p><b>Fecha creación: </b> {resultEjecucion.fecCreacion} </p>
          <p><b>Parametros:</b> {resultEjecucion.verParam} </p>
          <p><b>Id flujo: </b> {resultEjecucion.idFlujo} </p>
          <p><b>Flujo: </b> {resultEjecucion.flujo} </p>
          <p><b>Fecha proceso: </b> {resultEjecucion.fecProceso} </p>
          <p><b>Fecha de ejecución: </b> {resultEjecucion.fecEjecucion} </p>
          <p><b>Día de ejecucion: </b> {resultEjecucion.diaEjecucion} </p>
          <p><b>Nuemero día de ejecución: </b> {resultEjecucion.numDiaEjecucion} </p>
          <p><b>Resultados: </b> {resultEjecucion.resultados} </p>
          <p><b>Observación: </b> {resultEjecucion.observacion} </p>
          </div>
        )
        : <p className="mt-4">No hay información</p>
      
      }

    </div>
  )
}

export default Sprint
