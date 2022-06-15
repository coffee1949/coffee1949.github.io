<template>
  <div class="login">
    <Form ref="formData" :model="formData" :rules="rules" class="formData">
      <div class="login-logo"></div>
      <div class="login-title">开发运维 / 设计解决方案</div>
      <FormItem prop="username">
        <Input
          v-model="formData.username"
          placeholder="请输入用户名"
          prefix="ios-contact-outline"
          size="large"
        />
      </FormItem>
      <FormItem prop="password">
        <Input
          v-model="formData.password"
          type="password"
          password
          placeholder="请输入密码"
          prefix="ios-lock-outline"
          size="large"
        />
      </FormItem>
      <FormItem>
        <Checkbox style="color: #ffffff">自动登录</Checkbox>
        <router-link to="/resetPassword" style="float: right">忘记密码</router-link>
      </FormItem>
      <FormItem>
        <Button type="primary" size="large" long @click="handleSubmit('formData')">登录</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'));
      } else {
        callback();
      }
    };

    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };

    return {
      formData: {
        username: '',
        password: '',
        // remmberPassword: false,
      },
      rules: {
        username: [{ validator: validateUsername, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
      },
    };
  },

  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.getUser();
        }
      });
    },
    async getUser() {
      localStorage.setItem('token', 'admin');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  /* background-size: cover; */
  /* background-repeat: no-repeat; */
  background-color: #f6f6f6;
  /* background-image: url("../../assets/a.png"); */
  /* background-image: url("../../assets/b.png"); */
  /* background-image: url("../../assets/c.png"); */
  /* background-image: url("../../assets/login-bg.png"); */
  /* background-image: url("../../assets/login-bg.svg"); */
  background-image: url("../../assets/bg.gif");
}
.formData {
  width: 384px;
  margin: 80px auto;
}
.login-logo {
  height: 60px;
  background-image: url("../../assets/login-logo.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.login-title {
  color: #cccccc;
  text-align: center;
  padding: 20px 0 20px;
}
</style>
