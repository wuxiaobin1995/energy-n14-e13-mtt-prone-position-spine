<!--
 * @Author      : Mr.bin
 * @Date        : 2023-06-20 16:54:22
 * @LastEditTime: 2023-06-20 16:55:37
 * @Description : 顶部栏
-->
<template>
  <div class="TopBar">
    <!-- 其他 -->
    <div class="others">
      <!-- 配置项 -->
      <div class="set">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-setting self"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-s-custom" command="用户详细信息"
              >用户详细信息</el-dropdown-item
            >
            <el-dropdown-item
              icon="el-icon-s-promotion"
              command="开发者"
              divided
              >开发者</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!-- 订单号 -->
      <div class="order-id">
        <div class="item">订单号：{{ activeOrderId }}</div>
      </div>

      <!-- 当前登录用户的姓名 -->
      <div class="user">
        <div class="item">{{ activeUserName }}</div>
        <i class="el-icon-user"></i>
      </div>
    </div>

    <!-- logo -->
    <div class="logo">
      <span class="text">卧姿肢体康复评估与训练系统</span>
      <el-image class="logo__img" :src="logoSrc" fit="scale-down"></el-image>
    </div>

    <!-- 用户详细信息窗口 -->
    <el-drawer
      title="用户详细信息"
      :visible.sync="userDrawer"
      :show-close="false"
      size="35%"
    >
      <div class="userDrawer">
        <el-descriptions border :column="1">
          <el-descriptions-item label="用户ID">
            {{ this.$store.state.currentUserInfo.userId }}
          </el-descriptions-item>
          <el-descriptions-item label="姓名">
            {{ this.$store.state.currentUserInfo.userName }}
          </el-descriptions-item>
          <el-descriptions-item label="性别">
            {{ this.$store.state.currentUserInfo.sex }}
          </el-descriptions-item>
          <el-descriptions-item label="身高cm">
            {{ this.$store.state.currentUserInfo.height }}
          </el-descriptions-item>
          <el-descriptions-item label="体重kg">
            {{ this.$store.state.currentUserInfo.weight }}
          </el-descriptions-item>
          <el-descriptions-item label="出生日期">
            {{ this.$store.state.currentUserInfo.birthday }}
          </el-descriptions-item>
          <el-descriptions-item label="住院号">
            {{ this.$store.state.currentUserInfo.admission }}
          </el-descriptions-item>
          <el-descriptions-item label="MTT分期类型">
            {{ this.$store.state.currentUserInfo.stage }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'TopBar',

  data() {
    return {
      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司商标

      userDrawer: false // 用户详细信息窗口
    }
  },

  computed: {
    activeUserName() {
      return this.$store.state.currentUserInfo.userName
        ? this.$store.state.currentUserInfo.userName
        : '用户未登录'
    },

    activeOrderId() {
      return this.$store.state.orderId ? this.$store.state.orderId : '无'
    }
  },

  methods: {
    /**
     * @description: 点击菜单项触发的事件回调
     * @param {String} command 对应的command值
     */
    handleCommand(command) {
      switch (command) {
        case '用户详细信息':
          if (this.activeOrderId === '无') {
            this.$alert(
              '订单号为空，请先输入订单号，才能获取用户详细信息！',
              '提示',
              {
                type: 'warning',
                showClose: true,
                closeOnClickModal: true,
                closeOnPressEscape: true,
                center: true,
                confirmButtonText: '确 定',
                callback: () => {
                  this.userDrawer = false
                }
              }
            )
          } else {
            this.userDrawer = true
          }
          break
        case '开发者':
          if (this.activeOrderId === '无') {
            this.$prompt('请输入密码', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /^htpm$/,
              inputErrorMessage: '密码不正确',
              showClose: true,
              closeOnClickModal: false
            })
              .then(() => {
                this.$router.push({
                  path: '/set-developer'
                })
              })
              .catch(() => {})
          } else {
            this.$confirm(
              '订单进行中，此操作会退出该订单，先前所测数据将丢失，是否退出？',
              '警告',
              {
                type: 'warning',
                showClose: true,
                closeOnClickModal: true,
                closeOnPressEscape: true,
                center: true,
                confirmButtonText: '退 出',
                cancelButtonText: '否'
              }
            )
              .then(() => {
                this.$prompt('请输入密码', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  inputPattern: /^htpm$/,
                  inputErrorMessage: '密码不正确',
                  showClose: true,
                  closeOnClickModal: false
                })
                  .then(() => {
                    this.$router.push({
                      path: '/set-developer'
                    })
                  })
                  .catch(() => {})
              })
              .catch(() => {})
          }
          break
        default:
          this.$message({
            message: '不存在此路由，请联系开发人员！',
            type: 'error',
            duration: 5000
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.TopBar {
  width: 100%;
  height: 100%;
  @include flex(row, space-between, center);

  /* 其他 */
  .others {
    margin-left: 20px;
    @include flex(row, center, center);
    // 配置项
    .set {
      .self {
        font-size: 40px;
      }
    }
    // 订单号
    .order-id {
      margin-left: 20px;
      @include flex(row, center, center);
      padding: 6px 40px;
      border-radius: 20px;
      background-color: #f0f0f0;
      font-size: 22px;
      .item {
        margin-right: 20px;
        font-size: 18px;
        font-weight: 700;
        color: #23a86f;
      }
    }
    // 当前登录用户
    .user {
      margin-left: 20px;
      @include flex(row, center, center);
      padding: 6px 40px;
      border-radius: 20px;
      background-color: #f0f0f0;
      font-size: 22px;
      .item {
        margin-right: 20px;
        font-size: 18px;
        font-weight: 700;
        color: #3d3d3d;
      }
    }
  }

  /* logo */
  .logo {
    margin-right: 20px;
    @include flex(row, center, center);
    .text {
      margin-right: 20px;
      font-size: 22px;
      color: #3d3d3d;
    }
    .logo__img {
      width: 130px;
    }
  }

  /* 用户详细信息窗口 */
  .userDrawer {
    margin: 0 15px;
  }
}
</style>
