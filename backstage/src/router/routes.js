const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/AccountPage.vue') },
      { path: 'article', component: () => import('src/pages/ArticlePage.vue') },
      { path: 'attraction', component: () => import('src/pages/AttractionPage.vue') },
      { path: 'game', component: () => import('src/pages/GamePage.vue') },
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
