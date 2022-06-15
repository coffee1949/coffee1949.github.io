<template>
  <div class="admin">
    <div class="admin-menu">
      <AdminMenu></AdminMenu>
    </div>
    <div class="admin-container">
      <div class="admin-header">
        <AdminHeader></AdminHeader>
      </div>
      <div class="admin-tabs">
        <router-link class="admin-tab" to="/">主控台</router-link>
        <router-link
          class="admin-tab"
          v-for="(item, index) in openTabs"
          :key="item.path"
          :to="item.path"
        >
          {{ item.name }}
          <Icon @click.prevent="$store.commit('delOpenTabs', index)" type="ios-close" />
        </router-link>
      </div>
      <div class="admin-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import AdminMenu from './menu/index.vue';
import AdminHeader from './header/index.vue';

export default {
  name: '',
  computed: {
    openTabs() {
      return this.$store.state.openTabs;
    },
  },
  methods: {

  },
  components: {
    AdminMenu,
    AdminHeader,
  },
};
</script>

<style scoped lang="scss">
.admin {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f7f9;
  display: flex;
}
.admin-header {
  height: 60px;
}
.admin-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  .admin-tabs {
    margin: 10px 0 0 20px;
    display: flex;
    .admin-tab {
      color: #888;
      cursor: pointer;
      font-size: 14px;
      padding: 6px 12px;
      border-radius: 3px;
      margin-right: 10px;
      background-color: #fff;
    }
  }
  .admin-content {
    flex: 1;
    padding: 12px 0 0 12px;
    border-radius: 2px;
    margin: 10px 0 0 20px;
    background-color: #fff;
    overflow: hidden;
  }
}
</style>
