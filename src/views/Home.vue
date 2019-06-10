<template>
  <el-container>
    <el-header>
      <div class="logo">
        Admin-Ui
      </div>
      <div class="user">
        <el-dropdown trigger="click"
                     @command="handleCommand">
          <span class="el-dropdown-link">
            {{userName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退 出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu background-color="#324157"
                 text-color="#fff"
                 active-text-color="#409EFF"
                 router
                 :collapse-transition="false"
                 unique-opened>
          <el-submenu :index="item.index"
                      v-for="item in menuList"
                      :key="item.index">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item :index="subitem.path"
                          v-for="subitem in item.subs"
                          :key="subitem.path"
                          :disabled="subitem.disabled">
              <span class="p-l-r-20"> {{subitem.title}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  data () {
    return {
      menuList: [
        {
          index: '01',
          title: '功能组件',
          subs: []
        },
        {
          index: '02',
          title: '业务组件',
          subs: [
            {
              path: 'saleContract',
              title: '销售合同',
              subs: []
            }
          ]
        }
      ],
      userName: 'admin-ui'
    }
  },
  components: {},
  methods: {
    handleCommand (command) {
      // 退出登录
      if (command === 'logout') {
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('btnPermissions')
        window.sessionStorage.removeItem('projectId')
        window.sessionStorage.removeItem('projectName')
        window.sessionStorage.removeItem('role')
        window.sessionStorage.removeItem('userName')
        window.sessionStorage.removeItem('graphUuid')
        window.sessionStorage.removeItem('entityUuid')
        this.$router.push('/login')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-menu-item {
    width: 200px;
    text-align: left;
  }

  .el-submenu {
    text-align: left;
  }

  .el-submenu__title {
    width: 200px;
    text-align: left;
  }

  .logo {
    color: #fff;
    text-align: center;
    font-size: 20px;
    width: 180px;
  }

  .el-container {
    width: 100%;
    height: 100%;

    .el-header {
      width: 100%;
      height: 50px !important;
      background-color: #242f42;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;

      .user {
        .el-dropdown {
          cursor: pointer;
        }
      }

      .user {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .el-dropdown {
          color: #fff;
        }
      }
    }

    .el-container {
      // height: 100%;
      height: calc(100% - 50px);

      .el-aside {
        width: 200px;
        height: 100%;
        background-color: #324157;
        user-select: none;
      }

      .el-main {
        height: 100%;
        background-color: #f9f9f9;
      }
    }
  }

  .el-dropdown-menu__item {
    letter-spacing: 0.2em;
  }
</style>
