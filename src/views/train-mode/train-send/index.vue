<!--
 * @Author      : Mr.bin
 * @Date        : 2023-06-20 17:20:52
 * @LastEditTime: 2023-06-20 17:21:06
 * @Description : 训练数据统一发送页面
-->
<template>
  <div class="train-send" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="wrapper">
      <div class="title">训练数据统一发送页面</div>
      <div class="text">
        {{ text }}
      </div>

      <div class="btn">
        <el-button class="item" type="primary" @click="handleToHome"
          >回到首页</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'train-send',

  data() {
    return {
      fullscreenLoading: false, // 全屏加载动效

      /* 上传数据 */
      orderId: this.$store.state.orderId,
      data: JSON.parse(window.sessionStorage.getItem('resultArray')),

      /* 提示下一个设备相关 */
      nextDevice: this.$store.state.nextDevice,
      text: ''
    }
  },

  created() {
    if (this.nextDevice === '') {
      this.text = `本订单【${this.orderId}】已完成，可前往MTT平台查看报告等！`
    } else {
      this.text = `请前往下一个设备为：${this.nextDevice}！`
    }

    this.sendData()
  },

  methods: {
    /**
     * @description: 返回首页
     */
    handleToHome() {
      this.$router.push({
        path: '/home'
      })
    },

    /**
     * @description: 上传数据
     */
    sendData() {
      const mttIP = window.localStorage.getItem('mttIP')
      const api = `http://${mttIP}/energy_t6_m5_mtt/public/index.php/pronePosition/sendPronePositionTrainData`
      console.log(api)

      this.fullscreenLoading = true
      this.$axios
        .post(api, {
          order_id: this.orderId,
          data: JSON.stringify(this.data)
        })
        .then(res => {
          console.log(res)
          const data = res.data

          if (data.status === 1) {
            /* 上传成功 */
            this.$message({
              message: `数据上传成功，请点击“回到首页”按钮。`,
              type: 'success',
              duration: 10000
            })
          } else if (data.status === 0) {
            /* 上传失败 */
            this.$alert(
              `数据上传失败，请点击“刷新页面”按钮！`,
              `状态码[${data.status}]`,
              {
                type: 'error',
                showClose: false,
                center: true,
                confirmButtonText: '刷新页面',
                callback: () => {
                  this.handleRefresh()
                }
              }
            )
          } else if (data.status === -9) {
            /* 参数有误 */
            this.$alert(
              `参数有误，请点击“刷新页面”按钮！`,
              `状态码[${data.status}]`,
              {
                type: 'error',
                showClose: false,
                center: true,
                confirmButtonText: '刷新页面',
                callback: () => {
                  this.handleRefresh()
                }
              }
            )
          } else if (data.status === -13) {
            /* 订单号不存在 */
            this.$alert(
              `订单号不存在，请点击“刷新页面”按钮！`,
              `状态码[${data.status}]`,
              {
                type: 'error',
                showClose: false,
                center: true,
                confirmButtonText: '刷新页面',
                callback: () => {
                  this.handleRefresh()
                }
              }
            )
          }
        })
        .catch(err => {
          this.$alert(
            `[上传训练数据-环节] ${err}。请确保网络连接正常！`,
            '网络请求错误',
            {
              type: 'error',
              center: false, // 是否居中布局
              showClose: false, // 是否显示右上角关闭按钮
              confirmButtonText: '重 试', // 确定按钮的文本内容
              callback: () => {
                this.handleRefresh()
              }
            }
          )
        })
        .finally(() => {
          this.fullscreenLoading = false
        })
    },

    /**
     * @description: 刷新页面按钮
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/train-send'),
          duration: JSON.stringify(300)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.train-send {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 86%;
    height: 92%;
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 20px;
    @include flex(column, stretch, stretch);

    .title {
      font-size: 30px;
      font-weight: 700;
      color: rgb(223, 81, 228);
      margin-bottom: 30px;
    }

    .text {
      flex: 1;
      font-size: 22px;
    }

    .btn {
      @include flex(row, center, center);
      .item {
        font-size: 30px;
        margin: 0 50px;
      }
    }
  }
}
</style>
