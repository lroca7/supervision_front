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
import { fakeResponseIndicesRF, fakeResponseMonitoreoRF, groupBy } from "../../utility/Utils"
import TableSubgrupo from "./TableSubgrupo"
import { setSelectedParameter } from "./store/action"
import { useDispatch } from "react-redux"
import { buildData, getValues } from "./Utils"

const CreateParameter = () => {
  
  const dispatch = useDispatch()

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

  const [subgrupos, setSubgrupos] = useState([])

  const [open, setOpen] = useState(false)
  const [itemSelected, setItemSelected] = useState(null)

  const transFormData = (data) => {

    const group = buildData(data, grupo)
    
    setSubgrupos(group)
  }

  const getParameters = (e) => {
    setLoader(true)

    const grupo = e.value
    setGrupo(grupo)
    const url = `${URL_BACK}parametros/plantilla-parametros?grupo=${grupo}`

    // transFormData(fakeResponseIndicesRF.result.parametros)
    // transFormData(fakeResponseMonitoreoRF.result.parametros)
    // setLoader(false)
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {

          // setParameters(result.result.parametros)
          transFormData(result.result.parametros)
          setLoader(false)
        }
      })
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
  
  const handleCancel = () => {    
    setGrupo(null)
    setParameters([])
    setSubgrupos([])
  }

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
        <h4 className="card-title">Crear parámetros</h4>
      </div>
      <div className="card-body">
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
                                    <TableCell>Valor KO</TableCell>
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
                                           color="primary"
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

                  <TableSubgrupo 
                    itemSelected={itemSelected} 
                    toSetItemSelect={toSetItemSelect} 
                    grupo={grupo}
                    open={open}
                    handleClose={handleClose}
                  />

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
                    <Button disabled={btnDisable} outline color="secondary" onClick={handleCancel}>
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
