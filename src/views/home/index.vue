<!--
 * @Author      : Mr.bin
 * @Date        : 2023-06-20 17:09:47
 * @LastEditTime: 2023-06-30 20:32:33
 * @Description : home
-->
<template>
  <div class="home" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="wrapper">
      <!-- 语音相关 -->
      <div class="audio-control">
        <div class="title">语音功能</div>
        <el-switch
          v-model="switchValue"
          active-text="开"
          inactive-text="关"
          @change="handleSwitchChange"
        >
        </el-switch>
      </div>

      <div class="content">
        <el-form
          :model="mainForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="任务号" prop="orderId">
            <el-input v-model.number="mainForm.orderId"></el-input>
          </el-form-item>

          <el-form-item>
            <div class="btn">
              <el-button class="item" type="primary" @click="submitForm"
                >确 定</el-button
              >
              <el-button class="item" @click="resetForm">清 空</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',

  data() {
    return {
      fullscreenLoading: false, // 全屏加载动效

      switchValue: null, // 语音相关

      mainForm: {
        orderId: '' // 订单号
      },
      rules: {
        orderId: [{ required: true, message: '请输入订单号', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.initVuex() // 初始化 Vuex
    this.initSessionStorage() // 初始化SessionStorage的一些值

    this.switchValue = this.$store.state.voiceSwitch
  },

  methods: {
    /**
     * @description: 初始化 Vuex
     */
    initVuex() {
      this.$store.dispatch('setOrderId', '') // 订单号
      // 当前登录的用户及其信息
      this.$store.dispatch('changeCurrentUserInfo', {
        userId: '',
        userName: '',
        sex: '',
        height: '',
        weight: '',
        birthday: '',
        admission: '',
        stage: ''
      })
      this.$store.dispatch('setSettings', []) // 参数配置数组
      this.$store.dispatch('setNextDevice', '') // 下一个设备的名称
      // 最大、最小活动度值
      this.$store.dispatch('setBothFlexibility', {
        maxDepth: null,
        minDepth: null
      })
    },

    /**
     * @description:初始化SessionStorage的一些值
     */
    initSessionStorage() {
      /* 初始化最终结果数组 [{},{},......,{}] */
      window.sessionStorage.setItem('resultArray', JSON.stringify([]))
    },

    /**
     * @description: 语音开关
     */
    handleSwitchChange() {
      if (this.switchValue === true) {
        this.$store.dispatch('setVoiceSwitch', true)
      } else {
        this.$store.dispatch('setVoiceSwitch', false)
      }
    },

    /**
     * @description: 表单验证
     */
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          // 确定
          this.setOrderID(this.mainForm.orderId)
        } else {
          return false
        }
      })
    },

    /**
     * @description: 重置表单
     */
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    },

    /**
     * @description: 用户输入订单号，获取信息
     * @param {string} order_id 订单号
     */
    setOrderID(order_id) {
      const mttIP = window.localStorage.getItem('mttIP')
      const api = `http://${mttIP}/energy_t6_m5_mtt/public/index.php/base/getOrderIDMessage`
      console.log(api)

      this.fullscreenLoading = true
      this.$axios
        .post(api, {
          order_id: order_id,
          device_type: 'PronePosition'
        })
        .then(res => {
          console.log('后端返回的源数据：\n', res)
          const data = res.data

          if (data.status === 1) {
            /* 状态码为1，成功 */
            const orderIdReturn = data.result.order_id // 后端返回的订单号（以此为准）
            const userData = data.result.user_data // 用户信息
            const orderIdType = data.result.order_id_type // 订单类型

            // 设置订单号到 Vuex
            this.$store.dispatch('setOrderId', orderIdReturn).then(() => {
              this.$message({
                message: `订单号获取成功，并设置Vuex。`,
                type: 'success',
                duration: 2000
              })
            })

            // 设置用户信息到 Vuex
            this.$store
              .dispatch('changeCurrentUserInfo', {
                userId: userData.user_id,
                userName: userData.name,
                sex: userData.gentle,
                height: userData.height,
                weight: userData.weight,
                birthday: userData.birth,
                admission: userData.admission,
                stage: userData.stage
              })
              .then(() => {
                this.$message({
                  message: `用户信息获取成功，并设置Vuex。`,
                  type: 'success',
                  duration: 2000,
                  offset: 60
                })
              })

            // 获取对应的参数配置数组
            let setDatas = []
            if (orderIdType === '评估') {
              setDatas = JSON.parse(data.result.test_set_data)
            } else if (orderIdType === '训练') {
              setDatas = JSON.parse(data.result.train_set_data)
            }
            console.log('该订单包含的所有设备的配置项：\n', setDatas)
            let nextDevice = ''
            let setArray = []
            for (let i = 0; i < setDatas.length; i++) {
              const item = setDatas[i]
              if (item.name === 'PronePosition') {
                setArray = item.settings
                console.log(`对应设备【${item.name}】的配置项：\n`, setArray)
                // 订单的下一个设备（用于结束后提示下一个设备，增加用户体验）
                if (setDatas[i + 1]) {
                  nextDevice = setDatas[i + 1].name
                  console.log('订单的下一个设备名称：', nextDevice)
                }
              }
            }

            // 设置参数配置数组到 Vuex
            this.$store.dispatch('setSettings', setArray).then(() => {
              this.$message({
                message: `参数配置数组获取成功，并设置Vuex。`,
                type: 'success',
                duration: 2000,
                offset: 100
              })
            })

            // 设置订单的下一个设备名称到 Vuex
            this.$store.dispatch('setNextDevice', nextDevice).then(() => {
              if (nextDevice === '') {
                this.$message({
                  message: `本设备为最后一项，并设置Vuex。`,
                  type: 'success',
                  duration: 2000,
                  offset: 140
                })
              } else {
                this.$message({
                  message: `订单的下一个设备名称【${nextDevice}】，并设置Vuex。`,
                  type: 'success',
                  duration: 2000,
                  offset: 140
                })
              }
            })

            // 跳转至任务详情页
            this.$router.push({
              path: '/task',
              query: {
                orderIdType: JSON.stringify(orderIdType)
              }
            })
          } else if (data.status === -9) {
            this.$alert(
              '订单号有误，请重新输入订单号！',
              `状态码[${data.status}]`,
              {
                type: 'error',
                showClose: false,
                center: true,
                confirmButtonText: '确 定',
                callback: () => {
                  this.resetForm()
                }
              }
            )
          } else if (data.status === -13) {
            this.$alert(
              '任务不存在，请重新输入订单号！',
              `状态码[${data.status}]`,
              {
                type: 'error',
                showClose: false,
                center: true,
                confirmButtonText: '确 定',
                callback: () => {
                  this.resetForm()
                }
              }
            )
          } else if (data.status === -14) {
            this.$alert(
              '该设备任务已完成，请前往下一台设备！',
              `状态码[${data.status}]`,
              {
                type: 'error',
                showClose: false,
                center: true,
                confirmButtonText: '确 定',
                callback: () => {
                  this.resetForm()
                }
              }
            )
          }
        })
        .catch(err => {
          this.$alert(
            `[用户输入订单号-环节] ${err}。请确保网络连接正常！`,
            '网络请求错误',
            {
              type: 'error',
              center: false, // 是否居中布局
              showClose: false, // 是否显示右上角关闭按钮
              confirmButtonText: '重 试', // 确定按钮的文本内容
              callback: () => {}
            }
          )
        })
        .finally(() => {
          this.fullscreenLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 86%;
    height: 90%;
    border-radius: 34px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    @include flex(row, center, center);
    position: relative;

    /* 语音相关 */
    .audio-control {
      @include flex(column, center, center);
      position: absolute;
      left: 30px;
      top: 20px;
      .title {
        margin-bottom: 10px;
        font-size: 22px;
        font-weight: 700;
      }
    }

    .content {
      width: 40%;

      .btn {
        margin: 30px;
        @include flex(row, space-around, center);
        .item {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
