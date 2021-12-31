// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return '/'
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

export const milesFormat = (params) => {
  
  const value = params.value
  
  let valueFormat = value
  if (!value.includes('.')) {
    valueFormat = Intl.NumberFormat().format(value)
  }
  
  return valueFormat
}

export const milesFormatTwo = (params) => {
  
  const value = params
  
  let valueFormat = value
  const regExp = /[a-zA-Z]/g
              
  if (regExp.test(valueFormat)) {
    return valueFormat
  } 

  if (!value.includes('.') && !value.includes('-')) {
    valueFormat = Intl.NumberFormat().format(value)
  }
  
  return valueFormat
}


export const sortCorridas = (data) => {
  data.sort(function(a, b) {
    const nameA = a.idCorrida.toUpperCase()
    const nameB = b.idCorrida.toUpperCase()
    if (nameA > nameB) {
      return -1
    }
    if (nameA < nameB) {
      return 1
    }
    return 0
  })
  return data
}

export function groupBy(arr, criteria) {
  const newObj = arr.reduce(function (acc, currentValue) {
    if (!acc[currentValue[criteria]]) {
      acc[currentValue[criteria]] = []
    }
    acc[currentValue[criteria]].push(currentValue)
    return acc
  }, {})
  return newObj
}

export const groupsRF = [
  'CORP_USD',
  'CORP_DOP',
  'MH_USD',
  'MH_DOP',
  'BC_DOP'
]

export const namesRF = [
  'corto',
  'mediano',
  'largo'
]


export const fakeResponseIndicesRF = {
status: 'ok',
codigo: 200,
result: {
    grupo: 'Indices RF',
    user: 'system',
    fecha: '20210501104015',
    tipo: 'plantilla',
    parametros: [
          {
            key: 'confIndices',
            valor: 'corto:101-1000:MH_DOP CORP_USD/mediano:1001-2000:BC_DOP MH_USD MH_DOP CORP_USD/largo:2001-3000:MH_DOP',
            nombre: 'Parámetros para definición de índices',
            subgrupo: 'Configuración de índices',
            descripcion: 'Definición de indices a calcular. Formato: [Nombre]:[RangoDiasVcto]:[GrupoTitulosSeparadosPorEspacio]'
          },
          {
            key: 'mesRefInicial',
            valor: '2019-06',
            nombre: 'Mes de cálculo inicial',
            subgrupo: 'General',
            descripcion: 'Mes (Formato: YYYY-MM) desde el cual se inicia el cálculo de índices en caso de no existir'
          },
          {
            key: 'perMesRebalanceo',
            valor: '1',
            nombre: 'Periodo de rebalanceo (Meses)',
            subgrupo: 'General',
            descripcion: 'Periodo (En meses) establecido para rebalancear los títulos que integran el cálculo de los índices'
          },
          {
            key: 'obs',
            valor: '0',
            nombre: 'Observación',
            subgrupo: 'General',
            descripcion: 'Observación de los parámetros establecidos'
          }
      ]
  }
}

export const fakeResponseMonitoreoRF = {
  status: "ok",
  codigo: 200,
  result: {
    grupo: "Monitoreo RF",
    user: "system",
    fecha: "20210501104015",
    tipo: "plantilla",
    parametros: [
      {
        key: "porVariacionVal_SP",
        valor: "10.0",
        nombre: "Porcentaje de variación para anulación",
        subgrupo: "Sistema SIOPEL",
        descripcion: "Porcentaje permitido de variación en valoración para las operaciones "
      },
      {
        key: "porAjustadorLim_SP",
        valor: "corto:101-1000:MH_DOP(-2) MH_USD(1.9) BC_DOP(-4) CORP_DOP(0) CORP_USD(0)/mediano:1001-2000:MH_DOP(-2) MH_USD(1.9) BC_DOP(-4) CORP_DOP(0) CORP_USD(0)/largo:2001-3000:MH_DOP(-2) MH_USD(1.9) BC_DOP(-4) CORP_DOP(0) CORP_USD(0)",
        nombre: "Porcentajes ajustadores de límites",
        subgrupo: "Sistema SIOPEL",
        descripcion: "Porcentajes ajustadores de los límites de liquidez y volatilidad permitidos para las operaciones"
      },
      {
        key: "porVariacionVal_BL",
        valor: "10.0",
        nombre: "Porcentaje de variación para anulación",
        subgrupo: "Sistema BLOOMBERG",
        descripcion: "Porcentaje permitido de variación en valoración para las operaciones "
      },
      {
        key: "porAjustadorLim_BL",
        valor: "corto:101-1000:MH_DOP(3) MH_USD(0)/mediano:1001-2000:MH_DOP(-2) MH_USD(9.5)/largo:2001-3000:MH_DOP(-2) MH_USD(0)",
        nombre: "Porcentajes ajustadores de límites",
        subgrupo: "Sistema BLOOMBERG",
        descripcion: "Porcentajes ajustadores de los límites de liquidez y volatilidad permitidos para las operaciones"
      }
    ]
  }
}

