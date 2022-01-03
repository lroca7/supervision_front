import { useContext, useState, useEffect } from "react"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import { 
  Row, Col, Button, Spinner, Alert, Input, 
  Modal, ModalBody, ModalHeader, ModalFooter 
} from "reactstrap"
import Select from "react-select"
import "@styles/react/libs/charts/apex-charts.scss"
import { AgGridColumn, AgGridReact } from "ag-grid-react"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import { columnsParametros, URL_BACK } from "../../contants"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import "../../assets/scss/app.scss"
import { groupBy, milesFormat, milesFormatTwo } from "../../utility/Utils"
import TableSubgrupo from "./TableSubgrupo"
import { useDispatch } from "react-redux"
import { setSelectedParameter } from "./store/action"
import { buildData, getValues } from "./Utils"

const ListParametersOficial = () => {
  const dispatch = useDispatch()

  const { colors } = useContext(ThemeColors)

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  }

  const initialErrorState = {
    status: false,
    codigo: "",
    error: "",
    detaller: ""
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
  const [rows, setRows] = useState([])
  const [open, setOpen] = useState(false)
  const [itemSelected, setItemSelected] = useState(null)

  const transFormDataOld = (data) => {
    const group = data.reduce((r, a) => {
      r[a.subgrupo] = [...(r[a.subgrupo] || []), a]
      return r
    }, {})
    

    if (group["Posturas"] !== undefined) {
      if (group["Posturas"].length > 0) {
        const posturas = group["Posturas"].filter((g) => {
          return g.key !== "timeMinPosEnrPre"
        })
        posturas.map((p) => {
          if (p.key === "variPrecioMinPos") {
            p.nombre = "Variación mínima"
          }
          if (p.key === "variPrecioMaxPos") {
            p.nombre = "Variación máxima"
          }
          return p
        })
        group["Posturas"] = posturas
      }
    }
    console.log("subgrupos -> ", group)

    setSubgrupos(group)
  }

  const transFormData = (data) => {

    const group = buildData(data, grupo)
    
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
          
          setRows(result.result.parametros)
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
      .catch((error) => {
        console.error(error)
        setLoader(false)
        setSubgrupos([])
      })
  }

  const handleClose = () => setOpen(false)

  const showItemTable = (item) => {
    
    setOpen(true)

    dispatch(setSelectedParameter(item))
    
    // console.log("Item -> ", item)
    

    // if (item.key ===  'confIndices') {
    //   const splitOne =  item.valor.split('/')
    //   const elementosFI = []
    //   splitOne.forEach(element => {
    //     const splitTwo = element.split(':')
    //     const grupos = splitTwo[2].split(' ')
    //     const elementos = []
    //     grupos.forEach((grupo, key) => {
    //       const obj = {
    //         id:  `${grupo}_${splitTwo[0]}_${splitTwo[1]}`,
    //         nombre: splitTwo[0],
    //         rango: splitTwo[1],
    //         grupo
    //       }
    //       elementosFI.push(obj)
    //     })
        
    //   })

    //   item['tabla'] = elementosFI
    // }

    // if (item.key ===  'porAjustadorLim_SP' || item.key === 'porAjustadorLim_BL') {
      
    //   const itemValor = item.valor
    //   const splitOneSP =  itemValor.split('/')
    //   const elementosSP = []
    //   splitOneSP.forEach(element => {
        
    //     const splitTwoSP = element.split(':')
    //     const grupos = splitTwoSP[2].split(' ')
        
    //     grupos.forEach((grupo, key) => {
    //       const sGrupo = grupo.split('(')
    //       const nGrupo = sGrupo[0]
    //       const gPorcentaje = sGrupo[1].replace(')', '')
    //       const obj = {
    //         id:  `${grupo}_${splitTwoSP[0]}_${splitTwoSP[1]}`,
    //         nombre: splitTwoSP[0],
    //         rango: splitTwoSP[1],
    //         grupo: nGrupo,
    //         porcentaje: gPorcentaje
    //       }
    //       elementosSP.push(obj)
    //     })
        
    //   })

    //   item['tabla'] = elementosSP
    // }

    // setItemSelected(item)

    // return item
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

  useEffect(() => {
    // getParameters()
    // console.log('data inicial -> ', students)
  }, [])

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Parámetros oficiales</h4>
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
              {grupo !== null && (
                <>
                  <h4 className="mt-2 mb-2">Información general</h4>
                  <p>Grupo: {grupo.grupo}</p>
                  <p>Fecha: {grupo.fecha}</p>
                  <p>Usuario: {grupo.user}</p>
                  <p>Versión: {grupo.version}</p>
                </>
              )}

              {Object.entries(subgrupos).length > 0 ? (
                <>
                  <h4 className="mt-2 mb-2">Subgrupos</h4>

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
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell>Nombre</TableCell>
                                  <TableCell>Valor</TableCell>
                                  <TableCell>
                                    Descripción
                                  </TableCell>
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
                                      {
                                        (row.key === 'confIndices' || row.key === 'porAjustadorLim_SP' || row.key === 'porAjustadorLim_BL') ? <span className='special'>{row.valor}</span> : <span className='normal'>{milesFormatTwo(row.valor)}</span>
                                      }
                                      {/* {milesFormat(row.valor)} */}
                                    </TableCell>
                                    <TableCell>
                                      {row.descripcion}
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="contained"
                                        onClick={() => showItemTable(row)}
                                      >
                                        Ver
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}

                        {/* <div
                      className="ag-theme-alpine"
                      style={{ height: 200, width: "100%" }}
                    >
                      <AgGridReact
                        rowData={value}
                        defaultColDef={{
                          flex: 1,
                          minWidth: 110,
                          // editable: false,
                          editable: true,
                          resizable: true
                        }}
                        columnDefs={columnsParametros}
                        isPopup={true}
                      >
                      </AgGridReact>
                    </div> */}
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
                    readOnly={true}
                  />
                </>
              ) : (
                <Alert color="secondary" className="p-2">
                  <p>No hay datos para visualizar </p>
                </Alert>
              )}
            </Col>
          )}

          {error.status && (
            <Col md="12">
              <Alert color="danger">
                <div className="alert-body">
                  <p>
                    {error.status} : {error.codigo}
                  </p>
                  <p>{error.detalle}</p>
                  <p>{error.error}</p>
                </div>
              </Alert>
            </Col>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListParametersOficial
