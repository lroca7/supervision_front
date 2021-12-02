import { useContext, useState, useEffect } from "react"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import {
  Row,
  Col,
  Button,
  Spinner,
  CustomInput,
  Input,
  Modal, ModalBody, ModalHeader, ModalFooter 
} from "reactstrap"

import Select from "react-select"

import "@styles/react/libs/charts/apex-charts.scss"

import { AgGridColumn, AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Swal from 'sweetalert2'

import { columnsParametros, URL_BACK } from "../../contants"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import "../../assets/scss/app.scss"
import { groupBy } from "../../utility/Utils"

const CreateParameter = () => {
  const { colors } = useContext(ThemeColors)

  const [loader, setLoader] = useState(false)
  //Analítica, Límites y Monitoreo
  const options = [
    { value: "Analítica", label: "Analítica" },
    { value: "Límites RF", label: "Límites RF" },
    { value: "Límites RV", label: "Límites RV" },
    { value: "Indices RV", label: "Indices RV" },
    { value: "Indices RF", label: "Indices RF" },
    { value: "Monitoreo RF", label: "Monitoreo RF" },
    { value: "Monitoreo RV", label: "Monitoreo RV" }
  ]
  
  const [btnDisable, setbtnDisable] = useState(false)

  const [grupo, setGrupo] = useState(null)
  const [parameters, setParameters] = useState([])

  const [subgrupos, setSubgrupos] = useState([])

  const [open, setOpen] = useState(false)
  const [itemSelected, setItemSelected] = useState(null)

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
  
  const handleCandel = () => {    
    setGrupo(null)
    setParameters([])
    setSubgrupos([])
  }

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
                                        {row.valor}
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
                                    placeholder={itemSelected.valor}
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
                            onGridReady={onGridReady}
                            onCellValueChanged={onCellValueChanged}
                            columnDefs={columnsParametros}
                          >
                          </AgGridReact>
                        </div>
                        <br />
                      </div>
                    )
                  })} */}

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
                    <Button disabled={btnDisable} outline color="secondary" onClick={handleCandel}>
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
