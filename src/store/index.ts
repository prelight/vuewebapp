import Vue from 'vue';
import Vuex, { ModuleTree } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { formatModule } from './formatModule';
import { accountModule } from './accountModule';
import { notificationModule } from './notificationModule';
import { applyModule } from './applyModule';
import { applyNotificationModule } from './applyNotificationModule';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    format: formatModule,
    account: accountModule,
    apply: applyModule,
    notification: notificationModule,
    applyNotification: applyNotificationModule,
  },
  strict: debug,
  // plugins: [createPersistedState()],
});
