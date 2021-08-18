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

import { AvForm, AvField } from 'availity-reactstrap-validation'

import { useHistory } from "react-router-dom"

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

  const [allTitles, setAllTitles] = useState([])
  const [newTitle, setNewTitle] = useState(null)

  const history = useHistory()

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

            let operations = []
            operations = result.result.operTeoricas
            if (operations && operations.nemotecnico) {
              const completeOperations = operations.map(o => {
                const op = o
                op.moneda = result.result.infoTitulo.moneda
                return op
              })
              setOperations(completeOperations)
            }


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

  const addTitle = (nTitle) => {

    allTitles.push(nTitle)
    setAllTitles(allTitles)

    /*const url = `${URL_BACK}titulos-nys/aprobar-titulos-nys`

    const body = {
      idCorrida,
      titulosAprobados: allTitles
    }
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
        } else {
          Swal.fire(`${result.error}`, `${result.detalle} <br/>`, "error")
        }

        if (result.codigo === undefined) {
          Swal.fire(`${result.message}`, ``, "error")
        }

      })
      .catch((error) => {
        console.error(error)
        Swal.fire(`Ha ocurrido un error al aprobar titulos`, `${error}`, "error")
        setbtnDisable(false)
      })*/

  }

  const addOperation = () => {
    const fechaoperacion = document.getElementById("fechaoperacion")
    const tir = document.getElementById("tir")
    const preciolimpio = document.getElementById("preciolimpio")
    const preciosucio = document.getElementById("preciosucio")
    const nominal = document.getElementById("nominal")
    const diascuponcorrido = document.getElementById("diascuponcorrido")
    const cuponcorrido = document.getElementById("cuponcorrido")

    const body = {
      tipoInformacion: "OPER",
      informacion:
        [
          {
            "trade dt": fechaoperacion.value,
            nemotecnico: infoNemotecnico.infoTitulo.nemotecnico,
            isin: infoNemotecnico.infoTitulo.isin,
            tir: tir.value,
            precioLimpio: preciolimpio.value,
            precioSucio: preciosucio.value,
            nominal: nominal.value,
            corrid: diascuponcorrido.value,
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

          const nTitle = {
            nemotecnico: infoNemotecnico.infoTitulo.nemotecnico,
            isin: infoNemotecnico.infoTitulo.isin,

            moneda: infoNemotecnico.infoTitulo.moneda,
            periodicidadcupon: infoNemotecnico.infoTitulo.periodicidadCupon,
            fechaemision: infoNemotecnico.infoTitulo.fechaEmision,
            fechavencimiento: infoNemotecnico.infoTitulo.fechaVencimiento,
            tasacupon: infoNemotecnico.infoTitulo.tasaCupon,
            basecalculodias: infoNemotecnico.infoTitulo.baseCalculoDias,
            diasalvencimiento: infoNemotecnico.infoTitulo.diasAlVencimiento,

            tir: tir.value,
            preciolimpio: preciolimpio.value,
            preciosucio: preciosucio.value,
            nominal: nominal.value,
            corrid: idCorrida,
            cuponcorrido: cuponcorrido.value,

            mkorigen: "Teórico",
            grupo: infoNemotecnico.infoTitulo.grupo

          }

          addTitle(nTitle)
          console.log('retornando')
          history.push({
            pathname: '/titles',
            search: `?idCorrida=${idCorrida}`,
            state: { allTitles }
          })


        } else {
          Swal.fire(`${result.error}`, `${result.detalle} <br/>`, "error")
        }

        if (result.codigo === undefined) {
          Swal.fire(`${result.message}`, ``, "error")
        }

      })
      .catch((error) => {
        console.error(error)
        Swal.fire(`Ha ocurrido un error al agregar la operacion`, `${error}`, "error")
        //setbtnDisable(false)
      })
  }


  useEffect(() => {

    const id = props.history.location.search.split("idCorrida=")[1]
    const titulos = props.history.location.state.titulos

    setIdCorrida(id)
    setAllTitles(titulos)

  }, [])

  return (
    <div className="card">
      <div class="card-header">
        <h4 class="card-title">Crear corrida</h4>
      </div>
      <div class="card-body">
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
                />
              </Col>
              <Col md="2" className="pl-0">
                <Button disabled={loader} color="primary mr-2" onClick={(e) => searchNemotecnico(e)}>
                  {!loader ? 'Buscar' : <><Spinner color="white" size="sm" /></>}
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

                <AvForm onValidSubmit={addOperation} >

                  <Row className="d-flex align-items-start ">
                    <Col md="6" className="mt-1">
                      <label>Fecha operación:</label>
                      <AvField className="pickadate" type="date" id="fechaoperacion" name="fechaoperacion" errorMessage='Campo requerido' required />

                      <label>TIR:</label>
                      <AvField id="tir" name="tir" type="number" errorMessage='Campo requerido' required />
                      <label>Precio limpio:</label>
                      <AvField type="number" name="preciolimpio" id="preciolimpio" errorMessage='Campo requerido' required />
                      <label>Precio sucio:</label>
                      <AvField type="number" name="preciosucio" id="preciosucio" errorMessage='Campo requerido' required />
                    </Col>
                    <Col md="6" className="mt-1">
                      <label>Nominal:</label>
                      <AvField type="text" name="nominal" id="nominal" errorMessage='Campo requerido' required />
                      <label>Dias de cupón corrido:</label>
                      <AvField type="text" name="diascuponcorrido" id="diascuponcorrido" errorMessage='Campo requerido' required />
                      <label>Cupón corrido:</label>
                      <AvField type="text" name="cuponcorrido" id="cuponcorrido" errorMessage='Campo requerido' required />
                    </Col>
                  </Row>

                  <Row className="d-flex align-items-center justify-content-center mt-4 mb-2">
                    <Button color="primary" className="mr-2">Agregar</Button>
                    <Button
                      color="secondary"
                      onClick={(e) => (e)}
                    >
                      Cancelar
                    </Button>
                  </Row>

                </AvForm>

              </fieldset>


              <h4 className="mt-2 mb-2">Operaciones teóricas</h4>
              <div
                className="ag-theme-alpine mb-4"
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
      </div>
    </div>
  )
}

export default CreateTitle
