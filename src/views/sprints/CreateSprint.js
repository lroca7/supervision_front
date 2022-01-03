import { useContext, useState, useRef } from "react"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import { useHistory } from "react-router-dom"

import {
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
import Swal from 'sweetalert2'

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"


import { buildData, getValues } from "../parameters/Utils"
import { fakeResponseCrearCorrida, milesFormatTwo } from "../../utility/Utils"
import { useDispatch, useSelector } from "react-redux"
import { setSelectedParameter } from "../parameters/store/action"
import { getSelectedParameter } from "../parameters/store/selector"
import { URL_BACK } from "../../contants"

import TableSubgrupo from "../parameters/TableSubgrupo"

import "../../assets/scss/app.scss"

const CreateSprint = () => {
  const dispatch = useDispatch()

  const [loadingCreateCorrida, setLoadingCreateCorrida] = useState(false)
  
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

  const [grupoParameter, setGrupoParameter] = useState('')
  const [typeParameter, setTypeParameter] = useState(null)

  const [parameters, setParameters] = useState([])
  const [parametersInitial, setParametersInitial] = useState([])
  const [subgrupos, setSubgrupos] = useState([])
  const [dataCorrida, setDataCorrida] = useState(null)
  const [corrida, setCorrida] = useState({
    id: null
    // verParam: null,
    // idFlujo: null,
    // fecProceso: null
  })

  //Analítica, Límites RF o Límites RV, Indices RV, Indices RF
  const optionsType = [
    { value: "Analítica", label: "Analítica" },
    { value: "Límites RF", label: "Límites RF" },
    { value: "Límites RV", label: "Límites RV" },
    { value: "Indices RV", label: "Indices RV" },
    { value: "Indices RF", label: "Indices RF" }
  ]

  const [verParam, setVerParam] = useState(null)
  const [idFlujo, setIdFlujo] = useState(1)
  const [fecProceso, setFecProceso] = useState(null)

  const [btnChangeParameters, setBtnChangeParameters] = useState(false)

  const [open, setOpen] = useState(false)
  const [itemSelected, setItemSelected] = useState(null)

  const history = useHistory()

  const inputEl = useRef(null)

  const parametrosRedux = useSelector(getSelectedParameter)

  const transFormData = (data) => {

    const group = buildData(data, grupoParameter)
    
    setSubgrupos(group)
  }

  const getParameters = (version) => {

    const url = `${URL_BACK}parametros?version=${version}`

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {
          // setParameters(result.result.parametros)
          // setParametersInitial(JSON.parse(JSON.stringify(result.result.parametros)))

          // transFormData(result.result.parametros)

          // setGrupoParameter(result.result.grupo)
          // setTypeParameter({ value: result.result.tipo, label: result.result.tipo })

          // setbtnDisable(false)


          //////////////////

          setVerParam(version)
          setParameters(result.result.parametros)
          setParametersInitial(JSON.parse(JSON.stringify(result.result.parametros)))

          setSubgrupos([])
          setGrupoParameter(result.result.grupo)

          transFormData(result.result.parametros)

          
          setTypeParameter({ value: result.result.tipo, label: result.result.tipo })

          setbtnDisable(false)
          
          setBtnChangeParameters(false)

          setLoadingCreateCorrida(false)
        }
      })
  }

  const createCorrida = async (e) => {
    setbtnDisable(true)
    setLoadingCreateCorrida(true)
      

    // const selectTypeCorrida = document.getElementById("select-type-corrida")
    const tipoCorrida = e.value

    if (tipoCorrida.length > 0) {
      const body = {
        user: 'jlotero',
        tipoCorrida
      }
  
      // const result = fakeResponseCrearCorrida
      // await getParameters(result.result.corrida.verParam)
      // setDataCorrida(result.result.corrida)
      // setCorrida({
      //   ...corrida,
      //   id: result.result.corrida.idCorrida,
      //   verParam: result.result.corrida.verParam,
      //   idFlujo: result.result.idFlujo,
      //   fecProceso: result.result.corrida.fecProceso
      // })
      // setVerParam(result.result.corrida.verParam)
      // setIdFlujo(result.result.corrida.idFlujo)
      // setFecProceso(result.result.corrida.fecProceso)
          
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
              idFlujo: result.result.idFlujo,
              fecProceso: result.result.corrida.fecProceso
            })
            setVerParam(result.result.corrida.verParam)
            setIdFlujo(result.result.corrida.idFlujo)
            setFecProceso(result.result.corrida.fecProceso)

            console.log('Id flujo: ', result.result.corrida.idFlujo)

          }
          // setbtnDisable(false)
        })
        .catch((error) => {
          console.error(error)
          setbtnDisable(false)
          setLoadingCreateCorrida(false)
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
    //   idFlujo: idFlujo,
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

      setbtnDisableLaunch(false)
      
      Swal.fire(
        `Ha ocurrido un error al actualizar`,
        `${error}`,
        'error'
      )
      

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

    const parameters = JSON.parse(JSON.stringify(parametrosRedux))
    delete parameters['valuesInArray']

    /* Si los parametros cambiaron se guarda la nueva version de parametros
     * se actualiza la corrida y se lanza la corrida
     */
    if (JSON.stringify(parameters) !== JSON.stringify(parametersInitial)) {

      const stateSaveParameters = await saveParameters()
      if (stateSaveParameters.codigo === 201) {
        const stateUpdateCorrida = await updateCorrida(stateSaveParameters.result)

        if (stateUpdateCorrida.codigo === 201) {
          await executeCorrida()
        }

      }

    } else { 
      const updateState = await updateCorrida()

      if (updateState.codigo === 201) {
        await executeCorrida()
      }

    }

  }

  const handleCancel = () => {  
    setResponseCorrida(null)  
    setGrupoParameter('')
    setTypeParameter(null)  
    setParameters([])
    setParametersInitial([])
    setSubgrupos([])
    setDataCorrida(null)
    setCorrida({
      id: null,
      verParam: null,
      idFlujo: null,
      fecProceso: null
    })
  }

  const searchParameters = () => {

    setBtnChangeParameters(true)

    const inputVersion = document.getElementById('version')
    const version = inputVersion.value
    
    if (version.length > 0) {
      getParameters(version)
    } else {
      setBtnChangeParameters(false)
      Swal.fire(``, `Ingrese una versión de parametros valida`, "warning")
    }

  }

  // LO NUEVO 
  const handleClose = () => setOpen(false)

  const editItemTable = (item) => {   
    
    setOpen(true)
    
    dispatch(setSelectedParameter(item))
  }

  const getValoresChanged = (itemSelected) => {
    
    const itemChanged = getValues(itemSelected)
    
    return itemChanged

  }

  const toSetItemSelect = (itemToSet) => {

    if (itemToSet.key === 'confIndices') {
      const itemChanged = getValoresChanged(itemToSet)

      const copySubgrupos = JSON.parse(JSON.stringify(subgrupos))
      
      copySubgrupos["Configuración de índices"][0] = itemChanged
      setSubgrupos(copySubgrupos)
    }

    if (itemToSet.key === 'porAjustadorLim_SP') {
      
      const itemChangedMonitoreo = getValoresChanged(itemToSet)
      
      const copySubgruposMonitoreo = JSON.parse(JSON.stringify(subgrupos))
      
      copySubgruposMonitoreo["Sistema SIOPEL"][1] = itemChangedMonitoreo
      setSubgrupos(copySubgruposMonitoreo)
    }

    if (itemToSet.key === 'porAjustadorLim_BL') {
      
      const itemChangedMonitoreo = getValoresChanged(itemToSet)
      
      const copySubgruposMonitoreo = JSON.parse(JSON.stringify(subgrupos))
      
      copySubgruposMonitoreo["Sistema BLOOMBERG"][1] = itemChangedMonitoreo
      setSubgrupos(copySubgruposMonitoreo)
    }
   
  }

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Crear corrida 2</h4>
      </div>
      <div className="card-body">
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
          
          {loadingCreateCorrida === true && 
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
                  // value={corrida.fecProceso}
                  value={fecProceso}
                  onChange={onChangeFechaProceso} />

              </Col>

              <Col md="12" className="mt-2">
                <h4 className="mb-2">Flujo a ejecutar</h4>
                {idFlujo < 5 &&
                  <FormGroup id="radio-type" tag="fieldset" onChange={onChangeTypeProccess} >
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value={1}
                        checked={idFlujo === 1}
                      />
                      PBO/N&S - Márgenes - Valoración (manual y automático, FDS arranca directamente en valoración)
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value={2} checked={idFlujo === 2} />
                      PBO - Márgenes - Valoración (Solo manual)
                    </Label>
                  </FormGroup>
                  <FormGroup check >
                    <Label check>
                      <Input type="radio" name="radio1" value={3} checked={idFlujo === 3} />
                      Márgenes - Valoración
                    </Label>
                  </FormGroup>
                  <FormGroup check >
                    <Label check>
                      <Input type="radio" name="radio1" value={4} checked={idFlujo === 4} />
                      Valoración
                    </Label>
                  </FormGroup>
                </FormGroup>
                }
                {idFlujo ===  5 &&
                <FormGroup id="radio-type" tag="fieldset" onChange={onChangeTypeProccess}   >
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value={5}
                        checked={idFlujo === 5}
                      />
                      Límites RF
                    </Label>
                  </FormGroup>
                </FormGroup>
                }
                {idFlujo ===  6 &&
                <FormGroup id="radio-type" tag="fieldset" onChange={onChangeTypeProccess}  >
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value={6}
                        checked={idFlujo === 6}
                      />
                      Indices RF
                    </Label>
                  </FormGroup>
                </FormGroup>
                }
                {idFlujo ===  7 &&
                <FormGroup id="radio-type" tag="fieldset" onChange={onChangeTypeProccess}  >
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value={7}
                        checked={idFlujo === 7}
                      />
                      Límites RV
                    </Label>
                  </FormGroup>
                </FormGroup>
                }
                {idFlujo ===  8 &&
                <FormGroup id="radio-type" tag="fieldset" onChange={onChangeTypeProccess}  >
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" value={8}
                        checked={idFlujo === 8}
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
                {/* <label>Versión 1:</label>
                <Input className="mb-2" type="text" name="version" id="version" value={dataCorrida.verParam} disabled /> */}

                
              </Col>
              <Col md="12" className="mt-2">
                <label>Versión:</label>
                <div className="d-flex">
                  <Col md="6" className="m-0 pl-0">
                    <Input className="mb-2" type="text" name="version" id="version" placeholder={verParam} /> 
                  </Col>
                  <Col md="4" className="m-0 pl-0">
                    <Button disabled={btnChangeParameters} color="primary mr-2" outline 
                      onClick={(e) => searchParameters(e)}
                    >
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
                        <div key={`subgrupo_${key}`}>
                          <h5>{key}</h5>
                          <br />
                          {value.length > 0 && (
                            <TableContainer component={Paper}>
                              <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                                className="table-parametros"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>Acciones</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {value.map((row) => (
                                    <TableRow
                                      key={row.key}
                                      sx={{
                                        "&:last-child td, &:last-child th": {
                                          border: 0
                                        }
                                      }}
                                    >
                                      <TableCell component="th" scope="row">
                                        {row.nombre}
                                      </TableCell>
                                      <TableCell>
                                        {/* {row.valor} */}
                                        {
                                          (row.key === 'confIndices' || row.key === 'porAjustadorLim_SP' || row.key === 'porAjustadorLim_BL') ? <span className='special'>{row.valor}</span> : <span className='normal'>{milesFormatTwo(row.valor)}</span>
                                        }
                                      </TableCell>
                                      <TableCell>
                                        {row.descripcion}
                                      </TableCell>
                                      <TableCell>
                                        <Button
                                          variant="contained"
                                          onClick={() => editItemTable(row)}
                                        >
                                          Editar
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}

                      
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
                      <Button disabled={btnDisableLaunch} outline color="secondary" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </div>

                    <TableSubgrupo 
                      itemSelected={itemSelected} 
                      toSetItemSelect={toSetItemSelect} 
                      grupo={grupoParameter}
                      open={open}
                      handleClose={handleClose}
                      readOnly={false}
                    />

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
