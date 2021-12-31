// ** Initial State
const initialState = {
    selectedParameter: null
  }
  
  const parameters = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_SELECTED_PARAMETER':
        return {
            ...state,
            selectedParameter: action.parameter
        }
      case 'DELETE_PARAMETER_VALUE':        
        return {
            ...state,
            selectedParameter: action.parameter
        }    
      case 'ADD_PARAMETER_VALUE':
        return {
            ...state,
            selectedParameter: action.parameter
        }   
      case 'EDIT_PARAMETER_VALUE':        
        return {
            ...state,
            selectedParameter: action.parameter
        }               
      default:
        return { ...state }
    }
    
  }
  export default parameters
  