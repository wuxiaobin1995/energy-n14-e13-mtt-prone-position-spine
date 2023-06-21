<!--
 * @Author      : Mr.bin
 * @Date        : 2023-06-20 17:39:31
 * @LastEditTime: 2023-06-20 21:09:04
 * @Description : 活动度测试-具体测量
-->
<template>
  <div class="flexibility-measure">
    <!-- 语音播放 -->
    <audio ref="audio" controls="controls" hidden :src="audioSrc" />

    <div class="wrapper">
      <!-- 左半部 -->
      <div class="left">
        <div class="top">
          <div class="title">活动度测试</div>
          <div class="text">
            <div class="item">
              缓慢上抬腰腹部至最高，随后缓慢下压至最低，重复3次
            </div>
            <div class="item">注意：保持肩部和臀部紧贴软垫</div>
          </div>
        </div>

        <div class="chart">
          <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
        </div>

        <div class="btn">
          <el-button
            class="item"
            type="primary"
            plain
            @click="handleStart"
            :disabled="isStart"
            >开 始</el-button
          >
          <el-button class="item" type="info" plain @click="handleRefresh"
            >刷新页面</el-button
          >
          <el-button class="item" type="warning" plain @click="handleExit"
            >退出订单</el-button
          >
        </div>
      </div>

      <!-- 右半部 -->
      <div class="right">
        <div class="text">示意动作</div>
        <div class="img">
          <el-image
            :src="imgSrc"
            fit="scale-down"
            @click.native="handleAmplify"
          ></el-image>
        </div>

        <div class="result">
          <div>活动度：{{ flexibility ? flexibility : '待测量' }}</div>
          <div :style="{ 'margin-top': '20px', color: 'green' }">
            推荐值：30~40
          </div>
        </div>
      </div>

      <!-- 图示放大弹窗 -->
      <el-dialog
        title="图 示"
        :visible.sync="imgDialogVisible"
        width="30%"
        center
      >
        <div class="img-dialog">
          <el-image :src="imgSrc" fit="scale-down"></el-image>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* 串口通信库 */
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

