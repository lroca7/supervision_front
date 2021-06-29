import { useContext, useState, useEffect, useRef } from "react"
import { List } from "react-feather"
import { kFormatter } from "@utils"
import Avatar from "@components/avatar"
import Timeline from "@components/timeline"
import AvatarGroup from "@components/avatar-group"
import jsonImg from "@src/assets/images/icons/json.png"
import InvoiceList from "@src/views/apps/invoice/list"
import ceo from "@src/assets/images/portrait/small/avatar-s-9.jpg"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import Sales from "@src/views/ui-elements/cards/analytics/Sales"
import AvgSessions from "@src/views/ui-elements/cards/analytics/AvgSessions"
import CardAppDesign from "@src/views/ui-elements/cards/advance/CardAppDesign"
import SupportTracker from "@src/views/ui-elements/cards/analytics/SupportTracker"
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
  Input
} from "reactstrap"
import OrdersReceived from "@src/views/ui-elements/cards/statistics/OrdersReceived"
import CardCongratulations from "@src/views/ui-elements/cards/advance/CardCongratulations"
import SubscribersGained from "@src/views/ui-elements/cards/statistics/SubscribersGained"

import Select from "react-select"

import "@styles/react/libs/charts/apex-charts.scss"

import { render } from "react-dom"
import { AgGridColumn, AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Swal from 'sweetalert2'
import { data } from "../tables/data-tables/data"

const CreateSprint = () => {
  const { colors } = useContext(ThemeColors)

  const URL_BASE =
    "https://zaemfz4o3j.execute-api.us-east-1.amazonaws.com/desa/desa-services_sync/"
  
  
  const initialErrorState = {
    status: false,
    codigo: '',
    error: '',
    detalle: ''
  }
  const [error, setError] = useState(initialErrorState)
  const [responseCorridaSucces, setResponseCorridaSucces] = useState(null)

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
    id : null,
    verParam : null,
    idFlujo : null,
    fecProceso: null
  })

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

    const url = `${URL_BASE}parametros?version=${version}`

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

  const createCorrida = () => {

    setbtnDisable(true)

    const body = {
      user: 'jlotero'
    }

    const url = `${URL_BASE}corridas`

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {

          
          getParameters(result.result.corrida.verParam)
          setDataCorrida(result.result.corrida)       
          setCorrida({
            ...corrida,
            id: result.result.corrida.idCorrida,
            verParam: result.result.corrida.verParam,
            idFlujo : result.result.corrida.idFlujo,
            fecProceso: result.result.corrida.fecProceso
          })
        }
        // setbtnDisable(false)
      })
      .catch((error) => {
        console.error(error)
        setbtnDisable(false)
      })

  }

  const onChangeTypeProccess = (event) => {
    setCorrida({
      ...corrida,
      idFlujo: event.target.value
    })
  }

  const onChangeFechaProceso = (event) => {
    setCorrida({
      ...corrida,
      fecProceso: event.target.value
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

    const url = `${URL_BASE}parametros`

    try {

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.codigo === 201) {
        
        debugger
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

    debugger
    const body = {
      idCorrida : corrida.id,
      verParam : parameters.version,
      idFlujo : corrida.idFlujo,
      fecProceso: corrida.fecProceso
    }

    const url = `${URL_BASE}corridas`


    try {

      const response = await  fetch(url, {
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

    const url = `${URL_BASE}corridas/ejecutar-corrida?idCorrida=${corrida.id}`

    fetch(url, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((result) => {        
        if (result.codigo === 200) {
          
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
      alert('Crear nuevos parametros')

      debugger
      const stateSaveParameters = await saveParameters()
      if (stateSaveParameters.codigo ===  201) {
        const stateUpdateCorrida = await updateCorrida(stateSaveParameters.result)
      }

    } else {
      const updateStatus = await updateCorrida()

      if (updateStatus === 'success') {
        await executeCorrida()
      }

    }

  }

  useEffect(() => {


  }, [])

  return (
    <div id="parameters-container mb-4">
      <h2 className="mb-2">Crear corrida</h2>
      <Col md="12" className="d-flex align-items-center justify-content-center">   
        <Button disabled={btnDisable} color="primary mr-2" onClick={createCorrida}>
          {!btnDisable ? 'Generar' : <><Spinner color="white" size="sm" /><span className="ml-50">Generando...</span></>}
        </Button>
      </Col>   

      {(dataCorrida !== null && Object.entries(subgrupos).length > 0) && (
        <>
          <Col md="6" className="mt-2">  
            <h5 className="mt-2 mb-2">No de Corrida: {dataCorrida.idCorrida}</h5>
            <h5>Parámetros de corrida:</h5>
            <label>Usuario:</label>
            <Input type="text" name="user" id="user" value={dataCorrida.user} disabled/>
            <label>Fecha creación:</label>
            <Input type="text" name="fecha" id="fecha" value={dataCorrida.fecCreacion} disabled/>
            <label>Fecha del proceso:</label>
            <Input className="pickadate" type="date"  name="date-corrida" id="date-corrida" isRequired={true} 
              value={corrida.fecProceso}
              onChange={onChangeFechaProceso}/>
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
            <Input type="text" name="version" id="version" value={dataCorrida.verParam} disabled/>
          </Col>

          <Col md="12" className="mt-2">
            <h5>Seleccione el tipo de corrida:</h5>
            <FormGroup id="radio-type" tag="fieldset" onChange={onChangeTypeProccess}  >
              <FormGroup check>
                <Label check>
                  <Input type="radio" name="radio1" value="1" />{' '}
                  PBO/N&S - Márgenes - Evaluación (manual y automático, FDS arranca directamente en valoración)
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="radio" name="radio1" value="2" />{' '}
                  PBO - Márgenes - Valoración (Solo manual)
                </Label>
              </FormGroup>
              <FormGroup check >
                <Label check>
                  <Input type="radio" name="radio1" value="3"  />{' '}
                  Márgenes - Valoración
                </Label>
              </FormGroup>
              <FormGroup check >
                <Label check>
                  <Input type="radio" name="radio1" value="3"  />{' '}
                  Valoración
                </Label>
              </FormGroup>
            </FormGroup>
          </Col>

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
                  {!btnDisableLaunch ? 'Lanzar' :  <><Spinner color="white" size="sm" /><span className="ml-50">Ejecutando...</span></>}
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
              {/* <h4 className='alert-heading'>Lorem ipsum dolor sit amet</h4> */}
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
        responseCorridaSucces !== null && (
          <Col md="12">
            <Alert color='success'>
              <h4 className='alert-heading'>{responseCorridaSucces.result.mensaje}</h4>
              <div className='alert-body'>
                <p>Procesos lanzados: </p>
                {responseCorridaSucces.result.procesosLanzados.length > 0 && (
                  responseCorridaSucces.result.procesosLanzados.map(proceso => {
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
  )
}

export default CreateSprint
