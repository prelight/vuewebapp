// TODO: 申請の通知以外も対応させるので名前を変更する

interface State {
  count: number;
  itemList: { id: number }[];
}

const state = {
  itemList: [],
} as State;

const actions = {
  add({ commit }, item) {
    commit('add', item);
  },
  delete({ commit }, itemId) {
    commit('delete', itemId);
  },
  clear({ commit }) {
    commit('clear');
  },
};

const mutations = {
  add(state, item) {
    state.itemList.push(item);
  },
  delete(state, itemId) {
    const newItemList = state.itemList.filter(item => item.id !== itemId);
    state.itemList = newItemList;
  },
  clear(state) {
    state.itemList.length = 0;
  },
};

const getters = {
  getItemCount: (state: State) => {
    return state.itemList.length;
  },
  getItemList: (state: State) => {
    return state.itemList;
  },
  getLastItemId: (state: State) => {
    return state.itemList[state.itemList.length - 1]
      ? state.itemList[state.itemList.length - 1].id
      : 0;
  },
};

export const applyNotificationModule = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
