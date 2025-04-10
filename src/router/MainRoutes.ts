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
        path: '/vuetify-test',
        component: () => import('@/views/VuetifyTestView.vue')
      }
    ]
  };
  
  export default MainRoutes;
  