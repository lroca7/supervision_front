/* eslint-disable multiline-ternary */
import { useContext, useState, useEffect } from "react"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import { Row, Col, Button, Spinner, Input, Alert } from "reactstrap"

import "@styles/react/libs/charts/apex-charts.scss"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Select from "react-select"
import { AgGridColumn, AgGridReact } from "ag-grid-react"

import Swal from "sweetalert2"

import { URL_BACK } from "../../contants"

import CustomTooltip from "./customTooltip.js"

import { useHistory } from "react-router-dom"

const Sprint = (props) => {
  const { colors } = useContext(ThemeColors)

  const history = useHistory()

  const [loader, setLoader] = useState(false)

  const [corridas, setCorridas] = useState([])

  const [infoCorrida, setInfoCorrida] = useState(null)

  const options = [
    { value: "", label: "--Todas--" },
    { value: "CAN", label: "Cancelado" },
    { value: "ERR", label: "Con Error" },
    { value: "ACT", label: "Ejecución" },
    { value: "WAIT", label: "Espera" },
    { value: "FOK", label: "Finalizado" },
    { value: "INI", label: "Inicial" }
  ]

  /**
   * #INI : Inicil (estado inicial, No tiene datos completos para lanzar a ejecucion)
   * #ACT : Activo (En ejecucion)
   * #CAN : Cancelado (cuando manualmente se detiene el proceso)
   * #WAIT: Espera, requiere intervencion manual
   * #FOK : Finalizado OK
   * #ERR : Terminada con error*/

  const consultarCorridas = (e) => {
    setCorridas([])
    setLoader(true)

    const estado = e.value

    let url = `${URL_BACK}corridas`
    if (estado) {
      url = `${URL_BACK}corridas?filtro=estado='${estado}'`
    }

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {
          console.log("Resultado", result.result)
          setCorridas(result.result)
          setLoader(false)
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

  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit()
  }

  const actionCellRenderer = (params) => {
    const eGui = document.createElement("div")

    const editingCells = params.api.getEditingCells()
    // checks if the rowIndex matches in at least one of the editing cells
    const isCurrentRowEditing = editingCells.some((cell) => {
      return cell.rowIndex === params.node.rowIndex
    })
    console.log("actionCellRenderer params", params)
    eGui.innerHTML = `<button class="btn btn-primary btn-sm" size="sm" data-action="detail" > Detalle </button>`

    return eGui
  }

  const onCellClicked = (params) => {
    // Handle click event for action cells
    if (
      params.column.colId === "action" &&
      params.event.target.dataset.action
    ) {
      const action = params.event.target.dataset.action

      if (action === "detail") {
        debugger
        // getCorrida(params.node.data.idCorrida)
        history.push({
          pathname: `/read/sprint`,
          search: `?idCorrida=${params.node.data.idCorrida}`
        })
      }
    }
  }

  const [columnsDef, setColumnsDef] = useState([
    { field: "idCorrida", headerName: "Id Corrida", maxWidth: 100 },
    // { field: "user", headerName: "Usuario", maxWidth: 120 },
    { field: "tipoCorrida", headerName: "Tipo corrida", maxWidth: 115 },
    { field: "verParam", headerName: "Parámetros", maxWidth: 110 },
    { field: "fecProceso", headerName: "Fecha Proceso", maxWidth: 120 },
    { field: "flujo", headerName: "Flujo", maxWidth: 240 },
    { field: "avance", headerName: "Avance", maxWidth: 90 },
    { field: "resultados", headerName: "Resultados", maxWidth: 100 },
    { field: "observacion", headerName: "Observación" },
    {
      headerName: "Acciones",
      maxWidth: 120,
      cellRenderer: actionCellRenderer,

      editable: false,
      colId: "action"
    }
  ])

  useEffect(() => {}, [])

  return (
    <div className="card">
      <div class="card-header">
        <h4 class="card-title">Consultar corridas</h4>
      </div>
      <div class="card-body">
        <div className="container-sprint mb-4">
          <Row className="d-flex align-items-end justify-content-center">
            <Col md="6">
              <label className="form-label">Seleccionar estado:</label>
              <Select
                className="ml-50"
                id="select-group"
                style={{ width: `400px` }}
                options={options}
                placeholder="Seleccionar Estado"
                onChange={(e) => consultarCorridas(e)}
              />
            </Col>
          </Row>
          <br />

          {loader === true && (
            <Col md="12" className="d-flex justify-content-center mt-4 mb-4">
              <Button.Ripple color="primary">
                <Spinner color="white" size="sm" />
                <span className="ml-50">Cargando...</span>
              </Button.Ripple>
            </Col>
          )}

          {Object.entries(corridas).length > 0 ? (
            <div className="grid-wrapper">
              <div
                id="myGrid"
                style={{
                  height: "450px",
                  width: "100%"
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
                    tooltipComponent: "customTooltip"
                  }}
                  onCellClicked={onCellClicked}
                  columnDefs={columnsDef}
                  tooltipShowDelay={0}
                  frameworkComponents={{ customTooltip: CustomTooltip }}
                ></AgGridReact>
              </div>
            </div>
          ) : (
            <Alert color="secondary">
              <p className="p-2">No hay datos para visualizar </p>
            </Alert>
          )}

        </div>
      </div>
    </div>
  )
}

export default Sprint
