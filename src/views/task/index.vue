<!--
 * @Author      : Mr.bin
 * @Date        : 2023-06-20 17:15:55
 * @LastEditTime: 2023-06-20 17:19:02
 * @Description : 任务详情页
-->
<template>
  <div class="task">
    <div class="wrapper">
      <!-- 标题 -->
      <el-page-header
        title="返回首页"
        content="任务详情页"
        @back="handleToHome"
      ></el-page-header>

      <!-- 步骤条 -->
      <div class="step">
        <el-steps :active="settings.length" align-center>
          <el-step
            v-for="(item, index) in settings"
            :key="index"
            :title="item.pattern"
          ></el-step>
        </el-steps>
      </div>

      <!-- 轮播图 -->
      <div class="carousel">
        <el-card>
          <div slot="header">
            <span :style="{ 'font-weight': 700 }"
              >订单类型：{{ orderIdType }}</span
            >
            <div :style="{ float: 'right', padding: '3px 0' }">
              <span>说明</span>
              <i class="el-icon-share"></i>
            </div>
          </div>
          <el-carousel
            trigger="click"
            :interval="5000"
            :loop="true"
            height="350px"
            arrow="always"
          >
            <el-carousel-item v-for="(item, index) in settings" :key="index">
              <div class="box">
                <div class="title">({{ index + 1 }}){{ item.pattern }}</div>
                <div class="item">欢迎使用卧姿肢体康复评估与训练系统！</div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </el-card>
      </div>

      <!-- 按钮组 -->
      <div class="btn">
        <el-button class="item" type="primary" @click="handleStart"
          >正式开始</el-button
        >
        <el-button class="item" type="danger" @click="handleToHome"
          >返回首页</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'task',

  data() {
    return {
      /* 路由传参 */
      orderIdType: JSON.parse(this.$route.query.orderIdType),

      settings: this.$store.state.settings
    }
  },

  methods: {
    /**
     * @description: 返回首页
     */
    handleToHome() {
      this.$confirm('订单进行中，此操作会退出该订单，是否退出？', '提示', {
        type: 'warning',
        showClose: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        center: true,
        confirmButtonText: '退 出',
        cancelButtonText: '否'
      })
        .then(() => {
          this.$router.push({
            path: '/home'
          })
        })
        .catch(() => {})
    },

    /**
     * @description: 正式开始
     */
    handleStart() {
      const settings = this.settings
      let settingsRouter = []

      if (this.orderIdType === '评估') {
        for (let i = 0; i < settings.length; i++) {
          const item = settings[i]
          switch (item.pattern) {
            case '活动度测试':
              settingsRouter.push('flexibility-measure')
              break
            default:
              break
          }
        }
      } else if (this.orderIdType === '训练') {
        for (let i = 0; i < settings.length; i++) {
          const item = settings[i]
          switch (item.pattern) {
            case '腹式呼吸训练':
              settingsRouter.push('abdominal-respiration-measure')
              break
            case '活动度训练':
              settingsRouter.push('activity-improvement-measure')
              break
            case '内核心激活训练':
              settingsRouter.push('stabilizer-activation-measure')
              break
            case '本体感觉训练':
              settingsRouter.push('deep-sensory-measure')
              break
            case '静态稳定训练':
              settingsRouter.push('static-measure')
              break
            case '动态稳定训练':
              settingsRouter.push('dynamic-measure')
              break
            default:
              break
          }
        }
      }

      // console.log(settingsRouter)
      this.$router.push({
        path: '/' + settingsRouter[0]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.task {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 96%;
    height: 96%;
    border-radius: 34px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 20px 40px;
    @include flex(column, stretch, stretch);

    .step {
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .carousel {
      flex: 1;
      .el-carousel__item .box {
        @include flex(column, center, center);
        height: 350px;
        position: relative;
      }
      .el-carousel__item .box .title {
        color: #475669;
        font-size: 30px;
        font-weight: 700;
        position: absolute;
        top: 15px;
        left: 20px;
      }
      .el-carousel__item .box .item {
        width: 80%;
        color: #475669;
        font-size: 26px;
        font-weight: 700;
      }
      .el-carousel__item {
        background-color: #d3dce6;
      }
    }

    .btn {
      margin-top: 15px;
      @include flex(row, center, center);
      .item {
        font-size: 22px;
        margin: 0 50px;
      }
    }
  }
}
</style>
