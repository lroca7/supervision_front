
export const setSelectedParameter = parameter => dispatch => dispatch({ type: 'SET_SELECTED_PARAMETER', parameter })

export const deleteValueToSelectedParameter = (itemToDelete) => (dispatch, getState) => {

  const itemSelected = getState().parameters.selectedParameter

  const copyToDelete = JSON.parse(JSON.stringify(itemSelected))
  copyToDelete['valuesInArray'] = itemSelected.valuesInArray.filter(item => {
     return item.id !== itemToDelete.id
  })

  return dispatch({ type: 'DELETE_PARAMETER_VALUE', parameter: copyToDelete })
}

export const addValueToSelectedParameter = (itemToAdd) => (dispatch, getState) => {

  const itemSelected = getState().parameters.selectedParameter

  const copyToItem = JSON.parse(JSON.stringify(itemSelected))
  copyToItem['valuesInArray'].push(itemToAdd)

  return dispatch({ type: 'ADD_PARAMETER_VALUE', parameter: copyToItem })
}

export const editValueToSelectedParameter = (itemToEdit) => (dispatch, getState) => {
  
  const itemSelected = getState().parameters.selectedParameter

  const copyToEdit = JSON.parse(JSON.stringify(itemSelected))
  const valuesEdited  = copyToEdit.valuesInArray.map(item => {
     if (item.id === itemToEdit.id) {
       item = itemToEdit
       item.id = `${itemToEdit.grupo}_${itemToEdit.nombre}_${itemToEdit.rango}`    
     }
     return item
  })

  copyToEdit.valuesInArray = valuesEdited
  

  return dispatch({ type: 'EDIT_PARAMETER_VALUE', parameter: copyToEdit })
}

