/* eslint-disable multiline-ternary */
import { useContext, useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Media,
  Button,
  Spinner,
  CardText,
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

const ExecuteSprint = () => {
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
  const [btnChangeParameters, setBtnChangeParameters] = useState(false)

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

  const [columnsDef, setColumnsDef] = useState([
    { field: "nombre", headerName: "Nombre", editable: false, maxWidth: 150 },
    { field: "valor", headerName: "Valor", maxWidth: 150 },
    { field: "descripcion", headerName: "Descripción", editable: false, minWidth: 100, wrapText: true, autoHeight: true }
  ])

  const [dataCorrida, setDataCorrida] = useState(null)
  const [corrida, setCorrida] = useState({
    id: null
    // verParam: null,
    // idFlujo: null,
    // fecProceso: null
  })
  
  const [verParam, setVerParam] = useState(null)
  const [idFlujo, setIdFlujo] = useState(null)
  const [fecProceso, setFecProceso] = useState(null)

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

    // debugger
    const url = `${URL_BACK}parametros?version=${version}`

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {
          // debugger
          setVerParam(version)
          setParameters(result.result.parametros)
          setParametersInitial(JSON.parse(JSON.stringify(result.result.parametros)))

          setSubgrupos([])
          transFormData(result.result.parametros)

          setGrupoParameter(result.result.grupo)
          setTypeParameter({ value: result.result.tipo, label: result.result.tipo })

          setbtnDisable(false)
          setLoader(false)
          setBtnChangeParameters(false)
        }
      })
      .catch(error => {
        console.error(error)
        setbtnDisable(false)
        setLoader(false)
        setBtnChangeParameters(false)
      })
  }

  const onChangeTypeProccess = (event) => {
    // setCorrida({
    //   ...corrida,
    //   idFlujo: parseInt(event.target.value)
    // })
    setIdFlujo(parseInt(event.target.value))
  }

  const onChangeFechaProceso = (event) => {
    // setCorrida({
    //   ...corrida,
    //   fecProceso: event.target.value
    // })
    setFecProceso(event.target.value)
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

        // setCorrida({
        //   ...corrida,
        //   verParam: result.result.version
        // })
        setVerParam(result.result.version)
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

    // const body = {
    //   idCorrida: corrida.id,
    //   verParam: corrida.verParam,
    //   idFlujo: corrida.idFlujo,
    //   fecProceso: corrida.fecProceso
    // }

    const body = {
      idCorrida: corrida.id,
      verParam,
      idFlujo,
      fecProceso
    }

    if (parameters !== undefined) {
      body.verParam = parameters.version
    }

    const url = `${URL_BACK}corridas`

    try {

      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.codigo === 201) {
        Swal.fire(
          `${result.result.mensaje}`,
          ``,
          'success'
        )

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


      setbtnDisableLaunch(false)


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
          console.log('result->', result.result)
          console.log('state->', responseCorrida)
          
          const rCorrida = result.result
          setResponseCorrida({
            ...responseCorrida,
            mensaje: rCorrida.mensaje,
            procesosLanzados: rCorrida.procesosLanzados
          })
          console.log('result->', rCorrida)
          console.log('state->', responseCorrida)
          
        } else {
          Swal.fire(
            `${result.error}`,
            `${result.detalle} <br/>`,
            'error'
          )
          setResponseCorrida(null)
        }

        if (result.codigo === undefined) {
          Swal.fire(
            `${result.message}`,
            ``,
            'error'
          )
          setResponseCorrida(null)
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
        setResponseCorrida(null)
      })


  }


  const launchCorrida = async () => {

    // debugger
    setbtnDisableLaunch(true)
    if (JSON.stringify(parameters) !== JSON.stringify(parametersInitial)) {

      // debugger
      const stateSaveParameters = await saveParameters()
      if (stateSaveParameters.codigo === 201) {
        const stateUpdateCorrida = await updateCorrida(stateSaveParameters.result)
      }

    } else {
      // debugger
      const updateState = await updateCorrida()

      if (updateState.codigo === 201) {
        // await executeCorrida()
      }

    }

  }

  const getCorrida = () => {

    const inputCorrida = document.getElementById("id_corrida")
    const idCorrida = inputCorrida.value.trim()

    if (idCorrida.length > 0) {

      setbtnDisable(true)

      const url = `${URL_BACK}corridas?idCorrida=${idCorrida}`

      fetch(url, {
        method: "GET"
      })
        .then((response) => response.json())
        .then((result) => {
          // debugger
          if (result.codigo === 201 || result.codigo === 200) {

            if (result.result.estado === 'INI') {
              getParameters(result.result.verParam)
              setDataCorrida(result.result)
              setCorrida({
                ...corrida,
                id: result.result.idCorrida,
                verParam: result.result.verParam,
                idFlujo: result.result.idFlujo,
                fecProceso: result.result.fecProceso
              })
              setVerParam(result.result.verParam)
              setIdFlujo(result.result.idFlujo)
              setFecProceso(result.result.fecProceso)

            } else {
              Swal.fire(`Error`, `La corrida no se puede lanzar <br/>`, "error")
              setLoader(false)
              setbtnDisable(false)
            }

          } else {

            Swal.fire(`${result.error}`, `${result.detalle} <br/>`, "error")
            setLoader(false)
            setbtnDisable(false)
          }

          if (result.codigo === undefined) {
            Swal.fire(`${result.message}`, ``, "error")
            setLoader(false)
            setbtnDisable(false)
          }

        })
        .catch((error) => {
          console.error(error)
          Swal.fire(`Ha ocurrido un error al ejecutar`, `${error}`, "error")
          setLoader(false)
          setbtnDisable(false)
        })
    }
  }

  const searchParameters = () => {

    setBtnChangeParameters(true)

    const inputVersion = document.getElementById('version')
    const version = inputVersion.value
    
    if (version.length > 0) {
      getParameters(version)
    }

  }

  const handleCandel = () => {    

    setGrupoParameter('')
    setTypeParameter(null)  
    setParameters([])
    setParametersInitial([])
    setSubgrupos([])  
    setDataCorrida(null)
    setCorrida({
      id: null
    })    
    setVerParam(null)
    setIdFlujo(null)
    setFecProceso(null)

  }


  return (
    <div className="card">
      <div class="card-header">
        <h4 class="card-title">Lanzar Corrida</h4>
      </div>
      <div class="card-body">
        <div id="parameters-container mb-4">

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
              {!btnDisableLaunch && (
                <Button disabled={btnDisable} color="primary mr-2" onClick={(e) => getCorrida(e)}>
                  {!btnDisable ? 'Buscar' : <><Spinner color="white" size="sm" /></>}
                </Button>
              )}
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
            <div className="mt-4">
              {(dataCorrida !== null && Object.entries(subgrupos).length > 0) && (
                <>
                  <Col md="6" className="mt-2">
                    <h5 className="mt-2 mb-2">No de Corrida: {dataCorrida.idCorrida}</h5>
                    <h5>Parámetros de corrida:</h5>
                    <label>Tipo:</label>
                    <Input type="text" name="type" id="type" value={dataCorrida.tipoCorrida} disabled />
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
                  </Col>
                  <Col md="12" className="mt-2">
                    <label>Versión:</label>
                    <div className="d-flex">
                      <Col md="6" className="m-0 pl-0">
                        <Input className="mb-2" type="text" name="version" id="version" placeholder={verParam} /> 
                      </Col>
                      <Col md="4" className="m-0 pl-0">
                        <Button disabled={btnChangeParameters} color="primary mr-2" outline onClick={(e) => searchParameters(e)}>
                          {!btnChangeParameters ? 'Cambiar parametros' : <><Spinner color="blue" size="sm" /></>}
                        </Button>
                      </Col>                     
                    </div>                  
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
                                  columnDefs={columnsDef}
                                >
                                  {/* <AgGridColumn field="nombre" editable="false"></AgGridColumn>
                                  <AgGridColumn field="valor"></AgGridColumn>
                                  <AgGridColumn field="descripcion" editable="false"></AgGridColumn> */}
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
                          <Button disabled={btnDisableLaunch} outline color="secondary" onClick={handleCandel}>
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
            </div>
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
            )
          }

        </div>
      </div>
    </div>
  )
}

export default ExecuteSprint
