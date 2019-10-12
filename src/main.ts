import 'babel-polyfill';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import router from '@/router/index';
import i18n from './i18n';
import store from './store';

// Vue.use(VueI18n);
Vue.config.productionTip = false;
const props: any = {
  router,
  vuetify,
  render: h => h(App),
  store,
  i18n,
};

// Register a global custom directive called `v-blur` that prevents focus
Vue.directive('blur', {
  inserted: (el: any) => {
    el.onfocus = ev => ev.target.blur();
  },
});

new Vue(props).$mount('#app');
