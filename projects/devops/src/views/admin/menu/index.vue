<template>
  <div class="menu">
    <div class="menu-logo" @click="$router.push('/')">
      后台管理系统
    </div>
    <Menu theme="dark" accordion @on-select='changeMenuItem'>
      <Submenu name="dashboard">
        <template slot="title">
          <Icon type="ios-speedometer-outline" />
          DashBoard
        </template>
        <MenuItem name="主控台,/dashboard/console" to="/">主控台</MenuItem>
        <MenuItem name="工作台,/dashboard/workplace" to="/dashboard/workplace">工作台</MenuItem>
      </Submenu>
      <Submenu name="user">
        <template slot="title">
          <Icon type="ios-people-outline" />
          用户管理
        </template>
        <MenuItem name="用户列表,/user/list" to="/user/list">用户列表</MenuItem>
        <MenuItem name="新增用户,/user/add" to="/user/add">新增用户</MenuItem>
      </Submenu>
      <Submenu name="article">
        <template slot="title">
          <Icon type="ios-book-outline" />
          文章管理
        </template>

        <MenuItem name="文章列表,/article/list" to="/article/list">文章列表</MenuItem>
        <MenuItem name="新增文章,/article/add" to="/article/add">新增文章</MenuItem>
      </Submenu>
      <MenuItem name="系统设置,/system/setting" to="/system/settings">
        <Icon type="ios-settings-outline" />
        系统设置
      </MenuItem>
    </Menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      theme2: 'light',
    };
  },
  methods: {
    changeMenuItem(e) {
      const arr = e.split(',');
      this.$store.commit('addOpenTabs', {
        path: arr[1],
        name: arr[0],
      });
    },
  },
};
</script>

<style scoped lang="scss">
.ivu-menu {
  background-color: #191a23;
  height: 100vh;
}
.ivu-menu-submenu {
  background-color: #191a23;
}
.ivu-menu-vertical {
  .ivu-menu-submenu.ivu-menu-opened {
    background-color: #000 !important;
  }
}
.menu-logo {
  cursor: pointer;
  height: 60px;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #336699;
  text-indent: 80px;
  font-weight: bold;
  background-image: url("../../../assets/login-logo.png");
  background-size: 60px auto;
  background-position: 12px center;
  background-repeat: no-repeat;
  background-color: #191a23;
  box-sizing: content-box;
  border-bottom: 3px solid #000;
}
</style>
