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
  Alert,
  Modal, ModalBody, ModalHeader, ModalFooter 
} from "reactstrap"

import Select from "react-select"

import "@styles/react/libs/charts/apex-charts.scss"

import { AgGridColumn, AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Swal from 'sweetalert2'

import { columnsParametros, URL_BACK } from "../../contants"

import { useHistory } from "react-router-dom"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { groupBy, milesFormatTwo } from "../../utility/Utils"
import "../../assets/scss/app.scss"

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

  const transFormData = (data) => {
    const group = data.reduce((r, a) => {
      r[a.subgrupo] = [...(r[a.subgrupo] || []), a]
      return r
    }, {})
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
          transFormData(result.result.parametros)

          setGrupoParameter(result.result.grupo)
          setTypeParameter({ value: result.result.tipo, label: result.result.tipo })

          setbtnDisable(false)
          setLoader(false)
          setBtnChangeParameters(false)

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
              idFlujo: result.result.idFlujo,
              fecProceso: result.result.corrida.fecProceso
            })
            setVerParam(result.result.corrida.verParam)
            setIdFlujo(result.result.corrida.idFlujo)
            setFecProceso(result.result.corrida.fecProceso)

            console.log('Id flujo: ', result.result.corrida.idFlujo)

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

  const handleCandel = () => {  
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
    
    if (item.key ===  'confIndices') {
      const splitOne =  item.valor.split('/')
      const elementosFI = []
      splitOne.forEach(element => {
        const splitTwo = element.split(':')
        const grupos = splitTwo[2].split(' ')
        const elementos = []
        grupos.forEach((grupo, key) => {
          const obj = {
            id:  `${grupo}_${splitTwo[0]}_${splitTwo[1]}`,
            nombre: splitTwo[0],
            rango: splitTwo[1],
            grupo
          }
          elementosFI.push(obj)
        })
        
      })

      item['tabla'] = elementosFI
    }

    if (grupo !== 'Monitoreo RV') {
      if (item.key ===  'porAjustadorLim_SP' || item.key === 'porAjustadorLim_BL') {
        
        const itemValor = item.valor
        const splitOneSP =  itemValor.split('/')
        const elementosSP = []
        splitOneSP.forEach(element => {
          
          const splitTwoSP = element.split(':')
          const grupos = splitTwoSP[2].split(' ')
          
          grupos.forEach((grupo, key) => {
            
            const sGrupo = grupo.split('(')
            const nGrupo = sGrupo[0]
            
            
            const obj = {
              id:  `${grupo}_${splitTwoSP[0]}_${splitTwoSP[1]}`,
              nombre: splitTwoSP[0],
              rango: splitTwoSP[1],
              grupo: nGrupo
            }

            if (sGrupo[1] !== undefined) {
              const gPorcentaje = sGrupo[1].replace(')', '')
              obj.porcentaje = gPorcentaje
            }

            elementosSP.push(obj)
          })
          
        })

        item['tabla'] = elementosSP
      }
    }

    setItemSelected(item)
  }

  const getValoresChanged = () => {
    
    const itemChanged = itemSelected

    if (itemSelected.tabla !== undefined) {
      itemSelected.tabla.map(element => {
        const input = document.getElementById(element.id)
        const inputPorcentaje  = document.getElementById(`porcentaje_${element.id}`)
        
        if (input.value !== '') {
          element.rango = input.value
        }
        if (inputPorcentaje !== null) {
          if (inputPorcentaje.value !== '') {
            element.porcentaje = inputPorcentaje.value
          }
        }
        
      })
  
      const corto = itemSelected.tabla.filter(f => {
        return f.nombre === 'corto'
      })
      const largo = itemSelected.tabla.filter(f => {
        return f.nombre === 'largo'
      })
      const mediano = itemSelected.tabla.filter(f => {
        return f.nombre === 'mediano'
      })
      
      const cortos = groupBy(corto, "rango")
      const c = Object.keys(cortos).length
      
      const largos = groupBy(largo, "rango")
      const l = Object.keys(largos).length
  
      const medianos = groupBy(mediano, "rango")
      const m = Object.keys(medianos).length
  
      let valoresCorto = ''
      let valoresLargo = ''
      let valoresMediano = ''
      
      Object.entries(cortos).forEach(([key, value], kk) => {
        //corto:0-1095:MH_DOP MH_USD BC_DOP CORP_DOP CORP_USD/
        let stringCortos = ''
  
        if (kk < c - 1) {
          stringCortos = `corto:${key}:`
        } else {
          stringCortos = `/corto:${key}:`
        }     
        
        value.forEach((element, k) => {
          
          if (k === 0) {
            
            if (element.porcentaje) {
              stringCortos += `${element.grupo}(${element.porcentaje})`
            } else {
              stringCortos += `${element.grupo}`
            }
          } else {
            if (element.porcentaje) {
              stringCortos += ` ${element.grupo}(${element.porcentaje})`
            } else {
              stringCortos += ` ${element.grupo}`
            }            
          }
          
        })
        
        valoresCorto += stringCortos
      })
  
      Object.entries(largos).forEach(([key, value], kk) => {        
        
        let stringLargos = ''
  
        if (kk < l - 1) {
          stringLargos = `largo:${key}:`
        } else {
          stringLargos = `/largo:${key}:`
        }     
        
        value.forEach((element, k) => {
          
          if (k === 0) {
            stringLargos += `${element.grupo}`
          } else {
            stringLargos += ` ${element.grupo}`
          }
        })
        
        valoresLargo += stringLargos
      })
  
      Object.entries(medianos).forEach(([key, value], kk) => {        
        
        let stringMedianos = ''
  
        if (kk < m - 1) {
          stringMedianos = `mediano:${key}:`
        } else {
          stringMedianos = `/mediano:${key}:`
        }     
        
        value.forEach((element, k) => {
          if (k === 0) {
            stringMedianos += `${element.grupo}`
          } else {
            stringMedianos += ` ${element.grupo}`
          }
        })
        
        valoresMediano += stringMedianos
      })
  
      let valoresAll = `${valoresCorto}/${valoresMediano}/${valoresLargo}`
      valoresAll = valoresAll.replaceAll('//', '/')
      if (valoresAll.charAt(0) === '/') {
        valoresAll = valoresAll.slice(1)
      }
      itemChanged.valor = valoresAll
      setItemSelected(itemChanged)

    } else {
      const input = document.getElementById(itemSelected.key)
      if (input.value !== '') {
        itemChanged.valor = input.value
        setItemSelected(itemChanged)
      }

    }


  }

  const updateItemSelected = () => {
    getValoresChanged()
    setOpen(false)
  }

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
                    {/* {Object.entries(subgrupos).map(([key, value]) => {
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
                              columnDefs={columnsParametros}
                            >
                            </AgGridReact>
                          </div>
                          <br />
                        </div>
                      )
                    })} */}

