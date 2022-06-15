import Vue from 'vue';
import VueRouter from 'vue-router';
import ViewUI from 'view-design';
import store from '../store';
import Login from '../views/login/login.vue';
import Admin from '../views/admin/index.vue';

Vue.use(ViewUI);
Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/',
    name: 'admin',
    component: Admin,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        redirect: '/dashboard/console',
      },
      {
        path: 'dashboard/console',
        name: 'dashboard/console',
        component: () => import('../views/admin/content/dashboard/console.vue'),
        meta: {
          level1: 'DashBoard',
          level2: '主控台',
          requiresAuth: true,
        },
      },
      {
        path: 'dashboard/workplace',
        name: 'dashboard/workplace',
        component: () => import('../views/admin/content/dashboard/workplace.vue'),
        meta: {
          level1: 'DashBoard',
          level2: '工作台',
          requiresAuth: true,
        },
      },
      {
        path: 'user/list',
        name: 'user/list',
        component: () => import('../views/admin/content/user/list.vue'),
        meta: {
          level1: '用户管理',
          level2: '用户列表',
          requiresAuth: true,
        },
      },
      {
        path: 'user/add',
        name: 'user/add',
        component: () => import('../views/admin/content/user/add.vue'),
        meta: {
          level1: '用户管理',
          level2: '新增用户',
          requiresAuth: true,
        },
      },
      {
        path: 'article/list',
        name: 'article/list',
        component: () => import('../views/admin/content/article/list.vue'),
        meta: {
          level1: '文章管理',
          level2: '文章列表',
          requiresAuth: true,
        },
      },
      {
        path: 'article/add',
        name: 'article/add',
        component: () => import('../views/admin/content/article/add.vue'),
        meta: {
          level1: '文章管理',
          level2: '新增文章',
          requiresAuth: true,
        },
      },
      {
        path: 'system/settings',
        name: 'system/settings',
        component: () => import('../views/admin/content/system/settings.vue'),
        meta: {
          level1: '系统管理',
          level2: '系统设置',
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start();
  if (to.meta.level1 && to.meta.level2) {
    store.commit('setLevel', {
      level1: to.meta.level1,
      level2: to.meta.level2,
    });
  }
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

router.afterEach((route) => {
  ViewUI.LoadingBar.finish();
});

export default router;
