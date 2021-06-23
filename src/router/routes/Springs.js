import { lazy } from 'react'

const SpringsRoutes = [
  {
    path: '/create/spring',
    component: lazy(() => import('../../views/sring/CreateParameter.js')),
    exact: true
  },
  {
    path: '/list/sring/version',
    component: lazy(() => import('../../views/sring/ListParametersVersion.js')),
    exact: true
  },
]

export default SpringsRoutes
