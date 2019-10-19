import router from '@/router/index';
import authProvider, { User, ServiceIdInfo } from '@/auth/authProvider';
import cognitoInfo from '@/static/cognitoInfo';

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
        commit('loginSuccess', user);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        // setLocalStorage(user);
        localStorage.setItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.LastAuthUser`, user.sub);
        localStorage.setItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.${user.sub}.accessToken`, user.accessToken);
        localStorage.setItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.${user.sub}.idToken`, user.idToken);
        localStorage.setItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.${user.sub}.refreshToken`, user.refreshToken);
        // localStorage.setItem('CognitoIdentityServiceProvider.' + USER_POOL_WEB_CLIENT_ID + '.' + userInfo.data.sub + '.idToken', token.data.id_token)
        // localStorage.setItem('CognitoIdentityServiceProvider.' + USER_POOL_WEB_CLIENT_ID + '.' + userInfo.data.sub + '.refreshToken', token.data.refresh_token)
        // // localStorage.setItem('CognitoIdentityServiceProvider.' + USER_POOL_WEB_CLIENT_ID + '.' + userInfo.data.sub + '.clockDrift', 0) ??
        // localStorage.setItem('CognitoIdentityServiceProvider.' + USER_POOL_WEB_CLIENT_ID + '.LastAuthUser', userInfo.data.sub)
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

// setLocalStorage() {
//   console.log('----');
//   //return null;
// };

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
