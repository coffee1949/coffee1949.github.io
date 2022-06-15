<template>
  <div class="header">
    <div class="header-left">
      <div
        class="zhedie"
        @click="
          $Message.success({
            background: true,
            content: '功能实现中...'
          })
        "
      >
        <span class="iconfont icon-zhedie2" v-if="collapse"></span>
        <span class="iconfont icon-zhedie1" v-else></span>
      </div>
      <div class="refresh" @click="$router.go(0)">
        <Icon type="ios-refresh" />
      </div>
      <Breadcrumb>
        <BreadcrumbItem to="">首页</BreadcrumbItem>
        <BreadcrumbItem to="">{{ $store.state.level1 }}</BreadcrumbItem>
        <BreadcrumbItem>{{ $store.state.level2 }}</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="header-right">
      <div class="srarch">
        <Input placeholder="搜索..." :border="false" style="width: 160px;" />
      </div>
      <div class="fullscreen" @click="toggleFullscreen">
        <Icon type="ios-expand" v-if="!isFullScreen" />
        <Icon type="ios-contract" v-if="isFullScreen" />
      </div>

      <Dropdown placement="bottom-end">
        <div class="userinfo">
          <div class="useravatar"></div>
          <div class="username">admin</div>
        </div>
        <DropdownMenu slot="list">
          <DropdownItem name="person">
            <div
              @click="
                $Message.success({
                  background: true,
                  content: '功能实现中...'
                })
              "
            >
              <Icon type="ios-contact-outline" />个人中心
            </div>
          </DropdownItem>
          <DropdownItem name="settings">
            <div
              @click="
                $Message.success({
                  background: true,
                  content: '功能实现中...'
                })
              "
            >
              <Icon type="ios-settings-outline" />设置
            </div>
          </DropdownItem>
          <DropdownItem name="exit" divided>
            <div @click="exit"><Icon type="ios-log-out" />退出登录</div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull';

export default {
  data() {
    return {
      collapse: false,
      isFullScreen: false,
    };
  },
  methods: {
    toggleFullscreen() {
      if (!screenfull.isEnabled) {
        return false;
      }
      if (this.isFullScreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
      this.isFullScreen = !this.isFullScreen;
      return true;
    },
    exit() {
      localStorage.clear();
      window.location.reload();
    },
  },
  computed: {},
};
</script>

<style scoped lang="scss">
.header {
  height: 100%;
  overflow-x: hidden;
  background-color: #fff;
  box-shadow: 0 0 5px rgb(0 0 0 / 6%);

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 0 12px;
}
.header-left {
  display: flex;
  height: 100%;
  align-items: center;
  .zhedie {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 8px;
    cursor: pointer;
    span {
      font-size: 22px;
    }
    &:hover {
      background-color: #eee;
    }
  }
  .refresh {
    height: 100%;
    font-size: 28px;
    padding: 0 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-right: 6px;
    &:hover {
      background-color: #eee;
    }
  }
}
.header-right {
  display: flex;
  height: 100%;
  align-items: center;
  .fullscreen {
    cursor: pointer;
    padding: 0 12px;
    color: #ccc;
    height: 100%;
    display: flex;
    font-size: 26px;
    align-items: center;
    &:hover {
      background-color: #eee;
    }
  }
  .ivu-dropdown {
    display: flex;
    align-items: center;
    .ivu-icon {
      font-size: 20px;
      margin-right: 6px;
    }
    .userinfo {
      display: flex;
      align-items: center;
      height: 60px;
      padding: 0 12px;
      cursor: pointer;
      transition: all 500ms;
      &:hover {
        background-color: #eee;
      }

      .useravatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-size: cover;
        background-image: url("../../../assets/avatar.png");
      }
      .username {
        color: #999;
        padding-left: 8px;
      }
    }
  }
}
</style>
