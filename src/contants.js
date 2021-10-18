import { milesFormat } from "./utility/Utils"

//Ambiente desarrollo
export const URL_BACK = 'https://zaemfz4o3j.execute-api.us-east-1.amazonaws.com/desa/desa-services_sync/'

//Ambiente bvrd-qa
//export const URL_BACK = 'https://sk76wd183f.execute-api.us-east-1.amazonaws.com/bvrd-qa/services_sync/'

export const columnsParametros = [
  { 
    field: "nombre", 
    headerName: "Nombre",
    editable: false,
    maxWidth: 250
  },
  { 
    field: "valor", 
    headerName: "Valor",
    valueFormatter: milesFormat,
    maxWidth: 250
  },
  { 
    field: "descripcion", 
    headerName: "Descripción", 
    editable: false,
    minWidth: 150,
    wrapText: true, 
    autoHeight: true 
  }
]