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

const ListParametersOficial = () => {
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

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein }
  }

  const rows2 = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9)
  ]

  const transFormData = (data) => {
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
    debugger
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
          debugger
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

  const editItemTable = (item) => {
    debugger
    setOpen(true)
    console.log("Item -> ", item)
    

    if (item.key ===  'confIndices') {
      const splitOne =  item.valor.split('/')
      const elementosPapa = []
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
          elementosPapa.push(obj)
        })
        
      })

      item['tabla'] = elementosPapa
    }

    setItemSelected(item)
  }

  const handleChangeRango = (id) => {
    // debugger
    const valueNew = event.target.value
    console.log(itemSelected)
    const toChange = itemSelected.tabla.filter(element => {
      return element.id === id
    })

    // debugger
  }

  function groupBy(arr, criteria) {
    const newObj = arr.reduce(function (acc, currentValue) {
      if (!acc[currentValue[criteria]]) {
        acc[currentValue[criteria]] = []
      }
      acc[currentValue[criteria]].push(currentValue)
      return acc
    }, {})
    return newObj
  }

  const getValoresChanged = () => {
    console.log(itemSelected)
    const itemChanged = itemSelected
    debugger
    itemSelected.tabla.map(element => {
      const input = document.getElementById(element.id)
      if (input.value !== '') {
        element.rango = input.value
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

    console.log(cortos)
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
        console.log(l)
        
        if (k === 0) {
          stringCortos += `${element.grupo}`
        } else {
          stringCortos += ` ${element.grupo}`
        }
      })
      
      valoresCorto += stringCortos
    })

    Object.entries(largos).forEach(([key, value], kk) => {        
      
      let stringLargos = ''

      if (kk < c - 1) {
        stringLargos = `largo:${key}:`
      } else {
        stringLargos = `/largo:${key}:`
      }     
      
      value.forEach((element, k) => {
        console.log(l)
        
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

      if (kk < c - 1) {
        stringMedianos = `mediano:${key}:`
      } else {
        stringMedianos = `/mediano:${key}:`
      }     
      
      value.forEach((element, k) => {
        console.log(l)
        
        if (k === 0) {
          stringMedianos += `${element.grupo}`
        } else {
          stringMedianos += ` ${element.grupo}`
        }
      })
      
      valoresMediano += stringMedianos
    })

    const valoresAll = `${valoresCorto}/${valoresMediano}/${valoresLargo}`

    debugger
    itemChanged.valor = valoresAll
    setItemSelected(itemChanged)

    console.log(subgrupos)
  }

  const updateItemSelected = () => {
    const valores = getValoresChanged()

    debugger

  }
  useEffect(() => {
    // getParameters()
    // console.log('data inicial -> ', students)
  }, [])

  return (
    <div className="card">
      <div class="card-header">
        <h4 class="card-title">Parámetros oficiales</h4>
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
                    debugger
                    return (
                      <div>
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
                                itemSelected.key === 'confIndices' ? (
                                  <table className="table-edit">
                                    <thead>
                                      <tr>
                                        <th>Grupo</th>
                                        <th>Nombre</th>
                                        <th>Rango días</th>
                                        {/* <th colSpan="2">Rango días</th> */}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                        itemSelected.tabla.map(t => {
                                          return <tr className='jaja'>
                                            <td>{t.grupo}</td>
                                            <td>{t.nombre}</td>
                                            <td>
                                              <Input id={t.id} placeholder={t.rango} 
                                              onChange={() => { handleChangeRango(t.id) }}/>
                                            </td>
                                          </tr>
                                        })
                                      }
                                    </tbody>
                                  </table>
                                ) : (
                                  <Input
                                    type="text"
                                    name="valor"
                                    id="valor"
                                    value={itemSelected.valor}
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
