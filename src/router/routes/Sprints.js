import { lazy } from 'react'

const SprintsRoutes = [
  {
    path: '/create/sprint',
    component: lazy(() => import('../../views/sprints/CreateSprint.js')),
    exact: true
  },
  {
    path: '/execute/sprint',
    component: lazy(() => import('../../views/sprints/ExecuteSprint.js')),
    exact: true
  },
  {
    path: '/read/sprint',
    component: lazy(() => import('../../views/sprints/Sprint.js')),
    exact: true
  }
]

export default SprintsRoutes
