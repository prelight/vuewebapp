import router from '@/router/index';
import authProvider, { User, ServiceIdInfo } from '@/auth/authProvider';

interface State {
  loggedIn: boolean;
  user: User;
  service: ServiceIdInfo;
  loading: boolean;
}

const state = { loggedIn: false, user: {}, service: {}, loading: false };
const actions = {
  // async login({ dispatch, commit }, { username, password, transitionHome = true }) {
  async login({ dispatch, commit }, { code, transitionHome = true }) {
    // await authProvider.login(username, password).then(
    await authProvider.login(code).then(
      user => {
        console.log('********* 0001');
        commit('loginSuccess', user);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        if (transitionHome) {
          router.push(user.homePage);
        }
      },
      error => {
        commit('loginFailure', error);
        dispatch('notification/error', error, { root: true });
      }
    );
  },
  logout({ commit }) {
    authProvider.logout();
    commit('logout');
  },
  changeService({ commit }, { service }) {
    commit('changeService', { service });
  },
  async changeUser({ commit, dispatch }, user) {
    await dispatch('login', {
      username: user.username,
      password: user.password,
      transitionHome: false,
    });
  },
  async getCurrentUser({ commit, dispatch }, token = 'token') {
    return authProvider.getCurrentUser(token);
  },
  async getServiceList({ commit, dispatch }, token = 'token') {
    commit('loading', true);
    const data = await authProvider.getServiceList(token);
    commit('loading', false);
    return data;
  },
};

const mutations = {
  loading(state: State, loading: boolean) {
    state.loading = loading;
  },
  loginSuccess(state: State, user: User) {
    state.loggedIn = true;
    state.user = user;
  },
  loginFailure(state: State) {
    state.user = null;
  },
  logout(state: State) {
    state.user = null;
  },
  changeService(state: State, service: ServiceIdInfo) {
    state.service = service;
  },
};

const getters = {
  loading: (state: State) => {
    return state.loading;
  },
  getService: (state: State) => {
    return state.service;
  },
  getUser: (state: State) => {
    return state.user;
  },
};

export const accountModule = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
