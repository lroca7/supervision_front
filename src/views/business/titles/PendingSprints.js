import { useContext, useState, useEffect, useRef } from "react"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import {
  Row,
  Col,
  Button,
  Spinner,
  CustomInput,
  FormGroup,
  Label,
  Input,
  Form,
  Alert
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

import Select from "react-select"

import "@styles/react/libs/charts/apex-charts.scss"

import { AgGridColumn, AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Swal from "sweetalert2"

import { URL_BACK } from "../../../contants"

const PendingSprints = (props) => {
  const { colors } = useContext(ThemeColors)

  const [loader, setLoader] = useState(false)

  const [corridas, setCorridas] = useState([])

  const getCorridas = () => {
    setLoader(true)

    const url = `${URL_BACK}corridas?filtro=estado='INI'`

    fetch(url, {
      method: "GET"
    })
      .then((response) => response.json())
      .then((result) => {
        debugger
        if (result.codigo === 200) {
          // transFormData(result.result)

          const rowData = [
            { make: "Toyota", model: "Celica", price: 35000 },
            { make: "Ford", model: "Mondeo", price: 32000 },
            { make: "Porsche", model: "Boxter", price: 72000 }
          ]

          setCorridas(result.result)
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
        Swal.fire(`Ha ocurrido un error al consultar`, `${error}`, "error")
        setLoader(false)
      })
  }

  const actionCellRenderer = (params) => {
    const eGui = document.createElement("div")

    const editingCells = params.api.getEditingCells()
    // checks if the rowIndex matches in at least one of the editing cells
    const isCurrentRowEditing = editingCells.some((cell) => {
      return cell.rowIndex === params.node.rowIndex
    })

    eGui.innerHTML = `<button class="btn btn-danger btn-sm" size="sm" data-action="delete" > Solucionar </button>`

    return eGui
  }

  const onCellClicked = (params) => {
    // Handle click event for action cells
    if (
      params.column.colId === "action" &&
      params.event.target.dataset.action
    ) {
      const action = params.event.target.dataset.action

      if (action === "edit") {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        })
      }

      if (action === "delete") {
        alert("En desarrollo ...")
        // params.api.applyTransaction({
        //   remove: [params.node.data]
        // })
      }

      if (action === "update") {
        params.api.stopEditing(false)
      }

      if (action === "cancel") {
        params.api.stopEditing(true)
      }
    }
  }

  const [columnsDef, setColumnsDef] = useState([
    { field: "idCorrida", headerName: "Id corrida", maxWidth: 120 },
    { field: "user", headerName: "Usuario" },
    { field: "fecCreacion", headerName: "F. creación" },
    { field: "verParam", headerName: "Versión parametros" },
    { field: "idFlujo", headerName: "Id flujo", maxWidth: 120 },
    { field: "observacion", headerName: "Observación" },
    {
      headerName: "Acciones",
      minWidth: 150,
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: "action"
    }
  ])

  useEffect(() => {
    getCorridas()
  }, [])

  return (
    <div id="parameters-container mb-4">
      <h2>Corridas con acción pendiente</h2>
      {loader === true && (
        <Col md="12" className="d-flex justify-content-center mt-4 mb-4">
          <Button.Ripple color="primary">
            <Spinner color="white" size="sm" />
            <span className="ml-50">Cargando...</span>
          </Button.Ripple>
        </Col>
      )}
      {corridas.length > 0 ? (
        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            rowData={corridas}
            defaultColDef={{
              flex: 1,
              minWidth: 110,
              editable: false,
              resizable: true
            }}
            onCellClicked={onCellClicked}
            columnDefs={columnsDef}
          ></AgGridReact>
        </div>
      ) : (
        <Alert color="secondary" className="mt-2">
          <p className="p-2">No hay datos para visualizar </p>
        </Alert>
      )}
    </div>
  )
}

export default PendingSprints
