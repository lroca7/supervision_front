import { useContext, useState, useEffect } from "react"
import { ThemeColors } from "@src/utility/context/ThemeColors"
import {
  Row,
  Col,
  Button,
  Spinner,
  Input
} from "reactstrap"
import { AgGridColumn, AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import { URL_BACK } from "../../contants"

const ListParametersVersion = () => {
  const { colors } = useContext(ThemeColors)

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
            setLoader(false)
          }
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
    <div id="parameters-container mb-4">
      <h2 className="mb-2">Parámetros por versión</h2>

      <Row className="d-flex align-items-end">
        <Col md="6">
          <label>Ingresa la versión a consultar:</label>
          <Input type="number" name="version" id="version" isRequired={true}/>
        </Col>
        <Col md="2" className='pl-0'>
          <Button color="primary" onClick={(e) => getParameters(e)}>
            {/* <Search size={12} /> */}
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
                          editable: false,
                          resizable: true
                        }}
                      >
                        <AgGridColumn field="nombre" editable="false"></AgGridColumn>
                        <AgGridColumn field="valor"></AgGridColumn>
                        <AgGridColumn field="descripcion" editable="false"></AgGridColumn>
                      </AgGridReact>
                    </div>
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
  )
}

export default ListParametersVersion
