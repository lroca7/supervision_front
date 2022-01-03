/* eslint-disable multiline-ternary */
import { useState, useRef } from "react"

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

import Swal from 'sweetalert2'

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"


import { buildData, getValues } from "../parameters/Utils"
import { milesFormat, milesFormatTwo, fakeResponseCrearCorrida } from "../../utility/Utils"
import { useDispatch, useSelector } from "react-redux"
import { setSelectedParameter } from "../parameters/store/action"
import { getSelectedParameter } from "../parameters/store/selector"
import { URL_BACK } from "../../contants"

import TableSubgrupo from "../parameters/TableSubgrupo"

import "../../assets/scss/app.scss"

const ExecuteSprint = () => {
  
  const dispatch = useDispatch()

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
 
  const [dataCorrida, setDataCorrida] = useState(null)
  const [corrida, setCorrida] = useState({
    id: null
  })
  
  const [verParam, setVerParam] = useState(null)
  const [idFlujo, setIdFlujo] = useState(null)
  const [fecProceso, setFecProceso] = useState(null)

  
  const [open, setOpen] = useState(false)
  const [itemSelected, setItemSelected] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

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
    } else {
      setBtnChangeParameters(false)
      Swal.fire(``, `Ingrese una versión de parametros valida`, "warning")
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
  const deleteItemParameter = (parameter) => {

    const tableUpdated = itemSelected.tabla.filter(item => {
      return parameter.id !== item.id
    })
    console.log('tableUpdated ->', tableUpdated)
    const newItemSelected = itemSelected
    newItemSelected.tabla = tableUpdated
    
    console.log('subgrupos -> ', subgrupos)
    if (itemSelected.key === 'confIndices') {
      const itemChanged = getValoresChanged(newItemSelected)
      console.log('Cambiar valor')      
      setItemSelected(itemChanged)

      const trItem = document.getElementById(`item-${parameter.id}`)
      if (trItem) {
        trItem.remove()
      }
      
    }
  }

  
  const addItemParameter = (parameter) => {

    setAddOpen(true)
    setOpen(false)
  
  }

  const saveAddItemParameter = () => {
    setAddOpen(false)
    
    const tableUpdated = itemSelected.tabla
    
    if (itemSelected.key === 'confIndices') {
      const addName = document.getElementById('add-name').value
      const addGroup = document.getElementById('add-group').value
      const addValue = document.getElementById('add-value').value
      const newRow = {
        id: `${addGroup}_${addName}_${addValue}`,
        grupo: addGroup,
        nombre: addName,
        rango: addValue
      }
      tableUpdated.push(newRow)

      const newItemSelected = itemSelected
      newItemSelected.tabla = tableUpdated
      
      setItemSelected(newItemSelected)

    }
    
    setOpen(true)


  }
  
  const updateGroup = (event, parameter) => {
    
    const newGroup = event.value

    const itemToUpdated = itemSelected.tabla.filter(item => {
      return parameter.id === item.id
    })
    
    itemToUpdated.grupo = newGroup
    
    if (itemSelected.key === 'confIndices') {
      const itemChanged = getValoresChanged(itemToUpdated)
      console.log('Cambiar valor')      
      setItemSelected(itemChanged)

    }
  } 

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Lanzar Corrida 1</h4>
      </div>
      <div className="card-body">
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
                                  {value.map((row, index) => (
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
                                          (row.key === 'confIndices' || row.key === 'porAjustadorLim_SP' || row.key === 'porAjustadorLim_BL') 
                                            ? <span className='special'>{row.valor}</span> 
                                            : <span className='normal'>{milesFormatTwo(row.valor)}</span>
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
                          <Button disabled={btnDisableLaunch} outline color="secondary" onClick={handleCandel}>
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
