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
        localStorage.setItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.LastAuthUser`, user.username);
        localStorage.setItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.${user.username}.accessToken`, user.accessToken);
        localStorage.setItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.${user.username}.idToken`, user.idToken);
        localStorage.setItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.${user.username}.refreshToken`, user.refreshToken);
        localStorage.setItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.${user.username}.clockDrift`, '0');
        // localStorage.setItem(`aws.cognito.identity-id.${cognitoInfo.POOL_ID}`, 'us-east-2:c2ccb4d8-565b-499e-8a5d-39d34458462f');
        // localStorage.setItem(`aws.cognito.identity-providers.${cognitoInfo.POOL_ID}`, 'cognito-idp.us-east-2.amazonaws.com/us-east-2_I3nRjackN');
        // localStorage.setItem('CognitoIdentityServiceProvider.6mdsa320oe530p1r774mkjtt98.test.userData', '{"UserAttributes":[{"Name":"sub","Value":"2f5d0cc3-ca69-42a1-be39-5b480011a784"},{"Name":"email_verified","Value":"true"},{"Name":"email","Value":"prelight2006@yahoo.co.jp"}],"Username":"test"}');

//CognitoIdentityServiceProvider.6mdsa320oe530p1r774mkjtt98.test.userData

        // localStorage.setItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.${user.username}.refreshToken`, user.refreshToken);
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
    console.log('------------- 001');
    const data = await authProvider.getServiceList(token);
    console.log('------------- 008');
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
