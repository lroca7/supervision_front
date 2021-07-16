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

import Select from "react-select"
import { AgGridColumn, AgGridReact } from "ag-grid-react"

import Swal from 'sweetalert2'

import { URL_BACK } from "../../contants"

import CustomTooltip from './customTooltip.js'

const Sprint = (props) => {
  const { colors } = useContext(ThemeColors)

  const [loader, setLoader] = useState(false)

  const [corridas, setCorridas] = useState([])

  const [resultEjecucion, setResultEjecucion] = useState(null)

  const options = [
    { value: "", label: "Todas" },
    { value: "INI", label: "Inicial" },
    { value: "CAN", label: "Cancelado" },
    { value: "WAIT", label: "Espera" },
    { value: "FOK", label: "Finalizado" },
    { value: "ERR", label: "Con Error" }
  ]

  /** 
   * #INI : Inicil (estado inicial, No tiene datos completos para lanzar a ejecucion)
   * #ACT : Activo (En ejecucion)
   * #CAN : Cancelado (cuando manualmente se detiene el proceso)
   * #WAIT: Espera, requiere intervencion manual
   * #FOK : Finalizado OK
   * #ERR : Terminada con error*/

  const consultarCorridas = (e) => {
    setLoader(true)

    const estado = e.value
    const url = `${URL_BACK}corridas?filtro=estado='${estado}'`

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {
          console.log('Resultado', result.result)
          setCorridas(result.result)
          setLoader(false)
        }
      })
  }

  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit()
  }

  useEffect(() => {
  }, [])

  return (
    <div className="card">
      <div class="card-header">
        <h4 class="card-title">Leer corrida</h4>
      </div>
      <div class="card-body">

        <div className="container-sprint mb-4">
        <Row className="d-flex align-items-end justify-content-center">
          <Col md="6">
            <label className='form-label'>Seleccionar Estado:</label>
                <Select className="ml-50"
                  id="select-group"
                  style={{ width: `400px` }}
                  options={options}
                  placeholder="Seleccionar Estado"
                  onChange={(e) => consultarCorridas(e)}
                />
            </Col>

          </Row>
          <br />
              {Object.entries(corridas).length > 0 ? (
                <div className="grid-wrapper">
                <div
                  id="myGrid"
                  style={{
                    height: '450px',
                    width: '100%'
                  }}
                  className="ag-theme-alpine"
                >
                  <AgGridReact
                    rowData={corridas}
                    defaultColDef={{
                      flex: 1,
                      minWidth: 50,
                      editable: false,
                      resizable: true,
                      wrapText: true,
                      tooltipComponent: 'customTooltip'
                    }}
                    tooltipShowDelay={0}
                    frameworkComponents={{ customTooltip: CustomTooltip }}
                  >
                    <AgGridColumn label="ID" field="idCorrida" ></AgGridColumn>
                    <AgGridColumn label="Usuario" field="user" sortable={true} ></AgGridColumn>
                    <AgGridColumn label="Fecha Creación" field="fecCreacion" sortable={true} ></AgGridColumn>
                    <AgGridColumn label="Fecha Creación" field="fecProceso" ></AgGridColumn>
                    <AgGridColumn label="Fecha Creación" field="flujo" ></AgGridColumn>
                    <AgGridColumn label="Fecha Creación" field="avance" sortable={true} ></AgGridColumn>
                    <AgGridColumn label="Fecha Creación" field="observacion" tooltipField="observacion" ></AgGridColumn>

                  </AgGridReact>
                </div>
                </div>
              ) : (
                <Alert color='secondary'>
                  <p>No hay datos para visualizar </p>
                </Alert>
              )}
        </div>
      </div>
    </div>

  )
}

export default Sprint
