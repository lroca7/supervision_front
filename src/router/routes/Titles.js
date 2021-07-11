import { lazy } from 'react'

const TitlesRoutes = [
  {
    path: '/titles',
    component: lazy(() => import('../../views/business/titles/Titles.js')),
    exact: true
  },
  {
    path: '/create/title',
    component: lazy(() => import('../../views/business/titles/CreateTitle.js')),
    exact: true
  }
]

export default TitlesRoutes
