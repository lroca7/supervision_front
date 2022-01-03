import { useState } from "react"
import {
  Row,
  Col,
  Button,
  Spinner,
  Input
} from "reactstrap"
import { AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Swal from "sweetalert2"

import { URL_BACK, columnsParametros} from "../../contants"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

import "../../assets/scss/app.scss"

const ListParametersVersion = () => {

  const [loader, setLoader] = useState(false)

  const [subgrupos, setSubgrupos] = useState([])

  const transFormData = (data) => {
    const group = data.reduce((r, a) => {
      r[a.subgrupo] = [...(r[a.subgrupo] || []), a]
      return r
    }, {})
    setSubgrupos(group)
  }

  const getParameters = (e) => {
    setLoader(true)

    const inputVersion = document.getElementById('version')
    const version = (inputVersion.value).trim()

    if (version.length > 0) {
      const url = `${URL_BACK}parametros?version=${version}`

      fetch(url)
        .then((response) => response.json())
        .then((result) => {
          if (result.codigo === 200) {

            transFormData(result.result.parametros)

          } else {
            Swal.fire(`${result.error}`, `${result.detalle} <br/>`, "error")
          }

          if (result.codigo === undefined) {
            Swal.fire(`${result.message}`, ``, "error")
          }

          setLoader(false)

        })
        .catch(error => {
          console.error(error)
          setLoader(false)
          setSubgrupos([])
        })
    } else {
      setLoader(false)
      setSubgrupos([])
    }

  }

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Parámetros por versión</h4>
      </div>
      <div className="card-body">
        <div id="parameters-container mb-4">

          <Row className="d-flex align-items-end">
            <Col md="6">
              <label>Ingresa la versión a consultar:</label>
              <Input type="number" name="version" id="version" />
            </Col>
            <Col md="2" className='pl-0'>
              <Button disabled={loader} color="primary mr-2" onClick={(e) => getParameters(e)}>
                Buscar
              </Button>
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
            <Col md="12" className="mt-2">
              {Object.entries(subgrupos).length > 0 ? (
                <>
                  <h4 className='mb-2'>Subgrupos</h4>

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

export default ListParametersVersion
