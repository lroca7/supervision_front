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
import { MenuItem, Select } from "@mui/material"
import { groupsRF, namesRF } from "../../utility/Utils"

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

    const [valueGroupAdd, setValueGroupAdd] = useState(null)
    const [valueNameAdd, setValueNameAdd] = useState(null)

    const deleteItemValue = (itemToDelete) => {
        dispatch(deleteValueToSelectedParameter(itemToDelete))
    }

    const openAddModal = () => {
      setShowModalAdd(true)        
    }

    const addValueToItemSelected = () => {

        // const valueAddGroup = document.getElementById('add_group').value
        const valueAddGroup = valueGroupAdd
        // const valueAddName = document.getElementById('add_name')?.value
        const valueAddName = valueNameAdd
        const valueAddRange = document.getElementById('add_range')?.value
        const valueAddPercentage = document.getElementById('add_percentage')?.value

        let _id = `${valueAddGroup}_${valueAddName}_${valueAddRange}`

        if (itemSelected.key === 'porAjustadorLim_SP' || itemSelected.key === 'porAjustadorLim_BL') {
          _id = `${valueAddGroup}(${valueAddPercentage})_${valueAddName}_${valueAddRange}`
        }       

        const valueToAdd = {
          id:  _id,
          grupo: valueAddGroup,
          nombre: valueAddName,
          rango: valueAddRange
        }

        if (valueAddPercentage) {
          valueToAdd['porcentaje'] = valueAddPercentage
        }

        dispatch(addValueToSelectedParameter(valueToAdd))

        setShowModalAdd(false)
    }

    const showEditItemValue = (itemToEdit) => {

      setShowModalEdit(true)
      setValueItemToEdit(itemToEdit)

    }

    const editValueToItemSelected = (itemToEdit) => {
        
        const valueEditGroup = valueGroupAdd === null ? itemToEdit.grupo : valueGroupAdd
        const valueEditName = valueNameAdd === null ? itemToEdit.nombre : valueNameAdd

        let valueEditRange = ""
        if (document.getElementById('edit_range')) {
          valueEditRange = document.getElementById('edit_range').value === "" ? itemToEdit.rango : document.getElementById('edit_range').value
        }        
        
        let valueEditPercentage = ""
        if (document.getElementById('edit_percentage')) {
          valueEditPercentage = document.getElementById('edit_percentage').value === "" ? itemToEdit.porcentaje : document.getElementById('edit_percentage').value
        }
        

        let _id = `${itemToEdit.grupo}_${itemToEdit.nombre}_${itemToEdit.rango}`

        if (itemSelected.key === 'porAjustadorLim_SP' || itemSelected.key === 'porAjustadorLim_BL') {
          _id = `${itemToEdit.grupo}(${itemToEdit.porcentaje})_${itemToEdit.nombre}_${itemToEdit.rango}`
        }
        
        const valueToEdit = {
          id:  _id, 
          grupo: valueEditGroup,
          nombre: valueEditName,
          rango: valueEditRange
        } 

        if (valueEditPercentage) {
          valueToEdit['porcentaje'] = valueEditPercentage
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

    const handleChangeSelectGroup = (event) => {
      setValueGroupAdd(event.target.value)
    }

    const handleChangeSelectName = (event) => {
      setValueNameAdd(event.target.value)
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
                                  itemSelected.valuesInArray.map((t, index) => {
                                  return (
                                    <TableRow key={`trow_${index}`} className='valor'>
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
                                  </TableRow>)
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
              Guardar todo
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
                    {/* <Input
                      type="text"
                      name="add_group"
                      id="add_group"
                    /> */}
                    <Select
                      id="add_group"
                      className='select-group'
                      onChange={handleChangeSelectGroup}
                      displayEmpty                      
                    >
                      {
                        groupsRF.map((g, index) => ( 
                          <MenuItem key={`mgroup_${index}`} value={g}>{g}</MenuItem>
                        ))
                      }
                    </Select>
                  </Col>   
                  <Col md="12">
                    <label>Nombre:</label>
                    {/* <Input
                      type="text"
                      name="add_name"
                      id="add_name"
                    /> */}
                    <Select
                      id="add_name"
                      className='select-group'
                      onChange={handleChangeSelectName}
                      displayEmpty                      
                    >
                      {
                        namesRF.map((n, index) => ( 
                          <MenuItem key={`mname_${index}`} value={n}>{n}</MenuItem>
                        ))
                      }
                    </Select>
                  </Col> 
                  <Col md="12">
                    <label>Rango:</label>
                    <Input
                      type="text"
                      name="add_range"
                      id="add_range"
                    />
                  </Col>   
                  {
                    (itemSelected.key === 'porAjustadorLim_SP' || itemSelected.key === 'porAjustadorLim_BL') && (
                      <Col md="12">
                        <label>% Ajustador:</label>
                        <Input
                          type="text"
                          name="add_percentage"
                          id="add_percentage"
                        />
                      </Col> 
                    )
                  }                      
                </Row>
              )
            }
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => { addValueToItemSelected() }}
            >
              Guardar nuevo
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
                    <label>Grupo e:</label>
                    {/* <Input
                      type="text"
                      name="edit_group"
                      id="edit_group"
                      placeholder={valueItemToEdit.grupo}
                    /> */}
                    <Select
                      id="edit_group"
                      className='select-group'
                      onChange={handleChangeSelectGroup}
                      defaultValue={valueItemToEdit.grupo}
                      displayEmpty                      
                    >
                      {
                        groupsRF.map((g, index) => ( 
                          <MenuItem key={`mgroup_${index}`} value={g}>{g}</MenuItem>
                        ))
                      }
                    </Select>
                  </Col>   
                  <Col md="12">
                    <label>Nombre:</label>
                    {/* <Input
                      type="text"
                      name="edit_name"
                      id="edit_name"
                      placeholder={valueItemToEdit.nombre}
                    /> */}
                    <Select
                      id="edit_name"
                      className='select-group'
                      onChange={handleChangeSelectName}
                      defaultValue={valueItemToEdit.nombre}
                      displayEmpty                      
                    >
                      {
                        namesRF.map((n, index) => ( 
                          <MenuItem key={`mname_${index}`} value={n}>{n}</MenuItem>
                        ))
                      }
                    </Select>
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
                  {
                    (itemSelected.key === 'porAjustadorLim_SP' || itemSelected.key === 'porAjustadorLim_BL') && (
                      <Col md="12">
                        <label>% Ajustador:</label>
                        <Input
                          type="text"
                          name="edit_percentage"
                          id="edit_percentage"
                          placeholder={valueItemToEdit.porcentaje}
                        />
                      </Col> 
                    )
                  }                        
                </Row>
              )
            }
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => { editValueToItemSelected(valueItemToEdit) }}
            >
              Guardar Edicion
            </Button>{" "}
            <Button onClick={() => setShowModalEdit(false)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </>
    )
}

export default TableSubgrupo
