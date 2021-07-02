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

const Sprint = () => {
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

      <Row className="d-flex align-items-end justify-content-center">
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
        : <p className="mt-4">No hay información</p>
      
      )}

    </div>
  )
}

export default Sprint
