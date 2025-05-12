const MainRoutes = {
    path: '/main',
    meta: {
      requiresAuth: false
    },
    redirect: '/main',
    component: () => import('@/layouts/FullLayout.vue'),
    children: [
      {
        name: 'Default',
        path: '/pokemon-list',
        component: () => import('@/views/VuetifyTestView.vue')
      },
      {
        name: 'practice',
        path: '/',
        component: () => import('@/views/PracticeView.vue')
      }
    ]
  };
  
  export default MainRoutes;
  