{Object.entries(subgrupos).map(([key, value]) => {
                      
                      return (
                        <div>
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
                      <Button disabled={btnDisableLaunch} outline color="secondary" onClick={handleCandel}>
                        Cancelar
                      </Button>
                    </div>

                    <Modal isOpen={open} size='lg'>
                      <ModalHeader >
                        Editar
                      </ModalHeader>
                      <ModalBody>
                        {
                          itemSelected !== null && (
                            <Row className="modal-edit d-flex align-items-end justify-content-center">
                              <Col md="12">
                                <label>Nombre:</label>
                                <Input
                                  type="text"
                                  name="name"
                                  id="name"
                                  disabled={true}
                                  value={itemSelected.nombre}
                                />
                              </Col>
                              <Col md="12">
                                <label>Valor:</label>
                                
                                {
                                ((itemSelected.key === 'confIndices' || itemSelected.key === 'porAjustadorLim_SP' || itemSelected.key === 'porAjustadorLim_BL') && grupo !== 'Monitoreo RV') ? (
                                  <table className="table-edit">
                                    <thead>
                                      <tr>
                                        <th>Grupo</th>
                                        <th>Nombre</th>
                                        <th>Rango días</th>
                                        {
                                          (itemSelected.key === 'porAjustadorLim_SP' || itemSelected.key === 'porAjustadorLim_BL') && (
                                            <th>% Ajustador por criterio comisión</th>
                                          )
                                        }
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                        itemSelected.tabla.map(t => {
                                          return <tr className='valor'>
                                            <td>{t.grupo}</td>
                                            <td>{t.nombre}</td>
                                            <td>
                                              <Input id={t.id} placeholder={t.rango} />
                                            </td>
                                            {
                                              (itemSelected.key === 'porAjustadorLim_SP' || itemSelected.key === 'porAjustadorLim_BL') && (
                                                <td>
                                                  {/* {t.porcentaje} */}                                                  
                                                  <Input id={`porcentaje_${ t.id}`} placeholder={t.porcentaje} />
                                                </td>
                                              )
                                            }
                                          </tr>
                                        })
                                      }
                                    </tbody>
                                  </table>
                                ) : (
                                  <Input
                                    type="text"
                                    name="valor"
                                    id={itemSelected.key}
                                    // placeholder={itemSelected.valor}
                                    placeholder={
                                      (itemSelected.key === 'confIndices' || itemSelected.key === 'porAjustadorLim_SP' || itemSelected.key === 'porAjustadorLim_BL') ? itemSelected.valor : milesFormatTwo(itemSelected.valor)
                                    }
                                  />
                                )                              
                              }
                              </Col>
                              <Col md="12">
                                <label>Descripción:</label>
                                <textarea
                                  type="text"
                                  name="valor"
                                  id="valor"
                                  disabled={true}
                                  value={itemSelected.descripcion}
                                ></textarea>
                              </Col>                            
                            </Row>
                          )
                        }
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="primary"
                          onClick={() => { updateItemSelected() }}
                        >
                          Guardar
                        </Button>{" "}
                        <Button onClick={handleClose}>Cancelar</Button>
                      </ModalFooter>
                    </Modal>

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
