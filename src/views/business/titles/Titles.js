import { useContext, useState, useEffect, useRef } from "react"
import { useHistory } from "react-router-dom"
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
  Form
} from "reactstrap"

import Select from "react-select"

import "@styles/react/libs/charts/apex-charts.scss"

import { AgGridColumn, AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Swal from "sweetalert2"

import { URL_BACK } from "../../../contants"

const CreateTitle = () => {
  const { colors } = useContext(ThemeColors)
  const [loader, setLoader] = useState(false)

  const [subgrupos, setSubgrupos] = useState(null)

  const [idCorrida, setIdCorrida] = useState(null)

  const [titulos, setTitulos] = useState([])

  const history = useHistory()

  const actionCellRenderer = (params) => {
    const eGui = document.createElement("div")

    const editingCells = params.api.getEditingCells()
    // checks if the rowIndex matches in at least one of the editing cells
    const isCurrentRowEditing = editingCells.some((cell) => {
      return cell.rowIndex === params.node.rowIndex
    })

    eGui.innerHTML = `<button class="btn btn-danger btn-sm" size="sm" data-action="delete" > Eliminar </button>`

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
    { field: "nemotecnico", headerName: "Nemotécnico", maxWidth: 120 },
    { field: "moneda", headerName: "Moneda", maxWidth: 90 },
    { field: "fechavencimiento", headerName: "F. vencimiento", maxWidth: 120 },
    { field: "diasalvencimiento", headerName: "Días vencimiento", maxWidth: 120 },
    {
      field: "tir",
      headerName: "TIR",
      maxWidth: 90,
      cellRendererFramework: (field) => {
        return (field.value * 100).toFixed(2)
      }
    },
    { field: "preciosucio", headerName: "Precio sucio", minWidth: 100 },
    { field: "mkorigen", headerName: "Mercado origen", minWidth: 90 },
    {
      headerName: "Acciones",
      maxWidth: 110,
      cellRenderer: actionCellRenderer,

      editable: false,
      colId: "action"
    }
  ])

  const transFormData = (data) => {
    const group = data.reduce((r, a) => {
      r[a.grupo] = [...(r[a.grupo] || []), a]
      return r
    }, {})
    setSubgrupos(group)
  }

  const getFilterTitles = () => {
    const inputCorrida = document.getElementById("id_corrida")
    const idCorrida = inputCorrida.value.trim()

    if (idCorrida.length > 0) {

      setLoader(true)
      setIdCorrida(idCorrida)

      const url = `${URL_BACK}titulos-nys?idCorrida=${idCorrida}&tipoTitulos=filtrados`

      fetch(url, {
        method: "GET"
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.codigo === 200) {
            
            setTitulos(result.result.titulos)

            transFormData(result.result.titulos)
            
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
          Swal.fire(`Ha ocurrido un error al consultar`, `${error}`, "error")
          setLoader(false)
        })
    }

    const dummyData = {
      status: "ok",
      codigo: 200,
      result: {
        grupo: "Analítica",
        version: "93",
        user: "jlotero",
        fecha: "20210702192658",
        tipo: "oficiales",
        parametros: [
          {
            key: "uno",
            nemotecnico: "BSDR2027",
            moneda: "DOP",
            fechaVencimiento: "2027-04-20",
            diasVencimiento: "3028",
            tir: 0.63465,
            precioSucio: "117.000.000",
            mercadoOrigen: "Real",
            subgrupo: "Ministerio de hacienda DOP"
          },
          {
            key: "dos",
            nemotecnico: "BSDR2027",
            moneda: "USD",
            fechaVencimiento: "2027-04-20",
            diasVencimiento: "3028",
            tir: 0.63465,
            precioSucio: "117.000.000",
            mercadoOrigen: "Real",
            subgrupo: "Ministerio de hacienda USD"
          }
        ]
      }
    }

    // setData(dummyData)
    // transFormData(dummyData.result.parametros)
  }

  const addTitle = () => {
    
    // history.push('/create/title')

    history.push({
      pathname: '/create/title',
      search: `?idCorrida=${idCorrida}`,
      state: {titulos}
    })

  }

  useEffect(() => {}, [])

  return (
    <div id="parameters-container mb-4">
      <h2 className="mb-2">Aprobar Titulos para Nelson & Siegel</h2>

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
          <Button disabled={loader} color="primary mr-2" onClick={(e) => getFilterTitles(e)}>
            {!loader ? 'Buscar' :  <><Spinner color="white" size="sm" /></>}
          </Button>
        </Col>
      </Row>

      {subgrupos !== null && (
        <>
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
                          onCellClicked={onCellClicked}
                          columnDefs={columnsDef}
                        ></AgGridReact>
                      </div>
                      <br />
                    </div>
                  )
                })}

                <Row className="d-flex align-items-center justify-content-center mt-2 mb-4">
                  <Button className="mr-2" color="primary" 
                    onClick={(e) => addTitle(e)}>
                    Agregar título
                  </Button>
                  <Button
                    outline 
                    color="primary"
                  >
                    Ejecutar N & S
                  </Button>
                </Row>
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

export default CreateTitle
