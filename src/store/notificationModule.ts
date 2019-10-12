interface State {
  type: string;
  message: string;
}

const state = {
  type: null,
  message: null,
} as State;

const actions = {
  success({ commit }, message) {
    commit('success', message);
  },
  error({ commit }, message) {
    commit('error', message);
  },
  clear({ commit }) {
    commit('success');
  },
};

const mutations = {
  success: (state: State, message: string) => {
    state.type = 'success';
    state.message = message;
  },
  error: (state: State, message: string) => {
    state.type = 'error';
    state.message = message;
  },
  clear: (state: State) => {
    state.type = null;
    state.message = null;
  },
};

const getters = {
  message: (state: State) => {
    return { text: state.message, type: state.type };
  },
};

export const notificationModule = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
