import formatApi, {
  GetRequestModel,
  CreateNewVersionRequestModel,
  AddKeyRequestModel,
  GetCustomGroupRequestModel,
  GetCustomDataRequestModel,
} from '@/api/formatApi';

interface State {
  formatList: Array<object>;
  selectedItem: Array<object>;
  versionList: Array<object>;
  customFieldList?: Array<object>;
  loading: boolean;
}
const state: State = {
  formatList: [],
  selectedItem: [],
  versionList: [],
  customFieldList: [],
  loading: false,
};

const actions = {
  /**
   * 指定したサービスとバージョンのフォーマットを取得します
   *
   * @param param0
   * @param params
   */
  async getFormatList({ dispatch, commit }, params: GetRequestModel) {
    commit('loading', true);
    const data = await formatApi.get(params);
    commit('setFormatList', data);
    commit('loading', false);
    return data;
  },
  async get({ dispatch, commit }, params: GetRequestModel) {
    commit('loading', true);
    const data = await formatApi.get(params);
    commit('loading', false);
    return data;
  },
  async updateAction({ dispatch, commit }, params: AddKeyRequestModel) {
    commit('loading', true);
    const data = await formatApi.updateAction(params);
    commit('loading', false);
    return data;
  },
  async getVersionList({ dispatch, commit }, params: GetRequestModel) {
    commit('loading', true);
    const data = await formatApi.getVersion(params);
    commit('setVersionList', data);
    commit('loading', false);
    return data;
  },
  async getNextTypeId({ dispatch, commit }, params: GetRequestModel) {
    commit('loading', true);
    const data = await formatApi.getNextTypeId(params);
    commit('loading', false);
    return data;
  },
  async getCustomFieldList({ dispatch, commit }, params: GetRequestModel) {
    commit('loading', true);
    const data = await formatApi.getCustomFieldList(params);
    commit('setCustomFieldList', data);
    commit('loading', false);
    return data;
  },
  async getEventIdMap({ dispatch, commit }, params: GetRequestModel) {
    commit('loading', true);
    const data = await formatApi.getEventIdMap(params);
    commit('loading', false);
    return data;
  },
  async getCustomGroup({ dispatch, commit }, params: GetCustomGroupRequestModel) {
    commit('loading', true);
    const data = await formatApi.getCustomGroup(params);
    commit('loading', false);
    return data;
  },
  async getCustomData({ dispatch, commit }, params: GetCustomDataRequestModel) {
    commit('loading', true);
    const data = await formatApi.getCustomData(params);
    commit('loading', false);
    return data;
  },
  async createNewVersion({ dispatch, commit }, params: CreateNewVersionRequestModel) {
    commit('loading', true);
    const data = await formatApi.createNewVersion(params);
    commit('loading', false);
    return data;
  },
};

const mutations = {
  loading(state: State, loading: boolean) {
    state.loading = loading;
  },
  setFormatList: (state: State, payload: any) => {
    state.formatList = payload;
  },
  setVersionList(state: State, payload: any) {
    state.versionList = payload;
  },
  setCustomFieldList(state: State, payload: any) {
    state.versionList = payload;
  },
  selectedItem(state: State, item: any) {
    state.selectedItem = item;
  },
};

const getters = {
  loading: (state: State) => {
    return state.loading;
  },
  // versionList: state => {
  //   return serviceId => Object.keys(state.formatMap[serviceId]);
  // },
  formatList: (state: State) => {
    return state.formatList;
  },
  versionList: (state: State) => {
    return state.versionList;
  },
  customFieldList: (state: State) => {
    return state.customFieldList;
  },
  selectedItem: (state: State) => {
    return state.selectedItem;
  },
};

export const formatModule = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
