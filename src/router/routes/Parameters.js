import { lazy } from 'react'

const ParametersRoutes = [
  {
    path: '/create/parameter',
    component: lazy(() => import('../../views/parameters/CreateParameter.js')),
    exact: true
  },
  {
    path: '/list/parameters/version',
    component: lazy(() => import('../../views/parameters/ListParametersVersion.js')),
    exact: true
  },
  {
    path: '/list/parameters/oficial',
    component: lazy(() => import('../../views/parameters/ListParametersOficial.js')),
    exact: true
  }
]

export default ParametersRoutes
