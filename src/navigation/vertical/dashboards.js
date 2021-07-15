import { Home, Circle } from 'react-feather'

export default [
  {
    id: 'parameters',
    title: 'Parametros',
    // icon: <Home size={20} />,
    badge: 'light-warning',
    children: [
      {
        id: 'createParameter',
        title: 'Crear parametro',
        icon: <Circle size={12} />,
        navLink: '/create/parameter'
      },
      {
        id: 'listParametersVersion',
        title: 'Por versión',
        icon: <Circle size={12} />,
        navLink: '/list/parameters/version'
      },
      {
        id: 'listParametersOficial',
        title: 'Oficiales',
        icon: <Circle size={12} />,
        navLink: '/list/parameters/oficial'
      }
    ]
  },
  {
    id: 'corridas',
    title: 'Corridas',
    // icon: <Home size={20} />,
    badge: 'light-warning',
    children: [
      {
        id: 'createCorrida',
        title: 'Crear corrida',
        icon: <Circle size={12} />,
        navLink: '/create/sprint'
      },
      {
        id: 'executeCorrida',
        title: 'Lanzar corrida',
        icon: <Circle size={12} />,
        navLink: '/execute/sprint'
      },
      {
        id: 'executeCorrida',
        title: 'Leer corrida',
        icon: <Circle size={12} />,
        navLink: '/read/sprint'
      }
    ]
  },
  {
    id: 'titles',
    title: 'Títulos',
    badge: 'light-warning',
    children: [
      {
        id: 'titles',
        title: 'Aprobar títulos',
        icon: <Circle size={12} />,
        navLink: '/titles'
      }
    ]
  }
]

// export default [
//   {
//     id: 'dashboards',
//     title: 'Dashboards 2',
//     icon: <Home size={20} />,
//     badge: 'light-warning',
//     badgeText: '2',
//     children: [
//       {
//         id: 'analyticsDash',
//         title: 'Analytics',
//         icon: <Circle size={12} />,
//         navLink: '/dashboard/analytics'
//       },
//       {
//         id: 'eCommerceDash',
//         title: 'eCommerce',
//         icon: <Circle size={12} />,
//         navLink: '/dashboard/ecommerce'
//       }
//     ]
//   }
// ]
