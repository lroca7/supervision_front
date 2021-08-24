/* eslint-disable multiline-ternary */
import { useContext, useState, useEffect } from "react"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import { Row, Col, Button, Spinner, Input, Alert } from "reactstrap"

import "@styles/react/libs/charts/apex-charts.scss"

import { AgGridColumn, AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Swal from "sweetalert2"

import { URL_BACK } from "../../contants"

const Sprint = (props) => {
  const { colors } = useContext(ThemeColors)

  const [loader, setLoader] = useState(false)
  const [typeView, setTypeView] = useState(0)

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
          debugger
          if (result.codigo === 200) {
            setResultEjecucion(result.result)
          } else {
            Swal.fire(
              `${result.error}`,
              `${result.detalle !== undefined ? result.detalle : ""} <br/>`,
              "error"
            )
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

  const [columnsDef, setColumnsDef] = useState([
    { field: "nombreproceso", headerName: "Proceso", maxWidth: 120 },
    { field: "fechareporte", headerName: "Fecha", maxWidth: 100 },
    { field: "detalle", headerName: "Detalle", minWidth: 120 }
  ])

  useEffect(() => {
    debugger
    const id = props.history.location.search.split("idCorrida=")[1]
    const input = document.getElementById("id_corrida")
   
    if (id) {
      input.value = id
      setTypeView(1)
      getCorrida()
    }
  }, [])

  return (
    <div className="card">

      <div class="card-header">
        <h4 class="card-title">{typeView === 0 ? 'Leer corrida' : 'Detalle de corrida'}</h4>
      </div>
      <div class="card-body">
        <div className="container-sprint mb-4">
      {typeView === 0 && (
        <>
          <Row className="d-flex align-items-end justify-content-center">
            <Col md="6">
              <label>Ingresa id de corrida:</label>
              <Input type="number" name="id_corrida" id="id_corrida" />
            </Col>
            <Col md="2" className="pl-0">
              <Button
                color="primary"
                disabled={loader}
                onClick={(e) => getCorrida(e)}
              >
                {!loader ? (
                  "Buscar"
                ) : (
                  <>
                    <Spinner color="white" size="sm" />
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </>
      )}

      {loader === true && (
        <Col md="12" className="d-flex justify-content-center mt-4 mb-4">
          <Button.Ripple color="primary">
            <Spinner color="white" size="sm" />
            <span className="ml-50">Cargando...</span>
          </Button.Ripple>
        </Col>
      )}

      {resultEjecucion !== null ? (
        <div className="mt-2 p-2 info-corrida">
          <p>
            <b>Id Corrida: </b> {resultEjecucion.idCorrida}{" "}
          </p>
          <p>
            <b>Tipo de corrida: </b>
            {resultEjecucion.tipoCorrida}
          </p>
          <p>
            <b>Estado: </b> {resultEjecucion.estado}{" "}
          </p>
          <p>
            <b>Usuario: </b> {resultEjecucion.user}{" "}
          </p>
          <p>
            <b>Fecha creación: </b> {resultEjecucion.fecCreacion}{" "}
          </p>
          <p>
            <b>Parametros:</b> {resultEjecucion.verParam}{" "}
          </p>
          <p>
            <b>Id flujo: </b> {resultEjecucion.idFlujo}{" "}
          </p>
          <p>
            <b>Flujo: </b> {resultEjecucion.flujo}{" "}
          </p>
          <p>
            <b>Fecha proceso: </b> {resultEjecucion.fecProceso}{" "}
          </p>
          <p>
            <b>Fecha de ejecución: </b> {resultEjecucion.fecEjecucion}{" "}
          </p>
          <p>
            <b>Día de ejecucion: </b> {resultEjecucion.diaEjecucion}{" "}
          </p>
          <p>
            <b>Nuemero día de ejecución: </b> {resultEjecucion.numDiaEjecucion}{" "}
          </p>
          <p>
            <b>Observación: </b> {resultEjecucion.observacion}{" "}
          </p>
          {
            resultEjecucion.detalleResultados.length > 0 && (
              <>
                <p>
                  <b>Resultados reportados: </b> {resultEjecucion.resultados}{" "}
                </p>

                <table className='table-detalle-corrida mt-2'>
                  <thead>
                    <tr>
                      <th>Proceso</th>
                      <th>Fecha</th>
                      <th>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                  {resultEjecucion.detalleResultados.map(r => {
                    return (
                      <tr>
                        <td>{r.nombreproceso}</td>
                        <td>{r.fechareporte}</td>
                        <td>{r.detalle}</td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
              </>
            ) 
          }
        </div>
      ) : (
        <Alert color="secondary" className="mt-2">
          <p className="p-2">No hay datos para visualizar </p>
        </Alert>
      )}
    </div>
      </div>
    </div>
  )
}

export default Sprint
