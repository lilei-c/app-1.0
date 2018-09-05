<template>
  <div class="hello">
    <img src="../assets/login-icon.png" style="width: 100px;">

    <h2 style="font-weight: normal;margin-bottom:  60px;    font-size: 24px;">{{ msg }}</h2>
    <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
    <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
    <mt-button type="primary" size="large" @click="login">登录</mt-button>
  </div>
</template>

<script>
import { Toast } from "mint-ui";

export default {
  data() {
    return {
      msg: "智慧环卫",
      username: "admin",
      password: "123456"
    };
  },
  methods: {
    login: function() {
      if (this.username == "admin" && this.password == "123456")
        this.$router.push("vehtype");
      else
        Toast({
          message: "用户名或密码错误",
          position: "middle",
          duration: 1000
        });
    }
  }
};
</script>

<style scoped>
.hello {
  text-align: center;
}
</style>
