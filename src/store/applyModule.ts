import applyApi from '@/api/applyApi';

export const APPROVAL_STATUS = {
  UNAPPLIED: 'unapplied',
  APPLYING: 'applying',
  APPROVED: 'approved',
  CANCELED: 'canceled',
  REJECTED: 'rejected',
  CLOSED: 'closed',
};

interface State {
  itemId: number;
  loading: boolean;
}

const state = {
  itemId: 1,
  loading: false,
} as State;

const actions = {
  incrementItemId({ dispatch, commit }) {
    commit('incrementItemId');
  },
  async list({ dispatch, commit }, serviceId) {
    commit('loading', true);
    const list = await applyApi.getList(serviceId);
    commit('loading', false);
    return list;
  },
  async create({ commit }, { serviceId, contents }) {
    commit('loading', true);
    const id = await applyApi.create(serviceId, contents);
    commit('loading', false);
    return id;
  },
  async update({ commit }, { serviceId, applyId, contents }) {
    commit('loading', true);
    const updateContents = await applyApi.update(serviceId, applyId, contents);
    commit('loading', false);
    return updateContents;
  },
  cancel({ commit }, { serviceId, applyId, contents }) {
    commit('loading', true);
    applyApi.cancel(serviceId, applyId, contents).then(response => {
      commit('loading', false);
    });
  },
};

const mutations = {
  incrementItemId(state) {
    state.itemId += state.itemId;
  },
  loading(state, loading) {
    state.loading = loading;
  },
};

const getters = {
  getItemId(state) {
    return state.itemId;
  },
  loading(state) {
    return state.loading;
  },
};

export const applyModule = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
