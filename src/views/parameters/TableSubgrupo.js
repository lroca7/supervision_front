import { useContext, useState, useEffect } from "react"
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

import Select from "react-select"

import "@styles/react/libs/charts/apex-charts.scss"

import { AgGridColumn, AgGridReact } from "ag-grid-react"

import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import Swal from 'sweetalert2'

import { columnsParametros, URL_BACK } from "../../contants"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
// import "../../assets/scss/app.scss"
import { fakeResponseIndicesRF, groupBy } from "../../utility/Utils"
import "./parameters.scss"

const TableSubgrupo = ({ itemSelected, toSetItemSelected }) => {

    
    const [itemInEdit, setItemInEdit] = useState(itemSelected)
    const deleteItemValue = (itemToDelete) => {
        debugger
        const copyToDelete = JSON.parse(JSON.stringify(itemSelected))
        copyToDelete['valuesInArray'] = itemInEdit.valuesInArray.filter(item => {
           return item.id !== itemToDelete.id
        })
        setItemInEdit(copyToDelete)
    }

    const addItemValue = () => {
        debugger
        const copyToAdd = JSON.parse(JSON.stringify(itemInEdit))
        copyToAdd['valuesInArray'].push({
            grupo: '',
            nombre: '',
            rango: ''
        })
        setItemInEdit(copyToAdd)
        
    }

    return (
    <div>
        <div className="add-action">
            <Button onClick={ () => { addItemValue() }}>Agregar</Button>
        </div>
        <table className="table-subgrupo">
            <thead>
            <tr>
                <th>Grupo</th>
                <th>Nombre</th>
                <th>Rango días</th>
                {
                (itemInEdit.key === 'porAjustadorLim_SP' || itemInEdit.key === 'porAjustadorLim_BL') && (
                    <th>% Ajustador por criterio comisión</th>
                )
                }
                <th className="table-actions"></th>
            </tr>
            </thead>
            <tbody>
            {
                itemInEdit.valuesInArray.map(t => {
                return <tr className='valor'>
                    <td><Input placeholder={t.grupo} /></td>
                    <td><Input placeholder={t.nombre} /></td>
                    <td>
                    <Input id={t.id} placeholder={t.rango} />
                    </td>
                    {
                    (itemInEdit.key === 'porAjustadorLim_SP' || itemInEdit.key === 'porAjustadorLim_BL') && (
                        <td>
                        <Input id={`porcentaje_${ t.id}`} placeholder={t.porcentaje} />
                        </td>
                    )
                    }
                    <td className="table-actions">
                        <div>
                            <Button onClick={() => { deleteItemValue(t) }}>Eliminar</Button>
                        </div>                
                    </td>
                </tr>
                })
            }
            </tbody>
        </table>
    </div>
    )
}

export default TableSubgrupo
