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
  Alert
} from "reactstrap"

import Select from "react-select"

import "@styles/react/libs/charts/apex-charts.scss"

import { AgGridColumn, AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Swal from 'sweetalert2'

import { URL_BACK } from "../../contants"

import { useHistory } from "react-router-dom"

const CreateSprint = () => {
  const { colors } = useContext(ThemeColors)

  const [loader, setLoader] = useState(false)

  const initialErrorState = {
    status: false,
    codigo: '',
    error: '',
    detalle: ''
  }
  const [error, setError] = useState(initialErrorState)
  const [responseCorrida, setResponseCorrida] = useState(null)

  const [btnDisable, setbtnDisable] = useState(false)
  const [btnDisableLaunch, setbtnDisableLaunch] = useState(false)

  //Analítica, Límites y Monitoreo
  const options = [
    { value: "oficiales", label: "Oficiales" },
    { value: "temporales", label: "Temporales" }
  ]

  const [grupoParameter, setGrupoParameter] = useState('Hola')
  const [typeParameter, setTypeParameter] = useState(null)

  const [parameters, setParameters] = useState([])
  const [parametersInitial, setParametersInitial] = useState([])
  const [subgrupos, setSubgrupos] = useState([])
  const [dataCorrida, setDataCorrida] = useState(null)
  const [corrida, setCorrida] = useState({
    id: null,
    verParam: null,
    idFlujo: null,
    fecProceso: null
  })

  //Analítica, Límites RF o Límites RV, Indices RV, Indices RF
  const optionsType = [
    { value: "Analítica", label: "Analítica" },
    { value: "Límites RF", label: "Límites RF" },
    { value: "Límites RV", label: "Límites RV" },
    { value: "Indices RV", label: "Indices RV" },
    { value: "Indices RF", label: "Indices RF" }
  ]

  const history = useHistory()

  const inputEl = useRef(null)

  const transFormData = (data) => {
    const group = data.reduce((r, a) => {
      r[a.subgrupo] = [...(r[a.subgrupo] || []), a]
      return r
    }, {})
    console.log("subgrupos -> ", group)
    setSubgrupos(group)
  }

  const getParameters = (version) => {

    const url = `${URL_BACK}parametros?version=${version}`

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {
          setParameters(result.result.parametros)
          setParametersInitial(JSON.parse(JSON.stringify(result.result.parametros)))

          transFormData(result.result.parametros)

          setGrupoParameter(result.result.grupo)
          setTypeParameter({ value: result.result.tipo, label: result.result.tipo })

          setbtnDisable(false)
        }
      })
  }

  const createCorrida = (e) => {

    setbtnDisable(true)
    setLoader(true)

    // const selectTypeCorrida = document.getElementById("select-type-corrida")
    const tipoCorrida = e.value

    if (tipoCorrida.length > 0) {
      const body = {
        user: 'jlotero',
        tipoCorrida
      }
  
      const url = `${URL_BACK}corridas`
  
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(body)
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.codigo === 200 || result.codigo === 201) {
  
  
            getParameters(result.result.corrida.verParam)
            setDataCorrida(result.result.corrida)
            setCorrida({
              ...corrida,
              id: result.result.corrida.idCorrida,
              verParam: result.result.corrida.verParam,
              idFlujo: result.result.corrida.idFlujo,
              fecProceso: result.result.corrida.fecProceso
            })

            setLoader(false)
          }
          // setbtnDisable(false)
        })
        .catch((error) => {
          console.error(error)
          setbtnDisable(false)
          setLoader(false)
        })
    } else {
      Swal.fire(
        `Error`,
        `Debes seleccionar un tipo`,
        'error'
      )
    }
  }

  const onChangeTypeProccess = (event) => {
    setCorrida({
      ...corrida,
      idFlujo: parseInt(event.target.value)
    })
  }

  const onChangeFechaProceso = (event) => {
    setCorrida({
      ...corrida,
      fecProceso: event.target.value
    })
  }

  const verCorrida = () => {
    history.push({
      pathname: '/read/sprint',
      search: `?idCorrida=${corrida.id}`
    })
  }

  const saveParameters = async () => {


    const keys = Object.keys(subgrupos)

    let dataToUpdate = []

    keys.forEach(key => {
      dataToUpdate.push(subgrupos[key])
    })
    dataToUpdate = [].concat.apply([], dataToUpdate)


    let type = 'temporales'
    const toogleType = document.getElementById('switch-parmeter-type')
    if (toogleType.checked === true) {
      type = 'oficiales'
    }

    const body = {
      grupo: grupoParameter,
      user: 'jlotero',
      tipo: type,
      parametros: dataToUpdate
    }

    const url = `${URL_BACK}parametros`

    try {

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.codigo === 201) {

        setCorrida({
          ...corrida,
          verParam: result.result.version
        })
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

      return result

    } catch (error) {
      console.error(error)
    }
    return []

  }

  const updateCorrida = async (parameters) => {

    const body = {
      idCorrida: corrida.id,
      verParam: corrida.verParam,
      idFlujo: corrida.idFlujo,
      fecProceso: corrida.fecProceso
    }

    if (parameters !== undefined) {
      body.verParam = parameters.version
    }

    const url = `${URL_BACK}corridas?operacion=1`

    try {

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body)
      })

      const result = await response.json()
      if (result.codigo === 201 || result.codigo === 200) {
        console.log('result', result.result)
        status = 'success'
      } else {
        Swal.fire(
          `${result.error}`,
          `${result.detalle} <br/>`,
          'error'
        )

        status = 'error'
      }

      if (result.codigo === undefined) {
        Swal.fire(
          `${result.message}`,
          ``,
          'error'
        )
        status = 'error'
      }

      return result

    } catch (error) {
      console.error(error)

      Swal.fire(
        `Ha ocurrido un error al actualizar`,
        `${error}`,
        'error'
      )
      setbtnDisableLaunch(false)

    }
    return []

  }

  const executeCorrida = () => {

    const url = `${URL_BACK}corridas/ejecutar-corrida?idCorrida=${corrida.id}`

    fetch(url, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {
          console.log('result executeCorrida', result)
          Swal.fire(
            `${result.result.mensaje}`,
            ``,
            'success'
          )
          setResponseCorrida(result)
        } else {
          Swal.fire(
            `${result.error}`,
            `${result.detalle} <br/>`,
            'error'
          )
        }

        if (result.codigo === undefined) {
          Swal.fire(
            `${result.result}`,
            ``,
            'success'
          )
          Swal.fire(
            `${result.message}`,
            ``,
            'error'
          )

        }
        setbtnDisableLaunch(false)
      })
      .catch((error) => {
        console.error(error)
        Swal.fire(
          `Ha ocurrido un error al ejecutar`,
          `${error}`,
          'error'
        )

      })


  }


  const launchCorrida = async () => {

    setbtnDisableLaunch(true)
    if (JSON.stringify(parameters) !== JSON.stringify(parametersInitial)) {


      const stateSaveParameters = await saveParameters()
      if (stateSaveParameters.codigo === 201) {
        const stateUpdateCorrida = await updateCorrida(stateSaveParameters.result)
      }

    } else {
      const updateState = await updateCorrida()

      if (updateState.codigo === 201) {
        await executeCorrida()
      }

    }

  }

  useEffect(() => {


  }, [])

  return (
    <div className="card">
      <div class="card-header">
        <h4 class="card-title">Crear corrida 2</h4>
      </div>
      <div class="card-body">
        <div id="parameters-container mb-4">
          <div className="d-flex align-items-end">
            <Col md="6">
              <label>Seleccionar tipo:</label>
              <Select
                id="select-type-corrida"
                options={optionsType}
                placeholder="Seleccionar"
                onChange={(e) => createCorrida(e)}
              />
            </Col>

            {/* <Col md="2" className="d-flex align-items-center justify-content-center">
              <Button disabled={btnDisable} color="primary mr-2" onClick={createCorrida}>
                {!btnDisable ? 'Generar' : <><Spinner color="white" size="sm" /><span className="ml-50">Generando...</span></>}
              </Button>
            </Col> */}
          </div>
          
          {loader === true && 
            <Col md="12" className="d-flex justify-content-center mt-4 mb-4">
              <Button.Ripple color="primary">
                <Spinner color="white" size="sm" />
                <span className="ml-50">Generando...</span>
              </Button.Ripple>
            </Col>
          }

          {(dataCorrida !== null && Object.entries(subgrupos).length > 0) && (
            <>
              <Col md="6" className="mt-2">
                <h5 className="mt-2 mb-2">No de Corrida: {dataCorrida.idCorrida}</h5>
                <h5>Parámetros de corrida:</h5>
                <label>Usuario:</label>
                <Input type="text" name="user" id="user" value={dataCorrida.user} disabled />
                <label>Fecha creación:</label>
                <Input type="text" name="fecha" id="fecha" value={dataCorrida.fecCreacion} disabled />
                <label>Fecha del proceso:</label>
                <Input className="pickadate" type="date" name="date-corrida" id="date-corrida"
                  value={corrida.fecProceso}
                  onChange={onChangeFechaProceso} />

              </Col>

              <Col md="12" className="mt-2">
                <h4 className="mb-2">Flujo a ejecutar</h4>
                <p>Seleccione el tipo de corrida:</p>
                {corrida.idFlujo < 5 &&
                  <FormGroup id="radio-type" tag="fieldset" onChange={onChangeTypeProccess} >
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value={1}
                        checked={corrida.idFlujo === 1}
                      />
                      PBO/N&S - Márgenes - Valoración (manual y automático, FDS arranca directamente en valoración)
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value={2} checked={corrida.idFlujo === 2} />
                      PBO - Márgenes - Valoración (Solo manual)
                    </Label>
                  </FormGroup>
                  <FormGroup check >
                    <Label check>
                      <Input type="radio" name="radio1" value={3} checked={corrida.idFlujo === 3} />
                      Márgenes - Valoración
                    </Label>
                  </FormGroup>
                  <FormGroup check >
                    <Label check>
                      <Input type="radio" name="radio1" value={4} checked={corrida.idFlujo === 4} />
                      Valoración
                    </Label>
                  </FormGroup>
                </FormGroup>
                }
                {corrida.idFlujo ===  5 &&
                <FormGroup id="radio-type" tag="fieldset" onChange={onChangeTypeProccess}   >
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value={5}
                        checked={corrida.idFlujo === 5}
                      />
                      Límites RF
                    </Label>
                  </FormGroup>
                </FormGroup>
                }
                {corrida.idFlujo ===  6 &&
                <FormGroup id="radio-type" tag="fieldset" onChange={onChangeTypeProccess}  >
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value={6}
                        checked={corrida.idFlujo === 6}
                      />
                      Indices RF
                    </Label>
                  </FormGroup>
                </FormGroup>
                }
                {corrida.idFlujo ===  7 &&
                <FormGroup id="radio-type" tag="fieldset" onChange={onChangeTypeProccess}  >
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value={7}
                        checked={corrida.idFlujo === 7}
                      />
                      Límites RV
                    </Label>
                  </FormGroup>
                </FormGroup>
                }
                {corrida.idFlujo ===  8 &&
                <FormGroup id="radio-type" tag="fieldset" onChange={onChangeTypeProccess}  >
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value={8}
                        checked={corrida.idFlujo === 8}
                      />
                      Indices RV
                    </Label>
                  </FormGroup>
                </FormGroup>
                }
              </Col>

              <Col md="6" className="mt-2">
                <h4 className="mb-2">Parámetros de la corrida</h4>
                <label>Tipo:</label>
                <Select
                  id="select-group"
                  ref={inputEl}
                  options={options}
                  placeholder="Seleccionar"
                  value={typeParameter}
                  isDisabled={true}
                  onChange={(e) => getParameters(e)}
                />
                <label>Grupo: </label>
                <Input type="text" name="grupo" id="grupo" value={grupoParameter} disabled />
                <label>Versión:</label>
                <Input className="mb-2" type="text" name="version" id="version" value={dataCorrida.verParam} disabled />
              </Col>

              <Col md="12" className="mt-2">
                <h4 className="mb-2">Subgrupos</h4>
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
                                editable: true,
                                resizable: true
                              }}
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
                      <Button disabled={btnDisableLaunch} color="primary mr-2" onClick={launchCorrida}>
                        {!btnDisableLaunch ? 'Lanzar' : <><Spinner color="white" size="sm" /><span className="ml-50">Ejecutando...</span></>}
                      </Button>
                      <Button disabled={btnDisableLaunch} outline color="secondary">
                        Cancelar
                      </Button>
                    </div>

                  </>
                ) : (
                  <p>No hay datos para visualizar </p>
                )}
              </Col>
            </>
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

          {
            responseCorrida !== null && (
              <>
                <Col md="12">
                  <Alert color='success'>
                    <h4 className='alert-heading'>{responseCorrida.result.mensaje}</h4>
                    <div className='alert-body'>
                      <p>Procesos lanzados: </p>
                      {responseCorrida.result.procesosLanzados.length > 0 && (
                        responseCorrida.result.procesosLanzados.map(proceso => {
                          return <div>
                            <p>{proceso.processName}</p>
                          </div>
                        })
                      )}
                    </div>
                  </Alert>
                </Col>
                <div className="d-flex justify-content-center mt-4 mb-4">
                  <Button outline color="primary" onClick={verCorrida}>
                    Ver Corrida
                  </Button>
                </div>
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default CreateSprint
