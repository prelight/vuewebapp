import Vue from 'vue';
import Router from 'vue-router';
import Page from '@/views/Page.vue';
import Login from '@/views/Login.vue';
import LogDashHome from '@/views/LogDashHome.vue';
import ActionLogFormat from '@/views/ActionLogFormat.vue';
import ActionLogFormatDetail from '@/views/ActionLogFormatDetail.vue';
import ApplyStatus from '@/views/ApplyStatus.vue';
import ApplyDetail from '@/views/ApplyDetail.vue';
import ApplyForm from '@/views/ApplyForm.vue';

Vue.use(Router);

const scrollBehavior = (to, from, savedPosition) => {
  return { x: 0, y: 0 };
};

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/logdash',
      component: Page,
      children: [
        {
          path: '/logdash/format',
          name: 'format',
          component: ActionLogFormat,
          meta: { title: 'LogFormat' },
        },
        // {
        //   path: '/logdash/format/create',
        //   name: 'formatCreate',
        //   component: ActionLogFormatCreate,
        //   meta: { title: 'ActionLogFormatHPC' },
        // },
        // {
        {
          path: '/logdash/format/:id',
          name: 'formatDetail',
          component: ActionLogFormatDetail,
          props: true,
          meta: { title: 'LogFormat', viewType: 'detail' },
        },
        {
          path: '/logdash/apply',
          name: 'apply',
          component: ApplyStatus,
          meta: { title: 'Apply Status' },
        },
        {
          path: '/logdash/apply/create/:id?',
          name: 'crateApplyForm',
          component: ApplyForm,
          meta: { title: 'Create Apply Request' },
        },
        {
          path: '/logdash/apply/applyForm',
          name: 'applyForm',
          component: ApplyForm,
          meta: { title: 'Create Apply Request' },
        },
        {
          path: '/logdash/apply/:id',
          name: 'applyDetail',
          component: ApplyDetail,
          meta: { title: 'Apply Form' },
        },
        // {
        //   path: '/logdash/applyDetail',
        //   name: 'applyDetail',
        //   component: ApplyDetail,
        //   meta: { title: 'Apply Detail' },
        // },
        {
          path: '/logdash/about',
          name: 'about',
          meta: { title: 'About' },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
        },
      ],
    },
    {
      path: '/',
      name: 'logDashHome',
      component: LogDashHome,
      meta: { isPublic: true, title: 'LogDash' },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { isPublic: true },
    },
  ],
  scrollBehavior,
});

router.afterEach((to, from) => {
  if (to.meta.viewType && to.meta.viewType === 'detail') {
    document.title = `${to.meta.title}#${to.params.id}`;
  } else {
    document.title = to.meta.title || process.env.VUE_APP_APPLICATION_NAME;
  }
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user');
  if (to.matched.some(record => !record.meta.isPublic) && !loggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
