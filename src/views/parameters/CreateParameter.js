import { useContext, useState, useEffect } from "react"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import {
  Row,
  Col,
  Button,
  Spinner,
  CustomInput
} from "reactstrap"

import Select from "react-select"

import "@styles/react/libs/charts/apex-charts.scss"

import { AgGridColumn, AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Swal from 'sweetalert2'

import { URL_BACK } from "../../contants"

const CreateParameter = () => {
  const { colors } = useContext(ThemeColors)

  const [loader, setLoader] = useState(false)
  //Analítica, Límites y Monitoreo
  const options = [
    { value: "Analítica", label: "Analítica" },
    { value: "Límites", label: "Límites RF" },
    { value: "Monitoreo", label: "Monitoreo" }
  ]

  const [btnDisable, setbtnDisable] = useState(false)

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

    const grupo = e.value
    setGrupo(grupo)
    const url = `${URL_BACK}parametros/plantilla-parametros?grupo=${grupo}`

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {
          setParameters(result.result.parametros)
          transFormData(result.result.parametros)
          setLoader(false)
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

  const saveParameters = () => {

    // console.log('data despues del cambio subgrupos -> ', subgrupos)
    setbtnDisable(true)

    const keys = Object.keys(subgrupos)

    let dataToUpdate = []

    keys.forEach(key => {
      dataToUpdate.push(subgrupos[key])
    })
    dataToUpdate = [].concat.apply([], dataToUpdate)

    console.log('data para actualizar -> ', dataToUpdate)

    let type = 'temporales'
    const toogleType = document.getElementById('switch-parmeter-type')
    if (toogleType.checked === true) {
      type = 'oficiales'
    }

    const body = {
      grupo,
      user: 'jlotero',
      tipo: type,
      parametros: dataToUpdate
    }

    const url = `${URL_BACK}parametros`

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 201) {
          Swal.fire(
            `${result.result.mensaje}`,
            `Versión: ${result.result.version} <br/>
             Tipo: ${result.result.tipo} <br/>
             Usuario: ${result.result.usuario} <br/>
             Fecha: ${result.result.fechaCreacion} <br/>`,
            'success'
          )
        } else {
          Swal.fire(
            `${result.error}`,
            `${result.detalle} <br/>`,
            'error'
          )
        }

        if (result.codigo === undefined) {
          Swal.fire(
            `${result.message}`,
            ``,
            'error'
          )
        }

        setbtnDisable(false)
      })

  }

  return (
    <div className="card">
      <div class="card-header">
        <h4 class="card-title">Crear parámetros</h4>
      </div>
      <div class="card-body">
        <div id="parameters-container mb-4">
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
                  <h4>Subgrupos</h4>

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
                              editable: true,
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

                  <h5 className="mt-2">Convertir parametros en oficiales</h5>
                  <CustomInput
                    className="custom-control-primary mb-4"
                    type="switch"
                    id="switch-parmeter-type"
                    name="oficiales"
                    inline
                  />

                  <div className="d-flex justify-content-center mt-4 mb-4">
                    <Button disabled={btnDisable} color="primary mr-2" onClick={saveParameters}>
                      {!btnDisable ? 'Guardar' : <><Spinner color="white" size="sm" /><span className="ml-50">Guardando...</span></>}
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
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateParameter
