import { useState } from "react"
import { 
  Col, Button, Spinner, Alert
} from "reactstrap"
import Select from "react-select"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

import TableSubgrupo from "./TableSubgrupo"
import { useDispatch } from "react-redux"
import { setSelectedParameter } from "./store/action"
import { milesFormatTwo } from "../../utility/Utils"
import { buildData, getValues } from "./Utils"
import { URL_BACK } from "../../contants"
import "../../assets/scss/app.scss"

const ListParametersOficial = () => {
  const dispatch = useDispatch()

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

  const [subgrupos, setSubgrupos] = useState([])
  const [open, setOpen] = useState(false)
  const [itemSelected, setItemSelected] = useState(null)

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
                        <br />
                      </div>
                    )
                  })}

                  <TableSubgrupo 
                    itemSelected={itemSelected} 
                    // toSetItemSelect={toSetItemSelect} 
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
