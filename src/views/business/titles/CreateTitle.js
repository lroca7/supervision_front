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
  Form
} from "reactstrap"

import Select from "react-select"

import "@styles/react/libs/charts/apex-charts.scss"

import { AgGridColumn, AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Swal from "sweetalert2"

import { URL_BACK } from "../../../contants"

const CreateTitle = (props) => {
  const { colors } = useContext(ThemeColors)

  const [loader, setLoader] = useState(false)

  const [idCorrida, setIdCorrida] = useState(null)

  const [operations, setOperations] = useState([])

  const [columnsDef, setColumnsDef] = useState([
    { field: "fechaoperacion", headerName: "F. operacion", maxWidth: 120 },
    {
      field: "tir",
      headerName: "TIR",
      maxWidth: 90,
      cellRendererFramework: (field) => {
        return (field.value * 100).toFixed(2)
      }
    },
    { field: "precioLimpio", headerName: "Precio limpio", minWidth: 80 },
    { field: "precioSucio", headerName: "Precio sucio", minWidth: 80 },
    { field: "moneda", headerName: "Moneda", maxWidth: 90 },
    { field: "nominal", headerName: "Nominal", maxWidth: 100 },
    { field: "diasCuponCorrido", headerName: "Días cupón", maxWidth: 110 },
    { field: "cuponCorrido", headerName: "Cupón corrido", minWidth: 90 }
  ])

  const [infoNemotecnico, setInfoNemotecnico] = useState(null)

  const searchNemotecnico = () => {
    const inputNemotecnico = document.getElementById("nemotecnico")
    const nemotecnico = inputNemotecnico.value.trim()

    if (nemotecnico.length > 0) {

      setLoader(true)
      const url = `${URL_BACK}mk-teorico?idCorrida=${idCorrida}&nemotecnico=${nemotecnico}`

      fetch(url, {
        method: "GET"
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.codigo === 200) {
            
            setInfoNemotecnico(result.result)

            debugger
            let operations = []
            operations = result.result.operTeoricas
            const completeOperations = operations.map(o => {
              const op = o
              op.moneda = result.result.infoTitulo.moneda
              return op
            })
            setOperations(completeOperations)

            
          } else {
            Swal.fire(`${result.error}`, `${result.detalle} <br/>`, "error")
          }

          if (result.codigo === undefined) {
            Swal.fire(`${result.message}`, ``, "error")
          }
          setLoader(false)
        })
        .catch((error) => {
          console.error(error)
          Swal.fire(`Ha ocurrido un error al consultar`, `${error}`, "error")
          setLoader(false)
        })
    }

  }

  const addOperation = () => {
    const fechaoperacion = document.getElementById("fechaoperacion")
    const tir = document.getElementById("tir")
    const preciolimpio = document.getElementById("preciolimpio")
    const preciosucio = document.getElementById("preciosucio")
    const nominal = document.getElementById("nominal")
    const diascuponcorrido = document.getElementById("diascuponcorrido")
    const cuponcorrido = document.getElementById("cuponcorrido")

    debugger

    const body = {
      tipoInformacion : "OPadadadER",
      informacion :
      [
        {
          "trade dt" : "2019-01-03",
          nemotecnico: infoNemotecnico.infoTitulo.nemotecnico,
          isin: infoNemotecnico.infoTitulo.isin,
          tir: tir.value,
          precioLimpio: preciolimpio.value,
          precioSucio: preciosucio.value,
          nominal: nominal.value,
          corrid: idCorrida,
          cupon_corrido: cuponcorrido.value
        }
      ]
    }

    const url = `${URL_BACK}mk-teorico`

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.codigo === 200) {
          
          Swal.fire(
            ``,
            `${result.result}`,
            'success'
          )

          // operations.push(body.informacion[0])
          // setOperations(operations)
          
          // console.log('operations -> ', operations)
        }
        // setbtnDisable(false)
      })
      .catch((error) => {
        console.error(error)
        setbtnDisable(false)
      })
  }

  useEffect(() => {
    const id = props.history.location.search.split("idCorrida=")[1]
    setIdCorrida(id)
  }, [])

  return (
    <div id="parameters-container mb-4">
      <h2 className="mb-2">Agregar operación teórica</h2>
      <h4 className="mb-2">Corrida {idCorrida}</h4>
        <fieldset className="border pt-0 pl-2 pr-2 pb-2 mb-2">
          <legend className="w-auto">Título</legend>

          <Row className="d-flex align-items-end ">
            <Col md="6">
              <label>Nemotécnico:</label>
              <Input
                type="text"
                name="nemotecnico"
                id="nemotecnico"
                isRequired={true}
                value={'MH32028'}
              />
            </Col>
            <Col md="2" className="pl-0">
              <Button disabled={loader} color="primary mr-2" onClick={(e) => searchNemotecnico(e)}>
                {!loader ? 'Buscar' :  <><Spinner color="white" size="sm" /></>}
              </Button>
            </Col>
          </Row>
          {infoNemotecnico !== null && (
            <Row className="mt-2">
              <Col md="6">
                <Row>
                  <Col md="4">
                    <p>ISIN:</p>
                  </Col>
                  <Col md="8">
                    <p>{infoNemotecnico.infoTitulo.isin}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <p>Moneda:</p>
                  </Col>
                  <Col md="8">
                    <p>{infoNemotecnico.infoTitulo.moneda}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <p>Periodicidad cupón:</p>
                  </Col>
                  <Col md="8">
                    <p>{infoNemotecnico.infoTitulo.periodicidadCupon}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <p>Fecha emisión:</p>
                  </Col>
                  <Col md="8">
                    <p>{infoNemotecnico.infoTitulo.fechaEmision}</p>
                  </Col>
                </Row>
              </Col>
              <Col md="6">
                <Row>
                  <Col md="4">
                    <p>Fecha vencimiento:</p>
                  </Col>
                  <Col md="8">
                    <p>{infoNemotecnico.infoTitulo.fechaVencimiento}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <p>Tasa cupón:</p>
                  </Col>
                  <Col md="8">
                    <p>{infoNemotecnico.infoTitulo.tasaCupon}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <p>Base calculo días:</p>
                  </Col>
                  <Col md="8">
                    <p>{infoNemotecnico.infoTitulo.baseCalculoDias}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <p>Días al vencimiento:</p>
                  </Col>
                  <Col md="8">
                    <p>{infoNemotecnico.infoTitulo.diasAlVencimiento}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </fieldset>

        {infoNemotecnico !== null && (
          <>  
          <fieldset className="border pt-0 pl-2 pr-2 pb-2 mb-2">
            <legend className="w-auto">Corrida</legend>
            
              <Row className="mt-2">
                <Col md="6">
                  <Row>
                    <Col md="4">
                      <p>Fecha de proceso:</p>
                    </Col>
                    <Col md="8">
                      <p>{infoNemotecnico.infoCorrida.fechaProceso}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <p>Fecha inicial:</p>
                    </Col>
                    <Col md="8">
                      <p>{infoNemotecnico.infoCorrida.fechaInicial}</p>
                    </Col>                      
                  </Row>
                </Col>
                <Col md="6">
                  <Row>
                    <Col md="4">
                      <p>Dias de retraso :</p>
                    </Col>
                    <Col md="8">
                      <p>{infoNemotecnico.infoCorrida.diasDelay}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            
          </fieldset>
          <fieldset className="border pt-0 pl-2 pr-2 pb-2">
            <legend className="w-auto">Nueva operación</legend>
            <Row className="d-flex align-items-start ">

              <Col md="6" className="mt-1">
                <label>Fecha operación:</label>
                <Input className="pickadate" type="date" id="fechaoperacion" isRequired={true} 
                />
                <label>TIR:</label>
                <Input type="number" name="tir" id="tir" isRequired={true} />
                <label>Precio limpio:</label>
                <Input type="number" name="preciolimpio" id="preciolimpio" isRequired={true}  />
                <label>Precio sucio:</label>
                <Input type="number" name="preciosucio" id="preciosucio" isRequired={true} />
              </Col>
              <Col md="6" className="mt-1">
                <label>Nominal:</label>
                <Input type="text" name="nominal" id="nominal" />
                <label>Dias de cupón corrido:</label>
                <Input type="text" name="diascuponcorrido" id="diascuponcorrido" isRequired={true}  />
                <label>Cupón corrido:</label>
                <Input type="text" name="cuponcorrido" id="cuponcorrido" isRequired={true} />
              </Col>
            
            </Row>
          
          </fieldset>
          
          <Row className="d-flex align-items-center justify-content-center mt-4 mb-4">
            <Button className="mr-2" color="primary" 
              onClick={(e) => addOperation(e)}>
              Agregar
            </Button>
            <Button
              color="secondary"
              onClick={(e) => (e)}
            >
              Cancelar
            </Button>
          </Row>

          <h4 className="mb-2">Operaciones teóricas</h4>
          <div
              className="ag-theme-alpine"
              style={{ height: 200, width: "100%" }}
            >
              <AgGridReact
                rowData={operations}
                defaultColDef={{
                  flex: 1,
                  minWidth: 110,
                  editable: false,
                  resizable: true
                }}
                // onCellClicked={onCellClicked}
                columnDefs={columnsDef}
              ></AgGridReact>          
            </div>
          </>
        )}
        
    </div>
  )
}

export default CreateTitle
