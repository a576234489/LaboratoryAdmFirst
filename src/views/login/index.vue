<template>
  <div class="app-content">
    <el-card class="login-form-layout">
      <el-form
        autoComplete="on"
        :model="loginForm"
        label-position="left"
      >
        <div style="text-align: center">
          <img src="~assets/img/laboratory_icon.png" style="width: 56px;height: 56px;background-image: none;">
        </div>
        <h2 class="login-title color-main">实验室后台管理系统</h2>
        <el-form-item>
          <el-input
            name="username"
            type="text"
            v-model="loginForm.username"
            placeholder="请输入用户名"
          >
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            name="password"
            :type="pwdType"
            v-model="loginForm.password"
            placeholder="请输入密码"
          >
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main"></svg-icon>
            </span>
            <span slot="suffix">
              <a href="#" @click="handleShowPass()"><svg-icon icon-class="eye" class="color-main"></svg-icon></a>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width: 90%" :loading="loading" type="primary" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--<img :src="login_center_bg" class="login-center-layout">-->
  </div>
</template>

<script>
  import {setCookie} from "common/support";
  export default {
    name: "Login",
    data(){
      return{
        loginForm:{
          username: '',
          password: ''
        },
        pwdType:'password',
        loading:false,
      }
    },
    methods:{
      handleLogin(){
        this.loading = true;
        this.$store.dispatch('Login',this.loginForm).then(() => {
          setCookie("username",this.loginForm.username,15);
          setCookie("password",this.loginForm.password,15);
          console.log(1)
          this.$router.push({path:'/'});
        }).catch((msg) => {
          this.loading = false
          this.$message({
            message: msg,
            type: 'error',
          });
        })
      },
      handleShowPass(){
        if(this.pwdType == 'text'){
          this.pwdType = 'password'
        }else{
          this.pwdType = 'text'
        }

      }
    }
  }
</script>

<style scoped>
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 140px auto;
  }
  .login-title {
    text-align: center;
    margin: 20px 0 20px;
  }
  .color-main {
    color: #409EFF;
  }
  .app-content{
    width: 100%;
    height: 100%;
    background: url(~assets/img/login_center_bg.png);
  }
</style>
