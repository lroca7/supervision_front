import { useContext, useState, useEffect } from "react"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import {
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Input
} from "reactstrap"
import Select from "react-select"
import "@styles/react/libs/charts/apex-charts.scss"
import { AgGridColumn, AgGridReact } from "ag-grid-react"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import { URL_BACK } from "../../contants"

const ListParametersOficial = () => {
  const { colors } = useContext(ThemeColors)

  const initialErrorState = {
    status: false,
    codigo: '',
    error: '',
    detaller: ''
  }
  const [error, setError] = useState(initialErrorState)

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
    
    const url = `${URL_BACK}parametros?grupo=${grupo}`

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {

          setGrupo(result.result)

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
      .catch(error => {
        console.error(error)
        setLoader(false)
        setSubgrupos([])
      })
  }

  useEffect(() => {
    // getParameters()
    // console.log('data inicial -> ', students)
  }, [])


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

          {
            grupo !== null && (
              <>
                <h4 className="mt-2 mb-2">Información general</h4>
                <p>Grupo: {grupo.grupo}</p>
                <p>Fecha: {grupo.fecha}</p>
                <p>Usuario: {grupo.user}</p>
                <p>Versión: {grupo.version}</p>
              </>
            )
          }

          {Object.entries(subgrupos).length > 0 ? (
            <>
              <h4 className='mt-2 mb-2'>Subgrupos</h4>

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
                        // onGridReady={onGridReady}
                        // onCellValueChanged={onCellValueChanged}
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
              <div className='alert-body'>
                <p>{error.status} : {error.codigo}</p>
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
