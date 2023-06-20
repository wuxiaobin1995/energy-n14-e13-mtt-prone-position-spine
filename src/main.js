/*
 * @Author      : Mr.bin
 * @Date        : 2023-06-16 21:32:53
 * @LastEditTime: 2023-06-20 16:50:42
 * @Description : 渲染进程入口
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/************************************************************/
/* 引入阿里巴巴iconfont图标 */
import '@/assets/icon/iconfont.css'
import '@/assets/icon/iconfont.js' // 用于彩色图标
/* 引入Element-UI组件库 */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
/* 引入Echarts图形库 */
import * as Echarts from 'echarts'
/* 引入moment时间日期库 */
import moment from 'moment'
/* 引入封装好的axios */
import { instance } from '@/api/index.js'
/* 引入封装好的PDF插件 */
import { htmlToPdf } from '@/utils/htmlToPdf.js'
/* 引入进度条插件 */
import QProgress from 'qier-progress'

/* 引入日志文件 */
import { getLogger } from '@/utils/log4js.js'
// /* 引入初始化数据库 */
// import { initDB } from '@/db/index.js'

/* 引入样式重置表和acss，建议放最后 */
import '@/style/cover-output.scss'

/************************************************************/
/* 使用Element-UI组件库 */
Vue.use(ElementUI)
/* 使用Echarts图形库 */
Vue.prototype.$echarts = Echarts
/* 使用moment时间日期库 */
Vue.prototype.$moment = moment
/* 使用封装好的axios */
Vue.prototype.$axios = instance
/* 使用封装好的PDF插件 */
Vue.prototype.$htmlToPdf = htmlToPdf

/* 使用日志文件 */
Vue.prototype.$getLogger = getLogger
// /* 使用数据库 */
// initDB()
//   .open()
//   .catch(() => {
//     alert('打开数据库失败，请重启软件')
//   })

/* 使用进度条插件 */
const qprogress = new QProgress()
router.beforeEach((to, from, next) => {
  qprogress.start() // 每次切换页面时，调用进度条
  next() // 这个一定要加，没有next()页面不会跳转的
})
router.afterEach(() => {
  qprogress.finish() // 在即将进入新的页面组件前，关闭掉进度条
})

/************************************************************/
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
