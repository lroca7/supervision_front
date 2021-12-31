import { useContext, useState, useEffect, useRef } from "react"
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

import "@styles/react/libs/charts/apex-charts.scss"
import "./parameters.scss"
import { useDispatch, useSelector } from "react-redux"
import { getSelectedParameter } from "./store/selector"
import { addValueToSelectedParameter, deleteValueToSelectedParameter, editValueToSelectedParameter } from "./store/action"


import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

const TableSubgrupo = ({ 
    // itemSelected,  
    toSetItemSelect,
    open,
    handleClose, 
    grupo }) => {

    const dispatch = useDispatch()
    const itemSelected = useSelector(getSelectedParameter)
    
    const [showModalAdd, setShowModalAdd] = useState(false)
    const [showModalEdit, setShowModalEdit] = useState(false)

    const [valueItemToEdit, setValueItemToEdit] = useState(null)

    const deleteItemValue = (itemToDelete) => {
        dispatch(deleteValueToSelectedParameter(itemToDelete))
    }

    const openAddModal = () => {
      setShowModalAdd(true)        
    }

    const addValueToItemSelected = () => {
      
        const valueAddGroup = document.getElementById('add_group').value
        const valueAddName = document.getElementById('add_name').value
        const valueAddRange = document.getElementById('add_range').value

        const valueToAdd = {
          id:  `${valueAddGroup}_${valueAddName}_${valueAddRange}`,
          grupo: valueAddGroup,
          nombre: valueAddName,
          rango: valueAddRange
        }

        dispatch(addValueToSelectedParameter(valueToAdd))

        setShowModalAdd(false)
    }

    const showEditItemValue = (itemToEdit) => {

      setShowModalEdit(true)
      setValueItemToEdit(itemToEdit)

    }

    const editValueToItemSelected = (itemToEdit) => {
 
        const valueEditGroup = document.getElementById('edit_group').value === "" ? itemToEdit.grupo : document.getElementById('edit_group').value
        const valueEditName = document.getElementById('edit_name').value === "" ? itemToEdit.nombre : document.getElementById('edit_name').value
        const valueEditRange = document.getElementById('edit_range').value === "" ? itemToEdit.rango : document.getElementById('edit_range').value


        const valueToEdit = {
          id:  `${itemToEdit.grupo}_${itemToEdit.nombre}_${itemToEdit.rango}`,
          grupo: valueEditGroup,
          nombre: valueEditName,
          rango: valueEditRange
        }


      dispatch(editValueToSelectedParameter(valueToEdit))

      setShowModalEdit(false)
    }

    const updateItemSelected = () => {
      
      const simpleValue = document.getElementById('simplevalue_to_edit')
      if (simpleValue) {
        itemSelected.valor = simpleValue.value
      }
      toSetItemSelect(itemSelected)
      handleClose()
    }

    return (
      <>
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
                      ((itemSelected.key === 'confIndices' || itemSelected.key === 'porAjustadorLim_SP' || itemSelected.key === 'porAjustadorLim_BL') && grupo !== 'Monitoreo RV') ? (
                      
                        <div className="container-table-subgroup">
                          <div className="add-action">
                              <Button color='primary' onClick={ () => { openAddModal() }}>Agregar</Button>
                          </div>
                          <TableContainer component={Paper}>
                          <Table >
                              <TableHead>
                              <TableRow>
                                  <TableCell>Grupo</TableCell>
                                  <TableCell>Nombre</TableCell>
                                  <TableCell>Rango días</TableCell>
                                  {
                                  (itemSelected.key === 'porAjustadorLim_SP' || itemSelected.key === 'porAjustadorLim_BL') && (
                                      <TableCell>% Ajustador por criterio comisión</TableCell>
                                  )
                                  }
                                  <TableCell width={'10%'}>Acciones</TableCell>
                              </TableRow>
                              </TableHead>
                              <TableBody>
                              {
                                  itemSelected.valuesInArray.map(t => {
                                  return <TableRow className='valor'>
                                      <TableCell>{t.grupo}</TableCell>
                                      <TableCell>{t.nombre}</TableCell>
                                      <TableCell>{t.rango}</TableCell>
                                      {
                                      (itemSelected.key === 'porAjustadorLim_SP' || itemSelected
                                      .key === 'porAjustadorLim_BL') && (
                                          <TableCell>
                                          {t.porcentaje}
                                          </TableCell>
                                      )
                                      }
                                      <TableCell width={'10%'}>
                                          <div className="table-actions">
                                              <Button color='primary' outline onClick={() => { showEditItemValue(t) }}>Editar</Button>
                                              <Button color='danger' outline onClick={() => { deleteItemValue(t) }}>Eliminar</Button>
                                          </div>           
                                      </TableCell>
                                  </TableRow>
                                  })
                              }
                              </TableBody>
                          </Table>
                          </TableContainer>
                          
                      </div>
                      ) : (
                        <Input
                          type="text"
                          name="valor"
                          id='simplevalue_to_edit'
                          placeholder={itemSelected.valor}
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
        <Modal isOpen={showModalAdd} >
          <ModalHeader >
            Agregar
          </ModalHeader>
          <ModalBody>
            {
              itemSelected !== null && (
                <Row className="modal-edit d-flex align-items-end justify-content-center">
                  <Col md="12">
                    <label>Grupo:</label>
                    <Input
                      type="text"
                      name="add_group"
                      id="add_group"
                    />
                  </Col>   
                  <Col md="12">
                    <label>Nombre:</label>
                    <Input
                      type="text"
                      name="add_name"
                      id="add_name"
                    />
                  </Col> 
                  <Col md="12">
                    <label>Rango:</label>
                    <Input
                      type="text"
                      name="add_range"
                      id="add_range"
                    />
                  </Col>                         
                </Row>
              )
            }
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => { addValueToItemSelected() }}
            >
              Guardar
            </Button>{" "}
            <Button onClick={() => setShowModalAdd(false)}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={showModalEdit} >
          <ModalHeader >
            Editar
          </ModalHeader>
          <ModalBody>
            {
              valueItemToEdit !== null && (
                <Row className="modal-edit d-flex align-items-end justify-content-center">
                  <Col md="12">
                    <label>Grupo:</label>
                    <Input
                      type="text"
                      name="edit_group"
                      id="edit_group"
                      placeholder={valueItemToEdit.grupo}
                    />
                  </Col>   
                  <Col md="12">
                    <label>Nombre:</label>
                    <Input
                      type="text"
                      name="edit_name"
                      id="edit_name"
                      placeholder={valueItemToEdit.nombre}
                    />
                  </Col> 
                  <Col md="12">
                    <label>Rango:</label>
                    <Input
                      type="text"
                      name="edit_range"
                      id="edit_range"
                      placeholder={valueItemToEdit.rango}
                    />
                  </Col>                         
                </Row>
              )
            }
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => { editValueToItemSelected(valueItemToEdit) }}
            >
              Guardar
            </Button>{" "}
            <Button onClick={() => setShowModalEdit(false)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </>
    )
}

export default TableSubgrupo
