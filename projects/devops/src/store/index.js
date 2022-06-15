import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 面包屑所需数据
    level1: 'DashBoard',
    level2: '主控台',
    // 打开的页面
    openTabs: [
      // {
      //   name: '用户列表',
      //   path: '/user/list',
      // },
    ],
  },
  mutations: {
    setLevel(state, payload) {
      state.level1 = payload.level1;
      state.level2 = payload.level2;
    },
    addOpenTabs(state, payload) {
      const tab = state.openTabs.find((item) => item.path === payload.path);
      if (!tab) {
        state.openTabs.push(payload);
      }
    },
    delOpenTabs(state, payload) {
      state.openTabs.splice(payload, 1);
    },
  },
  actions: {},
  modules: {},
});
