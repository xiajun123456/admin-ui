<template>
  <div class="login-wrap">
    <div class='login-container'>
      <div class="picture">
      </div>
      <div class="loginForm">
        <h3>{{name||'易见区块供应链管理系统'}}</h3>
        <el-form :model="loginForm"
                 :rules="loginFormRules"
                 ref="loginFormRef"
                 label-width="0px">
          <el-form-item label=""
                        prop="userName">
            <el-input placeholder="已注册用户名"
                      v-model="loginForm.userName"></el-input>
          </el-form-item>
          <el-form-item label=""
                        prop="pwd">
            <el-input placeholder="密码"
                      v-model="loginForm.pwd"
                      type="password"></el-input>
          </el-form-item>
          <pictureSmsValidate :loginForm="loginForm"
                              @login="login"></pictureSmsValidate>
          <el-form-item class="btns">
            <el-button type="info"
                       @click="reset">重置
            </el-button>
            <el-button type="primary"
                       @click="login">登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import pictureSmsValidate from './PictureSmsValidate.vue'
import $http from '@/assets/js/http'
import appConst from '@/assets/js/appConst'

export default {
  components: {
    pictureSmsValidate
  },
  props: {
    name: {
      type: String
    }
  },
  name: 'Login',
  data () {
    return {
      loginForm: {
        userName: '',
        pwd: '',
        smsCode: '233900',
        smsToken: '"Bearer eyJhbGciOiJIUzI1NiJ9.eyJVSUQiOiJmZjgwODA4MTY3ODc2MDUxMDE2Nzg3NjBjYjYxMDAyMyIsIk9OQSI6IuaYk-ingeiCoeS7vSIsIk9SIjoiUExBVEZPUk0iLCJVQVMiOiJSUixSLFBMQVRGT1JNIiwiVU4iOiJyb290IiwiT0lEIjoiYWMxZDkxMWYtYzFiOS00ZGRkLTg0YzUtODhmNjQ2MDcwMjhoIiwiZXhwIjoxNTQ0NTk4NzEwfQ.GcSpGsI5ywamxOwYXtErIJmhZKfF06qBsl7a16rs7VU"'
      },
      // loginForm: {
      //   userName: 'root',
      //   pwd: 'root',
      //   smsCode: '233900',
      //   smsToken: '"Bearer eyJhbGciOiJIUzI1NiJ9.eyJVSUQiOiJmZjgwODA4MTY3ODc2MDUxMDE2Nzg3NjBjYjYxMDAyMyIsIk9OQSI6IuaYk-ingeiCoeS7vSIsIk9SIjoiUExBVEZPUk0iLCJVQVMiOiJSUixSLFBMQVRGT1JNIiwiVU4iOiJyb290IiwiT0lEIjoiYWMxZDkxMWYtYzFiOS00ZGRkLTg0YzUtODhmNjQ2MDcwMjhoIiwiZXhwIjoxNTQ0NTk4NzEwfQ.GcSpGsI5ywamxOwYXtErIJmhZKfF06qBsl7a16rs7VU"'
      // },
      loginFormRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    reset () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return this.$message.error('用户名或密码为空。')
        if (!this.loginForm.smsCode) return this.$message.error('请填写短信验证码。')
        const { data: res } = await $http.post(appConst.supplyChainUrl + '/sc/login', this.loginForm)
        console.log(res, 'data')
        let params = Object.assign({}, this.loginForm)
        params.sys = appConst.sys
        if (res.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        window.sessionStorage.setItem('userName', res.data.user.orgName)
        window.sessionStorage.setItem('role', res.data.user.roles[0].name)
        window.sessionStorage.setItem('btnPermissions', res.data.authorities)
        this.$emit('loginSuccess', res.data)
        // this.initAssetType()
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .login-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    top: 0;
    left: 0;
    padding-top: calc(10vh);
    box-sizing: border-box;
    background: #324157;

    .login-container {
      width: 50%;
      min-width: 860px;
      height: 450px;
      margin: 0 auto;
      box-sizing: border-box;

      .picture {
        width: 50%;
        height: 100%;
        background-image: url(../../assets/imgs/login-bg.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        float: left;
      }

      .loginForm {
        width: 50%;
        height: 100%;
        float: left;
        box-sizing: border-box;
        background-color: #fff;

        h3 {
          color: #363636;
          text-align: center;
          letter-spacing: 0.1em;
          padding: 40px 0;
        }

        .el-form {
          width: 320px;
          margin: 0 auto;
        }
      }

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
