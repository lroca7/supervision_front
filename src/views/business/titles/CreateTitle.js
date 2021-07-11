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

  const [idCorrida, setIdCorrida] = useState(null)

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
              />
            </Col>
            <Col md="2" className="pl-0">
              <Button color="primary" onClick={(e) => (e)}>
                Buscar
              </Button>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md="6">
              <Row>
                <Col md="4">
                  <p>ISIN</p>
                </Col>
                <Col md="8">
                  <p>somo text</p>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <p>Moneda</p>
                </Col>
                <Col md="8">
                  <p>somo text</p>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <p>Periodicidad cupón</p>
                </Col>
                <Col md="8">
                  <p>somo text</p>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <p>Fecha emisión</p>
                </Col>
                <Col md="8">
                  <p>somo text</p>
                </Col>
              </Row>
            </Col>
            <Col md="6">
              <Row>
                <Col md="4">
                  <p>Fecha vencimiento</p>
                </Col>
                <Col md="8">
                  <p>somo text</p>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <p>Tasa cupón</p>
                </Col>
                <Col md="8">
                  <p>somo text</p>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <p>Base calculo días</p>
                </Col>
                <Col md="8">
                  <p>somo text</p>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <p>Días al vencimiento</p>
                </Col>
                <Col md="8">
                  <p>somo text</p>
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
              <Input type="text" name="user" id="user" />
              <label>TIR:</label>
              <Input type="text" name="fecha" id="fecha" />
              <label>Precio limpio:</label>
              <Input type="text" name="fecha" id="fecha" />
              <label>Precio sucio:</label>
              <Input type="text" name="fecha" id="fecha" />
            </Col>
            <Col md="6" className="mt-2">
              <label>Nominal:</label>
              <Input type="text" name="user" id="user" />
              <label>Dias de cupón corrido:</label>
              <Input type="text" name="fecha" id="fecha" />
              <label>Cupón corrido:</label>
              <Input type="text" name="fecha" id="fecha" />
            </Col>
          
          </Row>
         
        </fieldset>
        
        <Row className="d-flex align-items-center justify-content-center mt-4 mb-4">
          <Button className="mr-2" color="primary" 
            onClick={(e) => (e)}>
            Agregar
          </Button>
          <Button
            color="secondary"
            onClick={(e) => (e)}
          >
            Cancelar
          </Button>
        </Row>
    </div>
  )
}

export default CreateTitle
