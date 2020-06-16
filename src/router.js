/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from 'vue'
import Router from 'vue-router'
import axios from './http/axios/index.js'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('./views/Home.vue'),
          meta: {
            authRequired: 'require'
          }
        },
        {
          path: '/room',
          name: 'room',
          component: () => import('./views/pages/room/Index.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home', url: '/' },
              { title: 'Room' },
              { title: 'Room list', active: true }
            ],
            pageTitle: 'Room Management',
            rule: 'editor',
            authRequired: 'require'
          }
        },

        // Room view, audio list
        {
          path: '/room/:id/view',
          name: 'room_view',
          component: () => import('./views/pages/room/View.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home', url: '/' },
              { title: 'Room', url: '/room' },
              { title: 'Room view', active: true }
            ],
            pageTitle: 'Room View',
            rule: 'editor',
            authRequired: 'require'
          }
        }
      ]
    },
    {
      path: '',
      component: () => import('@/layouts/full-page/FullPage.vue'),
      children: [
        {
          path: '/auth/login',
          name: 'auth-login',
          component: () => import('@/views/auth/Login.vue')
        },
        {
          path: '/auth/register',
          name: 'auth-register',
          component: () => import('@/views/auth/register/Register.vue')
        },
        {
          path: '/pages/error-404',
          name: 'page-error-404',
          component: () => import('@/views/pages/Error404.vue'),
          meta: {
            error: '404'
          }
        }
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: '/pages/error-404'
    }
  ]
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg');
  if (appLoading) {
    appLoading.style.display = 'none';
  }
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const loggedIn = localStorage.getItem('UserInfo');
  if (to.meta.authRequired) {
    if (!loggedIn) {
      return next('/auth/login');
    }
  } else if (loggedIn && !to.meta.error) {
    return next('/');
  }
  return next();
});
export default router;
