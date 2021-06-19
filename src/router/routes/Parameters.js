import { lazy } from 'react'

const ParametersRoutes = [
  {
    path: '/create/parameter',
    component: lazy(() => import('../../views/parameters/CreateParameter.js')),
    exact: true
  },
  {
    path: '/list/parameters',
    component: lazy(() => import('../../views/parameters/ListParameters.js')),
    exact: true
  },
  {
    path: '/list/parameters/oficial',
    component: lazy(() => import('../../views/parameters/ListParametersOficial.js')),
    exact: true
  }
]

export default ParametersRoutes
