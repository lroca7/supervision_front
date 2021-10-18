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

import { columnsParametros, URL_BACK } from "../../contants"

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
    { value: "Límites RF", label: "Límites RF" },
    { value: "Límites RV", label: "Límites RV" },
    { value: "Indices RV", label: "Indices RV" },
    { value: "Indices RF", label: "Indices RF" },
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
   
    if (group['Posturas'] !== undefined) {
      if (group['Posturas'].length > 0) {
        const posturas = group['Posturas'].filter(g => {
          return g.key !== 'timeMinPosEnrPre'
        })
        posturas.map(p => {
          if (p.key === 'variPrecioMinPos') {
            p.nombre = 'Variación mínima'
          }
          if (p.key === 'variPrecioMaxPos') {
            p.nombre = 'Variación máxima'
          }
          return p
        })
        group['Posturas'] = posturas
      }
    }
    
   
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

  return (
    <div className="card">
      <div class="card-header">
        <h4 class="card-title">Parámetros oficiales</h4>
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
                        columnDefs={columnsParametros}
                      >
                      </AgGridReact>
                    </div>
                    <br />
                  </div>
                )
              })}
            </>
          ) : (
            <Alert color='secondary' className='p-2'>
              <p>No hay datos para visualizar </p>
            </Alert>
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
    </div>
    </div>
  )
}

export default ListParametersOficial