export default {
  name: 'flexibility-measure',

  data() {
    return {
      /* 语音相关 */
      audioOpen: this.$store.state.voiceSwitch,
      audioSrc: path.join(__static, `narrate/mandarin/Test/活动度测试.mp3`),

      imgSrc: require('@/assets/img/Test/Flexibility/活动度测试-动作展示.gif'),

      /* 串口相关变量 */
      usbPort: null,
      parser: null,
      scmBaudRate: 115200, // 默认波特率115200

      /* 图形相关变量 */
      myChart: null,
      option: {},
      xData: [], // 横坐标数组

      /* 控制类 */
      isStart: false, // 是否开始
      imgDialogVisible: false, // 图示弹窗

      /* 其他 */
      depthArray: [], // 数据数组
      flexibility: null // 活动度值
    }
  },

  created() {
    this.initSerialPort()
  },
  mounted() {
    if (this.audioOpen === true) {
      setTimeout(() => {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      }, 500)
    }

    this.initChart()
  },
  beforeDestroy() {
    // 关闭串口
    if (this.usbPort) {
      if (this.usbPort.isOpen) {
        this.usbPort.close()
      }
    }
  },

  methods: {
    /**
     * @description: 退出订单
     */
    handleExit() {
      this.$confirm(
        '订单进行中，此操作会退出该订单，之前的数据将会丢失，是否退出？',
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
          this.$router.push({
            path: '/home'
          })
        })
        .catch(() => {})
    },

    /**
     * @description: 图示放大
     */
    handleAmplify() {
      this.imgDialogVisible = true
    },

    /**
     * @description: 初始化串口对象
     */
    initSerialPort() {
      SerialPort.list()
        .then(ports => {
          /* 遍历设备的USB串口，目标设备需安装驱动 */
          let comPath = ''
          for (const port of ports) {
            if (/^USB/.test(port.pnpId)) {
              comPath = port.path
              break
            }
          }

          /* 验证USB有没有连接到电脑，但不能验证有无数据发送给上位机 */
          if (comPath) {
            /**
             * @description: 创建串口实例
             * @param {String} comPath 串行端口的系统路径。例如：在Mac、Linux上的/dev/tty.XXX或Windows上的COM1
             * @param {Object} 配置项
             */
            this.usbPort = new SerialPort(comPath, {
              baudRate: this.scmBaudRate,
              autoOpen: false // 是否自动开启串口
            })
            /* 调用 this.usbPort.open() 成功时触发（开启串口成功） */
            this.usbPort.on('open', () => {
              this.isStart = true
            })
            /* 调用 this.usbPort.open() 失败时触发（开启串口失败） */
            this.usbPort.on('error', () => {
              this.$alert(
                `请重新连接USB线，然后点击"刷新页面"按钮，重新测试！`,
                '串口开启失败',
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
            })

            this.parser = this.usbPort.pipe(new Readline({ delimiter: '\n' }))
            this.parser.on('data', data => {
              const depth = parseInt(data)

              /* 只允许正整数和0，且[0, 100] */
              if (/^-?[0-9]\d*$/.test(depth) && depth >= 0 && depth <= 100) {
                this.depthArray.push(depth)

                // 渲染图形
                this.option.series[0].data = this.depthArray
                this.myChart.setOption(this.option)

                // 完成
                if (this.depthArray.length === 180) {
                  this.finishData()
                }
              }
            })
          } else {
            this.$getLogger('没有检测到USB连接')
            this.$alert(
              `请重新连接USB线，然后点击"刷新页面"按钮，重新测试！`,
              '没有检测到USB连接',
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
          this.$getLogger(err)
          this.$alert(
            `${err}。请重新连接USB线，然后点击"刷新页面"按钮，重新测试！`,
            `初始化SerialPort.list失败`,
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
        })
    },

    /**
     * @description: 初始化echarts图形
     */
    initChart() {
      // 计算横坐标数组
      for (let i = 0; i < 180; i++) {
        this.xData.push(parseFloat((i * 0.1).toFixed(1)))
      }

      this.myChart = this.$echarts.init(document.getElementById('chart'))
      this.option = {
        xAxis: {
          type: 'category',
          name: '秒',
          data: this.xData
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100
        },
        series: [
          {
            data: [],
            type: 'line',
            areaStyle: {
              color: 'rgba(174, 217, 206, 1)'
            },
            lineStyle: {
              color: 'rgba(43, 151, 122, 1)'
            },
            smooth: true,
            showSymbol: false
          }
        ],
        animation: false
      }

      this.myChart.setOption(this.option)
    },

    /**
     * @description: 开始按钮
     */
    handleStart() {
      if (this.usbPort) {
        if (!this.usbPort.isOpen) {
          this.usbPort.open()
        }
      }
    },

    /**
     * @description: 完成该项目
     */
    finishData() {
      // 关闭串口
      if (this.usbPort) {
        if (this.usbPort.isOpen) {
          this.usbPort.close()
        }
      }

      /* 计算活动度值 */
      const maxDepth = Math.max(...this.depthArray)
      const minDepth = Math.min(...this.depthArray)
      this.flexibility = maxDepth - minDepth
      if (this.flexibility === 0) {
        this.$alert(`活动度为0，请点击"刷新页面"按钮，重新测试！`, '提示', {
          type: 'warning',
          showClose: false,
          center: true,
          confirmButtonText: '刷新页面',
          callback: () => {
            this.handleRefresh()
          }
        })
      } else {
        /* 删除 Vuex 参数配置数组的第一个元素 */
        let settings = JSON.parse(JSON.stringify(this.$store.state.settings))
        settings.shift()
        this.$store.dispatch('setSettings', settings).then(() => {
          /* 数据 */
          const obj = {
            pattern: '活动度测试',
            minDepth: minDepth, // 下限
            maxDepth: maxDepth, // 上限
            flexibility: this.flexibility // 活动度值
          }

          /* 暂存至 sessionStorage */
          let resultArray = JSON.parse(
            window.sessionStorage.getItem('resultArray')
          )
          resultArray.push(obj)
          window.sessionStorage.setItem(
            'resultArray',
            JSON.stringify(resultArray)
          )

          if (this.$store.state.settings.length) {
            this.$alert(`请点击“下一项”按钮`, '完成', {
              type: 'success',
              showClose: false,
              center: true,
              confirmButtonText: '下一项',
              callback: () => {
                this.handleFinish()
              }
            })
          } else {
            this.$alert(`请点击“完成订单”按钮`, '完成', {
              type: 'success',
              showClose: false,
              center: true,
              confirmButtonText: '完成订单',
              callback: () => {
                this.handleFinish()
              }
            })
          }
        })
      }
    },

    /**
     * @description: 完成订单或者下一项
     */
    handleFinish() {
      if (this.$store.state.settings.length) {
        // 因为这个只有一个测试，所以没有下一项
      } else {
        // 完成订单
        this.$router.push({
          path: '/test-send'
        })
      }
    },

    /**
     * @description: 刷新页面
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/flexibility-measure'),
          duration: JSON.stringify(300)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flexibility-measure {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 96%;
    height: 94%;
    border-radius: 34px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 26px 40px;
    @include flex(row, stretch, stretch);

    .left {
      flex: 1;
      @include flex(column, stretch, stretch);
      .top {
        @include flex(row, stretch, center);
        .title {
          font-size: 50px;
        }
        .text {
          font-size: 18px;
          margin-left: 50px;
          .item {
            margin-top: 4px;
          }
        }
      }
      .chart {
        flex: 1;
      }
      .btn {
        @include flex(row, center, center);
        .item {
          font-size: 28px;
          margin: 0 30px;
        }
      }
    }

    .right {
      @include flex(column, center, center);
      width: 300px;
      .text {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 10px;
      }
      .img {
        box-shadow: 0 0 8px #929292;
      }
      .result {
        margin-top: 12vh;
        font-size: 22px;
      }
    }

    .img-dialog {
      @include flex(row, center, center);
      transform: scale(2);
    }
  }
}
</style>
