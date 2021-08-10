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
  },
  {
    path: '/corridaspendientes',
    component: lazy(() => import('../../views/business/titles/PendingSprints.js')),
    exact: true
  },
  {
    path: '/title/sprints',
    component: lazy(() => import('../../views/business/titles/ShowSprints.js')),
    exact: true
  }
]

export default TitlesRoutes
