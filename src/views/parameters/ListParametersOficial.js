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
    console.log("subgrupos -> ", group)

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

  const editItemTable = (item) => {
    debugger
    setOpen(true)
    console.log("Item -> ", item)
    setItemSelected(item)
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
                    return (
                      <div>
                        <h5>{key}</h5>
                        <br />
                        {rows.length > 0 && (
                          <TableContainer component={Paper}>
                            <Table
                              sx={{ minWidth: 650 }}
                              aria-label="simple table"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell>Nombre</TableCell>
                                  <TableCell align="right">Valor</TableCell>
                                  <TableCell align="right">
                                    Descripción
                                  </TableCell>
                                  <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {rows.map((row) => (
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
                                    <TableCell align="right">
                                      {row.valor}
                                    </TableCell>
                                    <TableCell align="right">
                                      {row.descripcion}
                                    </TableCell>
                                    <TableCell align="right">
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

                  <Modal isOpen={open}>
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
                              <Input
                                type="text"
                                name="valor"
                                id="valor"
                                value={itemSelected.valor}
                              />
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
                        onClick={open}
                      >
                        Guardar
                      </Button>{" "}
                      <Button onClick={handleClose}>Cancel</Button>
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
